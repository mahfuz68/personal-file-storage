'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSignIn, useAuth } from '@clerk/nextjs'
import { useAuthRedirect } from '@/lib/auth-utils'

export default function Home() {
  const router = useRouter()
  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { signIn, isLoaded: signInLoaded } = useSignIn()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const emailRef = useRef<HTMLInputElement>(null)

  // Use the auth redirect hook to handle signed-in redirects
  useAuthRedirect('/storage')

  // Auto-focus email
  useEffect(() => {
    const t = setTimeout(() => emailRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  const clearError = () => { if (error) setError('') }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!signInLoaded) return
    setError('')

    if (!email.trim()) { setError('Email is required'); return }
    if (!password)     { setError('Password is required'); return }

    setLoading(true)
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password
      })

      if (result.status === 'complete') {
        console.log('Sign-in successful for email:')
        // Redirect immediately to ensure smooth transition
        router.push('/storage')
        router.refresh() // Force refresh to ensure proper state
      } else if (result.status === 'needs_first_factor') {
        // Handle multi-factor authentication if enabled
        setError('Additional authentication required. Contact your administrator.')
      } else {
        setError('Sign in incomplete. Please try again.')
      }
    } catch (err: unknown) {
      console.error('Clerk sign-in error:', err)
      console.log('Attempting to sign in with email:', email.trim())

      let errorMsg = 'Something went wrong. Please try again.'

      if (err instanceof Error) {
        // Check if this is a Clerk-specific error
        if ('errors' in err) {
          const clerkErr = err as { errors?: { message: string; code?: string }[] }
          const firstError = clerkErr.errors?.[0]
          if (firstError) {
            // Handle specific error codes
            switch(firstError.code) {
              case 'form_password_incorrect':
                errorMsg = 'Password is incorrect. Please try again.'
                break
              case 'form_identifier_not_found':
                errorMsg = 'No account found with this email. Please check your email or sign up for a new account.'
                break
              case 'form_password_missing':
                errorMsg = 'Password is required.'
                break
              default:
                errorMsg = firstError.message || 'Invalid credentials. Please try again.'
            }
          }
        } else {
          errorMsg = err.message || errorMsg
        }
      }

      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbitSpin        { to { transform: rotate(360deg);  } }
        @keyframes orbitSpinReverse { to { transform: rotate(-360deg); } }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; filter: blur(40px); }
          50%       { opacity: 1;   filter: blur(60px); }
        }
        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(249,115,22,0); }
        }

        .anim-1 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .anim-2 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.18s both; }
        .anim-3 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.30s both; }
        .anim-4 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.44s both; }
        .anim-5 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.58s both; }
        .anim-6 { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.72s both; }

        .orbit-ring-1 { animation: orbitSpin 12s linear infinite; }
        .orbit-ring-2 { animation: orbitSpinReverse 18s linear infinite; }
        .status-dot   { animation: statusPulse 2s ease-in-out infinite; }
        .mono { font-family: var(--font-geist-mono, 'Courier New', monospace); }

        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* left icon gap = 11px left + 14px icon + 8px gap = ~36px left padding */
        .auth-input {
          width: 100%;
          height: 44px;
          background: #0D0D0D;
          border: 1px solid #242424;
          border-radius: 10px;
          color: white;
          font-size: 14px;
          padding: 0 14px 0 36px;   /* right 14px default (email); password overrides right */
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: var(--font-geist-sans, sans-serif);
          box-sizing: border-box;
        }
        .auth-input.has-right-btn { padding-right: 36px; }
        .auth-input:focus {
          border-color: #F97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12), 0 0 20px rgba(249,115,22,0.06);
        }
        .auth-input::placeholder { color: #3A3A3A; }
        .auth-input.error-state  { border-color: rgba(239,68,68,0.5) !important; }

        .input-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .input-icon-right {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .auth-btn {
          width: 100%;
          height: 44px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          background: #F97316;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .auth-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .auth-btn:hover:not(:disabled)::before { opacity: 1; }
        .auth-btn:hover:not(:disabled) {
          background: #EA6C0A;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(249,115,22,0.35);
        }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .feature-card {
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.3s ease, background 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-3px);
          border-color: rgba(249,115,22,0.3);
          background: rgba(249,115,22,0.03);
        }
      `}</style>

      <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col">

        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 pointer-events-none" />

        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '25%', left: '50%',
            width: '700px', height: '500px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.07) 0%, transparent 70%)',
            animation: 'pulseGlow 6s ease-in-out infinite',
          }}
        />

        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.5) 50%, transparent 100%)' }}
        />

        {/* Corner brackets */}
        {['top-5 left-5 border-t border-l', 'top-5 right-5 border-t border-r',
          'bottom-5 left-5 border-b border-l', 'bottom-5 right-5 border-b border-r',
        ].map((cls, i) => (
          <div key={i} className={`absolute w-8 h-8 ${cls} border-[#2A2A2A] pointer-events-none opacity-50`} />
        ))}

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-8 pt-6 anim-1">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 9.5C2 8.12 3.12 7 4.5 7h5C10.88 7 12 8.12 12 9.5S10.88 12 9.5 12h-5C3.12 12 2 10.88 2 9.5Z" stroke="#F97316" strokeWidth="1.2"/>
                <path d="M4.5 7V6a2.5 2.5 0 0 1 5 0v1" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="7" cy="9.5" r="1" fill="#F97316"/>
              </svg>
            </div>
            <span className="mono text-xs tracking-widest text-[#444] uppercase">MY File Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot inline-block w-2 h-2 rounded-full bg-[#F97316]" />
            <span className="mono text-xs text-[#444] tracking-wider">SECURE</span>
          </div>
        </nav>

        {/* Main */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">

          {/* Orbital logo */}
          <div className="anim-1 mb-8 relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
            <div className="orbit-ring-1 absolute inset-0">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <ellipse cx="50" cy="50" rx="46" ry="17" stroke="rgba(249,115,22,0.2)" strokeWidth="1" strokeDasharray="4 6"/>
              </svg>
            </div>
            <div className="orbit-ring-2 absolute" style={{ inset: 12 }}>
              <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
                <circle cx="38" cy="38" r="34" stroke="rgba(249,115,22,0.12)" strokeWidth="1" strokeDasharray="2 8"/>
              </svg>
            </div>
            <div
              className="relative w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #1A1A1A 0%, #111 100%)',
                border: '1px solid rgba(249,115,22,0.3)',
                boxShadow: '0 0 40px rgba(249,115,22,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <path d="M8 22a5 5 0 0 1 0-10h.5A6 6 0 0 1 20 10.5a4.5 4.5 0 1 1 .5 9H8Z"
                  fill="rgba(249,115,22,0.15)" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M16 18v-6M13 15l3-3 3 3" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#F97316] flex items-center justify-center"
                style={{ boxShadow: '0 0 8px rgba(249,115,22,0.7)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="anim-2 text-center mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white" style={{ letterSpacing: '-0.03em' }}>
              MY File Manager
            </h1>
          </div>

          {/* Subline */}
          <div className="anim-3 text-center mb-8 max-w-sm">
            <p className="text-[#4A4A4A] text-sm leading-relaxed">
              Sign in to access your Cloudflare R2 storage.
            </p>
          </div>

          {/* Auth card */}
          <div
            className="anim-4 w-full max-w-sm relative"
            style={{
              background: '#0F0F0F',
              border: '1px solid #1C1C1C',
              borderRadius: '16px',
              boxShadow: '0 0 0 1px rgba(249,115,22,0.04), 0 24px 64px rgba(0,0,0,0.55)',
              padding: '24px',
            }}
          >
            {/* Card top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-px rounded-t-2xl pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)' }}
            />

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-3">

                {/* Email */}
                <div>
                  <label className="mono text-[10px] tracking-widest text-[#444] uppercase block mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <span className="input-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="rgba(113,113,122,0.45)" strokeWidth="1.2"/>
                        <path d="M1.5 5l5.5 3.5L12.5 5" stroke="rgba(113,113,122,0.45)" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError() }}
                      placeholder="you@example.com"
                      disabled={loading}
                      className={`auth-input ${error && !password ? 'error-state' : ''}`}
                      autoComplete="email"
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mono text-[10px] tracking-widest text-[#444] uppercase block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="input-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="rgba(113,113,122,0.45)" strokeWidth="1.2"/>
                        <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="rgba(113,113,122,0.45)" strokeWidth="1.2" strokeLinecap="round"/>
                        <circle cx="7" cy="9.5" r="1" fill="rgba(113,113,122,0.45)"/>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearError() }}
                      placeholder="••••••••"
                      disabled={loading}
                      className="auth-input has-right-btn"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="input-icon-right"
                      style={{ opacity: 0.4, transition: 'opacity 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M1 7.5S3.5 3 7.5 3s6.5 4.5 6.5 4.5S11.5 12 7.5 12 1 7.5 1 7.5Z" stroke="white" strokeWidth="1.2"/>
                          <circle cx="7.5" cy="7.5" r="2" stroke="white" strokeWidth="1.2"/>
                          <path d="M2 2l11 11" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M1 7.5S3.5 3 7.5 3s6.5 4.5 6.5 4.5S11.5 12 7.5 12 1 7.5 1 7.5Z" stroke="white" strokeWidth="1.2"/>
                          <circle cx="7.5" cy="7.5" r="2" stroke="white" strokeWidth="1.2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
                    style={{
                      background: 'rgba(239,68,68,0.07)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderLeft: '2px solid rgba(239,68,68,0.5)',
                    }}
                  >
                    <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="rgba(239,68,68,0.7)" strokeWidth="1.1"/>
                      <path d="M7 4v3.5M7 9.5v.5" stroke="rgba(239,68,68,0.8)" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(239,68,68,0.85)' }}>{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} className="auth-btn mt-1">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                        <path d="M7 1.5a5.5 5.5 0 0 1 5.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7h9M8.5 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Feature cards */}
          <div className="anim-5 w-full max-w-sm grid grid-cols-3 gap-2.5 mt-8">
            {[
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v8M5 7l3 3 3-3" stroke="#F97316" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 12h10" stroke="#F97316" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                ),
                label: 'UPLOAD', title: 'Fast Uploads', desc: 'Streams via presigned URL',
              },
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="#F97316" strokeWidth="1.4"/>
                    <path d="M5 5V4a3 3 0 0 1 6 0v1" stroke="#F97316" strokeWidth="1.4" strokeLinecap="round"/>
                    <circle cx="8" cy="9.5" r="1.2" fill="#F97316"/>
                  </svg>
                ),
                label: 'AUTH', title: 'Secure Access', desc: 'Clerk-powered auth',
              },
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h8M2 12h10" stroke="#F97316" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M12 10l2 2-2 2" stroke="#F97316" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'BROWSE', title: 'Easy Navigation', desc: 'Full folder hierarchy',
              },
            ].map((f) => (
              <div
                key={f.label}
                className="feature-card rounded-xl p-3.5"
                style={{
                  background: '#0E0E0E',
                  border: '1px solid #1A1A1A',
                  borderLeft: '2px solid rgba(249,115,22,0.25)',
                }}
              >
                <div
                  className="mb-2.5 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.12)' }}
                >
                  {f.icon}
                </div>
                <p className="mono text-[9px] tracking-widest text-[#F97316] mb-1 opacity-55">{f.label}</p>
                <p className="text-xs font-medium text-white mb-0.5 leading-none">{f.title}</p>
                <p className="text-[10px] text-[#333] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="anim-6 relative z-10 flex items-center justify-center pb-6 pt-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#1E1E1E]" />
            <span className="mono text-[10px] text-[#252525] tracking-widest">
              CLOUDFLARE R2 · CLERK AUTH · S3 COMPATIBLE
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#1E1E1E]" />
          </div>
        </footer>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.2) 50%, transparent 100%)' }}
        />
      </div>
    </>
  )
}
