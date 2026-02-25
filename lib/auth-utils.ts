'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

/**
 * Custom hook to handle authentication redirects
 * This ensures proper redirect behavior after authentication
 */
export function useAuthRedirect(redirectPath = '/storage') {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    // Only redirect if the user is currently on an auth-related page.
    // This avoids forcing a redirect when a signed-in user navigates elsewhere.
    const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
    const authPaths = ['/', '/sign-in', '/sign-up', '/auth']
    const isOnAuthPage = authPaths.some(p => pathname === p || pathname.startsWith(p))
    if (!isOnAuthPage) return

    // Use replace to avoid leaving a history entry, and avoid a full refresh here.
    router.replace(redirectPath)
  }, [isLoaded, isSignedIn, router, redirectPath])
}