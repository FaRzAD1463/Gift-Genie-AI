import { Link } from '@tanstack/react-router'
import { Gift, Heart, User, Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { AuthModal } from './AuthModal'

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login')

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 glass-morphism border-b bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl group-hover:magic-glow transition-all">
              <Gift className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">GiftGenie <span className="text-primary italic">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/wizard" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> Find a Gift
            </Link>
            {isAuthenticated && (
              <Link to="/saved" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-1">
                <Heart className="h-4 w-4" /> My Wishlist
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium bg-secondary/50 px-3 py-1.5 rounded-2xl border border-primary/10">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 overflow-hidden">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden lg:inline font-bold">{user?.displayName || user?.email?.split('@')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-xs text-muted-foreground font-black uppercase tracking-widest hover:text-destructive transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => openAuth('login')}
                  className="text-sm font-bold hover:text-primary transition-colors px-4"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => openAuth('signup')}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:magic-glow transition-all active:scale-95 shadow-lg"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-secondary">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-background border-b animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link to="/wizard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-bold py-3 border-b border-primary/5">
              <Sparkles className="h-5 w-5 text-primary" /> Find a Gift
            </Link>
            {isAuthenticated && (
              <Link to="/saved" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-bold py-3 border-b border-primary/5">
                <Heart className="h-5 w-5 text-accent" /> My Wishlist
              </Link>
            )}
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-bold">{user?.displayName || user?.email}</span>
                  </div>
                  <button onClick={logout} className="w-full text-left text-destructive font-black uppercase tracking-widest py-3 border-t border-primary/5">Sign Out</button>
                </div>
              ) : (
                <>
                  <button onClick={() => openAuth('login')} className="w-full text-center font-bold py-3 border border-primary/10 rounded-2xl">Sign In</button>
                  <button onClick={() => openAuth('signup')} className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-xl">Sign Up Free</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode}
      />
    </nav>
  )
}