import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '#/lib/supabase'
import { signInWithGoogle } from '#/lib/google-auth'
import { refreshGoogleToken } from '#/lib/server/refresh-google-token'

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
  const [loading, setLoading] = useState(true)
  const [providerToken, setProviderToken] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode || !supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setProviderToken(data.session?.provider_token ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.provider_token) setProviderToken(s.provider_token)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  function handleSignInWithGoogle() {
    signInWithGoogle({ requestOfflineAccess: true })
  }

  async function signOut() {
    await supabase?.auth.signOut()
  }

  async function refreshProviderToken(): Promise<string | null> {
    const refreshToken = session?.provider_refresh_token
    if (!refreshToken) return null

    const accessToken = await refreshGoogleToken({ data: { refreshToken } })
    if (!accessToken) return null
    setProviderToken(accessToken)
    return accessToken
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        providerToken,
        providerRefreshToken: session?.provider_refresh_token ?? null,
        loading,
        signInWithGoogle: handleSignInWithGoogle,
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
