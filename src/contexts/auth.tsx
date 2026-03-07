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
  providerRefreshToken: string | null
  loading: boolean
  signInWithGoogle: () => void
  signOut: () => Promise<void>
  refreshProviderToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(!isDemoMode)
  const [providerToken, setProviderToken] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) return

    supabase!.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setProviderToken(data.session?.provider_token ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.provider_token) setProviderToken(s.provider_token)
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
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  async function signOut() {
    await supabase!.auth.signOut()
  }

  async function refreshProviderToken(): Promise<string | null> {
    const refreshToken = session?.provider_refresh_token
    if (!refreshToken) return null

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string,
        client_secret: import.meta.env['VITE_GOOGLE_CLIENT_SECRET'] as string,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!res.ok) return null
    const data = (await res.json()) as { access_token?: string }
    if (!data.access_token) return null
    setProviderToken(data.access_token)
    return data.access_token
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        providerToken,
        providerRefreshToken: session?.provider_refresh_token ?? null,
        loading,
        signInWithGoogle,
        signOut,
        refreshProviderToken,
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
