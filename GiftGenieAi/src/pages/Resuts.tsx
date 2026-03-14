import { useSearch, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { giftGenieAgent, GiftRecommendation } from '../lib/agent'
import { useAuth } from '../hooks/useAuth'
import { blink } from '../blink/client'
import { 
  Sparkles, 
  ExternalLink, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ChevronRight, 
  RotateCcw,
  Search,
  MessageCircle,
  Gift
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { AuthModal } from '../components/layout/AuthModal'

export default function Results() {
  const search = useSearch({ from: '/results' }) as any
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  
  const hasFetched = useRef(false)

  // Load saved gifts when the component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      blink.db.savedGifts.list({ where: { userId: user.id } })
        .then(data => {
          const names = new Set(data.map(g => g.name))
          setSavedIds(names)
        })
        .catch(console.error)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (hasFetched.current) return
    
    async function fetchRecommendations() {
      setLoading(true)
      setError(null)
      
      try {
        const prompt = search.q 
          ? `Find gifts for: ${search.q}`
          : `Find gifts for:
             Recipient: ${search.recipient}
             Age: ${search.age || 'Not specified'}
             Occasion: ${search.occasion || 'Not specified'}
             Budget: ${search.budget}
             Interests: ${search.interests}
             Location: ${search.location || 'Not specified'}`

        const response = await giftGenieAgent.generate({ prompt })
        
        let data: GiftRecommendation[] = []
        try {
          const jsonMatch = response.text.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            data = JSON.parse(jsonMatch[0])
          } else {
            const structured = await blink.ai.generateObject({
              prompt: `Convert this list into a structured JSON array of gift objects with name, priceRange, store, url, description, whyItMatches, shippingInfo:\n\n${response.text}`,
              schema: {
                type: 'object',
                properties: {
                  gifts: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        priceRange: { type: 'string' },
                        store: { type: 'string' },
                        url: { type: 'string' },
                        description: { type: 'string' },
                        whyItMatches: { type: 'string' },
                        shippingInfo: { type: 'string' }
                      },
                      required: ['name', 'priceRange', 'store', 'description', 'whyItMatches']
                    }
                  }
                }
              }
            })
            data = (structured.object as any).gifts
          }
        } catch (e) {
          console.error('Failed to parse recommendations:', e)
          setError('Genie got a bit confused while searching. Let\'s try again!')
        }
        
        setRecommendations(data)
      } catch (err: any) {
        console.error('Agent error:', err)
        
        const isAuthError = 
          err?.name === 'BlinkAuthError' || 
          err?.code === 'HTTP 401' || 
          err?.message?.includes('401') ||
          err?.details?.originalError?.name === 'BlinkAuthError'

        if (isAuthError) {
          toast.error('Genie needs you to sign in to access his magic search!')
          setIsAuthModalOpen(true)
          return
        }

        setError('The magical connection was interrupted. Please try again.')
      } finally {
        setLoading(false)
        hasFetched.current = true
      }
    }

    fetchRecommendations()
  }, [search])

  const toggleSave = async (gift: GiftRecommendation) => {
    if (!isAuthenticated) {
      toast.error('Sign in to save gifts to your wishlist!')
      setIsAuthModalOpen(true)
      return
    }

    try {
      const giftId = `gift_${Math.random().toString(36).substring(2, 11)}`
      
      if (savedIds.has(gift.name)) {
        toast.success('Removed from wishlist')
        setSavedIds(prev => {
          const next = new Set(prev)
          next.delete(gift.name)
          return next
        })
      } else {
        await blink.db.savedGifts.create({
          id: giftId,
          userId: user?.id,
          name: gift.name,
          priceRange: gift.priceRange,
          store: gift.store,
          url: gift.url,
          description: gift.description,
          whyItMatches: gift.whyItMatches,
          shippingInfo: gift.shippingInfo
        })
        
        setSavedIds(prev => new Set([...prev, gift.name]))
        toast.success('Magic! Gift saved to your wishlist.')
      }
    } catch (err) {
      console.error('Save error:', err)
      toast.error('Failed to save gift')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 bg-secondary/10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <Sparkles className="h-24 w-24 text-primary relative z-10" />
        </motion.div>
        <h2 className="font-display text-4xl font-bold mb-4 text-center">Consulting the Magic...</h2>
        <p className="text-muted-foreground text-lg text-center max-w-md animate-pulse px-6">
          Genie is scouring the vast lands of the internet to find the most thoughtful gifts just for you.
        </p>
        
        <div className="mt-12 flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
              className="h-3 w-3 bg-primary rounded-full"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-destructive/10 p-8 rounded-3xl border border-destructive/20 text-center max-w-lg">
          <MessageCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold mb-4 text-destructive">Oops! A Magic Mishap</h2>
          <p className="text-muted-foreground mb-8 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto hover:magic-glow transition-all"
          >
            <RotateCcw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Magic Results Found</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Curated <span className="text-primary italic">Treasures</span></h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            Based on your request, we've handpicked these items that match your criteria, budget, and recipient's personality.
          </p>
        </div>
        <button 
          onClick={() => navigate({ to: '/wizard' })}
          className="flex items-center gap-2 bg-secondary/80 text-secondary-foreground px-6 py-4 rounded-2xl font-bold hover:bg-secondary transition-all border border-primary/10 backdrop-blur-sm"
        >
          <Search className="h-4 w-4" /> Start New Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {recommendations.map((gift, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-background rounded-[2.5rem] border border-primary/10 overflow-hidden magic-shadow hover:border-primary/40 transition-all flex flex-col"
            >
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:magic-glow transition-all">
                    <Gift className="h-7 w-7" />
                  </div>
                  <button 
                    onClick={() => toggleSave(gift)}
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${savedIds.has(gift.name) ? 'bg-accent text-white shadow-lg scale-110' : 'bg-secondary hover:bg-accent/10 hover:text-accent text-muted-foreground'}`}
                  >
                    <Heart className={`h-6 w-6 ${savedIds.has(gift.name) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{gift.name}</h3>
                <div className="flex items-center gap-2 text-primary font-bold text-xl mb-6">
                  <ShoppingBag className="h-5 w-5" />
                  <span>{gift.priceRange}</span>
                  <span className="text-muted-foreground text-xs font-black uppercase tracking-widest ml-2 bg-secondary px-2.5 py-1 rounded-lg">at {gift.store}</span>
                </div>

                <p className="text-muted-foreground text-sm mb-8 leading-relaxed line-clamp-4">
                  {gift.description}
                </p>

                <div className="bg-secondary/40 rounded-3xl p-6 mb-8 border border-primary/5">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
                    <Sparkles className="h-3 w-3" /> Genie Logic
                  </h4>
                  <p className="text-sm text-secondary-foreground leading-relaxed italic opacity-80">
                    "{gift.whyItMatches}"
                  </p>
                </div>

                {gift.shippingInfo && (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/30 px-4 py-2 rounded-xl w-fit mb-4">
                    <Truck className="h-3 w-3" />
                    <span>{gift.shippingInfo}</span>
                  </div>
                )}
              </div>
              
              <div className="p-8 pt-0">
                <a 
                  href={gift.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-5 rounded-2xl font-bold hover:magic-glow transition-all group-hover:scale-[1.02] active:scale-95 shadow-xl text-lg"
                >
                  View on {gift.store} <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-20 bg-primary/5 rounded-[4rem] p-12 md:p-20 border border-primary/10 text-center relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -top-10 -left-10 h-64 w-64 bg-accent/5 rounded-full blur-3xl" />
        
        <h3 className="font-display text-4xl font-bold mb-6">Didn't find the perfect magic?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-xl leading-relaxed">
          The genie's library is vast. Refine your request or use our guided wizard to explore more specific mystical treasures.
        </p>
        <button 
          onClick={() => navigate({ to: '/wizard' })}
          className="bg-background text-foreground px-12 py-6 rounded-[2rem] font-bold shadow-2xl hover:shadow-primary/20 transition-all border border-primary/20 hover:border-primary flex items-center gap-3 mx-auto group text-lg"
        >
          Refine My Request <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}