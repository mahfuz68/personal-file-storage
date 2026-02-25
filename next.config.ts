import type { NextConfig } from 'next'

const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stop MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Restrict Referer header to same origin
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable legacy XSS auditor (modern browsers) and enable blocking mode
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Disable interest-cohort FLoC tracking
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // Content Security Policy – tightened for a Next.js dark-theme SPA
  // 'unsafe-inline' for styles is required by Tailwind/shadcn; remove when
  // you adopt CSS-in-JS with nonces or hash-based CSP.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + Next.js inline bootstrap + Clerk
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev",
      // Workers: allow blob URLs for web workers
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      // Styles: inline required by Tailwind v4
      "style-src 'self' 'unsafe-inline'",
      // Images: allow data URIs and blob URLs (file previews)
      "img-src 'self' data: blob:",
      // Fonts: self only
      "font-src 'self'",
      // Connections: self + Cloudflare R2 presigned URLs + Clerk API + telemetry
      "connect-src 'self' https://*.r2.cloudflarestorage.com https://*.clerk.accounts.dev https://clerk-telemetry.com",
      // No frames/objects
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
