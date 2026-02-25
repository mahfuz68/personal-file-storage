'use client'

import { X, Database, LogOut } from 'lucide-react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useBucketStore } from '@/store/bucketStore'

export function Header() {
  const { bucketName, disconnect } = useBucketStore()
  const { signOut } = useClerk()
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    disconnect()
    await signOut()
    router.push('/')
  }

  return (
    <header
      className="h-14 flex items-center justify-between px-6 relative"
      style={{
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(42,42,42,0.7)',
      }}
    >
      {/* Top edge accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.35) 50%, transparent 100%)' }}
      />

      {/* Logo / Brand */}
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.22)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 9.5C2 8.12 3.12 7 4.5 7h5C10.88 7 12 8.12 12 9.5S10.88 12 9.5 12h-5C3.12 12 2 10.88 2 9.5Z"
              stroke="#F97316" strokeWidth="1.2"
            />
            <path d="M4.5 7V6a2.5 2.5 0 0 1 5 0v1" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="7" cy="9.5" r="1" fill="#F97316" />
          </svg>
        </div>
        <span
          className="text-xs tracking-widest uppercase hidden sm:block"
          style={{ color: 'rgba(113,113,122,0.7)', fontFamily: 'var(--font-geist-mono, monospace)' }}
        >
          MY File Manager
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Bucket pill */}
        {bucketName && (
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#22C55E', boxShadow: '0 0 5px rgba(34,197,94,0.5)' }}
            />
            <Database className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(34,197,94,0.7)' }} />
            <span className="text-xs max-w-[140px] truncate"
              style={{ color: 'rgba(34,197,94,0.9)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              {bucketName}
            </span>
          </div>
        )}

        {/* User email pill */}
        {user?.primaryEmailAddress && (
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(42,42,42,0.7)' }}
          >
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
              style={{ background: 'rgba(249,115,22,0.2)', color: '#F97316' }}
            >
              {user.primaryEmailAddress.emailAddress[0].toUpperCase()}
            </div>
            <span className="text-xs max-w-[160px] truncate"
              style={{ color: 'rgba(161,161,170,0.6)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              {user.primaryEmailAddress.emailAddress}
            </span>
          </div>
        )}

        {/* Disconnect bucket */}
        {bucketName && (
          <button
            onClick={disconnect}
            title="Disconnect bucket"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
            style={{
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: 'rgba(239,68,68,0.7)',
              fontFamily: 'var(--font-geist-mono, monospace)',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.13)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'
              e.currentTarget.style.color = '#EF4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.07)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'
              e.currentTarget.style.color = 'rgba(239,68,68,0.7)'
            }}
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DISCONNECT</span>
          </button>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(42,42,42,0.6)',
            color: 'rgba(113,113,122,0.6)',
            fontFamily: 'var(--font-geist-mono, monospace)',
            letterSpacing: '0.03em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.borderColor = 'rgba(60,60,60,0.8)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.borderColor = 'rgba(42,42,42,0.6)'
            e.currentTarget.style.color = 'rgba(113,113,122,0.6)'
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SIGN OUT</span>
        </button>
      </div>
    </header>
  )
}
