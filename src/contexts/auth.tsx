import {
  createContext,
  useContext,
  useEffect,
  useState
  
} from 'react'
import type {ReactNode} from 'react';
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '#/lib/supabase'

type AuthContextValue = {
  user: User | null
  providerToken: string | null
  loading: boolean
  signInWithGoogle: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(!isDemoMode)

  useEffect(() => {
    if (isDemoMode) return

    supabase!.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  function signInWithGoogle() {
    void supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
        redirectTo: window.location.origin,
      },
    })
  }

  async function signOut() {
    await supabase!.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        providerToken: session?.provider_token ?? null,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
