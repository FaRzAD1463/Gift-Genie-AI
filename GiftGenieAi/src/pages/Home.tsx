import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Sparkles, Wand2, Heart, Gift, ShoppingBag, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { AuthModal } from '../components/layout/AuthModal'

export default function Home() {
  const [query, setQuery] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleMagicSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      toast.error('Please enter what you\'re looking for!')
      return
    }
    navigate({ to: '/results', search: { q: query } })
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-secondary/30">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-8 ring-1 ring-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>Magical Gift Recommendations</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-foreground"
          >
            Find the <span className="text-primary italic">Perfect Gift</span> <br /> 
            in Seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            GiftGenie AI searches the entire web to find thoughtful, personalized gift ideas 
            tailored specifically to your recipient, budget, and occasion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <form onSubmit={handleMagicSearch} className="group relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="A gift for my 10yo brother who loves space and lego..."
                className="w-full bg-background/80 backdrop-blur-xl border-2 border-primary/20 rounded-2xl px-6 py-5 md:py-6 pl-14 text-lg focus:outline-none focus:border-primary focus:magic-glow transition-all shadow-xl group-hover:border-primary/40 placeholder:text-muted-foreground/60"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6 group-focus-within:text-primary transition-colors" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <Wand2 className="h-4 w-4" />
                <span>Generate</span>
              </button>
            </form>
            <p className="mt-6 text-sm text-muted-foreground">
              Not sure? <button onClick={() => navigate({ to: '/wizard' })} className="text-primary font-bold underline underline-offset-4 hover:text-primary/80 transition-colors">Use our Guided Wizard</button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Multi-Store Search</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We scour Amazon, Etsy, eBay, and specialty boutiques to find items you won't see anywhere else.
            </p>
          </div>
          <div className="text-center group">
            <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Personalized Ranking</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our AI analyzes reviews and descriptions to rank gifts based on how well they match your recipient.
            </p>
          </div>
          <div className="text-center group">
            <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-display">Shipping & Prices</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get estimated delivery times and compare prices across multiple platforms instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-background rounded-[3rem] p-12 md:p-20 shadow-2xl border border-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Gift className="h-32 w-32 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Never forget a <span className="text-primary italic">perfect idea</span> again.</h2>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Create a free account to save your favorite discoveries, track prices, and build the ultimate gift wishlist for every occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-bold text-lg hover:magic-glow transition-all shadow-xl active:scale-95"
              >
                Sign Up for Free
              </button>
              <button 
                onClick={() => navigate({ to: '/wizard' })}
                className="bg-secondary text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-secondary/80 transition-all active:scale-95 border border-primary/10"
              >
                Try the Wizard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-accent/5 border-y border-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-12">Thousands of magic gifts delivered.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="font-display text-2xl font-black italic">AMAZON</div>
            <div className="font-display text-2xl font-black italic">ETSY</div>
            <div className="font-display text-2xl font-black italic">EBAY</div>
            <div className="font-display text-2xl font-black italic">SHOPIFY</div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode="signup" />
    </div>
  )
}