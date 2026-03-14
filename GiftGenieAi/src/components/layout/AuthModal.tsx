import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../ui/dialog'
import { Gift, Mail, Lock, User, Github, Chrome, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signInWithEmail, signUp, signInWithGoogle, signInWithGitHub } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password)
      } else {
        await signUp({ email, password, displayName })
      }
      onClose()
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background rounded-3xl border-primary/10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <DialogHeader className="pt-8 text-center sm:text-center flex flex-col items-center">
          <div className="bg-primary/10 p-3 rounded-2xl mb-4 ring-1 ring-primary/20">
            <Gift className="text-primary h-6 w-6" />
          </div>
          <DialogTitle className="font-display text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Join GiftGenie AI'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            {mode === 'login' 
              ? 'Find and save your magical gift ideas' 
              : 'Start your journey to perfect gift-giving'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {mode === 'signup' && (
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-xl px-12 py-3 outline-none transition-all"
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          )}
          
          <div className="relative">
            <input
              type="email"
              placeholder="Magic Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-xl px-12 py-3 outline-none transition-all"
              required
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Secret Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-xl px-12 py-3 outline-none transition-all"
              required
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:magic-glow transition-all hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-primary/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => signInWithGoogle()}
            className="flex items-center justify-center gap-2 bg-secondary/50 border border-primary/10 py-3 rounded-xl hover:bg-secondary transition-all font-medium"
          >
            <Chrome className="h-4 w-4" /> Google
          </button>
          <button
            onClick={() => signInWithGitHub()}
            className="flex items-center justify-center gap-2 bg-secondary/50 border border-primary/10 py-3 rounded-xl hover:bg-secondary transition-all font-medium"
          >
            <Github className="h-4 w-4" /> GitHub
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <button 
                onClick={() => setMode('signup')}
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Sign up now
              </button>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button 
                onClick={() => setMode('login')}
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}