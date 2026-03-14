import { useEffect, useState } from 'react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import { 
  Heart, 
  ExternalLink, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  Gift, 
  ArrowRight,
  Truck,
  Loader2,
  Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { toast } from 'react-hot-toast'
import { AuthModal } from '../components/layout/AuthModal'

export default function SavedGifts() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [gifts, setGifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSavedGifts()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [isAuthenticated, user, authLoading])

  async function fetchSavedGifts() {
    setLoading(true)
    try {
      const data = await blink.db.savedGifts.list({
        where: { userId: user?.id },
        orderBy: { createdAt: 'desc' }
      })
      setGifts(data)
    } catch (err) {
      console.error('Fetch saved gifts error:', err)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeGift = async (id: string) => {
    try {
      await blink.db.savedGifts.delete(id)
      setGifts(prev => prev.filter(g => g.id !== id))
      toast.success('Gift removed from wishlist')
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to remove gift')
    }
  }

  if (authLoading || (isAuthenticated && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-secondary/30 p-12 rounded-[3rem] border border-primary/10 relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 h-40 w-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
          
          <div className="h-24 w-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8 ring-1 ring-primary/20 magic-glow">
            <Lock className="h-10 w-10" />
          </div>
          
          <h2 className="font-display text-4xl font-bold mb-6">Unlock Your <span className="text-primary italic">Wishlist</span></h2>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            Create an account to securely store your magical gift discoveries and access them from any device.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold text-lg hover:magic-glow transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
            >
              Sign Up for Free
            </button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>

          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
            <Heart className="h-4 w-4" />
            <span>Magical Wishlist</span>
          </div>
          <h1 className="font-display text-5xl font-bold mb-4">My <span className="text-primary italic">Treasures</span></h1>
          <p className="text-muted-foreground text-lg">Your collection of thoughtfully curated magical gifts.</p>
        </div>
        <div className="flex bg-secondary/50 px-8 py-5 rounded-3xl border border-primary/10 items-center gap-6 backdrop-blur-sm">
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Total Saved</p>
            <p className="text-3xl font-display font-bold text-primary">{gifts.length}</p>
          </div>
          <div className="h-12 w-[1px] bg-primary/20" />
          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary magic-glow">
            <Gift className="h-7 w-7" />
          </div>
        </div>
      </div>

      {gifts.length === 0 ? (
        <div className="bg-secondary/20 border-2 border-dashed border-primary/20 rounded-[4rem] py-32 text-center group">
          <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-all">
            <Gift className="h-10 w-10 text-primary/30" />
          </div>
          <h3 className="font-display text-3xl font-bold mb-4 opacity-60">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-12 text-lg max-w-sm mx-auto">Start searching to find the perfect magic treasures for your loved ones.</p>
          <Link 
            to="/wizard"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-12 py-5 rounded-2xl font-bold hover:magic-glow transition-all shadow-xl group/btn"
          >
            Find a Gift <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {gifts.map((gift) => (
              <motion.div
                key={gift.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-background rounded-[2.5rem] border border-primary/10 overflow-hidden magic-shadow flex flex-col group hover:border-primary/40 transition-all"
              >
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-8">
                    <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:magic-glow transition-all">
                      <Gift className="h-7 w-7" />
                    </div>
                    <button 
                      onClick={() => removeGift(gift.id)}
                      className="h-12 w-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <h3 className="font-display text-2xl font-bold mb-3">{gift.name}</h3>
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
                      "{gift.why_it_matches || gift.whyItMatches}"
                    </p>
                  </div>

                  {gift.shippingInfo && (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/30 px-4 py-2 rounded-xl w-fit">
                      <Truck className="h-3 w-3" />
                      <span>{gift.shippingInfo}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-8 pt-0 mt-auto">
                  <a 
                    href={gift.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-5 rounded-2xl font-bold hover:magic-glow transition-all active:scale-95 shadow-xl text-lg"
                  >
                    Get it from {gift.store} <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}