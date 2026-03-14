import { useEffect, useState } from 'react'
import { blink } from '../blink/client'
import { toast } from 'react-hot-toast'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error)
    // Use property checks instead of instanceof since BlinkAuthError class might not be exported
    const message = error?.userMessage || error?.message || 'An unexpected authentication error occurred.'
    toast.error(message)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login: () => {
      try {
        blink.auth.login()
      } catch (e) {
        handleAuthError(e)
      }
    },
    signInWithEmail: async (email: string, pass: string) => {
      try {
        await blink.auth.signInWithEmail(email, pass)
        toast.success('Welcome back to GiftGenie!')
      } catch (e) {
        handleAuthError(e)
        throw e
      }
    },
    signUp: async (data: { email: string; password?: string; displayName?: string }) => {
      try {
        await blink.auth.signUp(data)
        toast.success('Your magical account is ready!')
      } catch (e) {
        handleAuthError(e)
        throw e
      }
    },
    signInWithGoogle: async () => {
      try {
        await blink.auth.signInWithGoogle()
      } catch (e) {
        handleAuthError(e)
      }
    },
    signInWithGitHub: async () => {
      try {
        await blink.auth.signInWithGitHub()
      } catch (e) {
        handleAuthError(e)
      }
    },
    logout: async () => {
      try {
        await blink.auth.signOut()
        toast.success('See you soon!')
      } catch (e) {
        console.error('Logout error:', e)
      }
    }
  }
}
