'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface ShareLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string
  url: string
  expiryDate: Date
}

export function ShareLinkModal({
  open,
  onOpenChange,
  fileName,
  url,
  expiryDate,
}: ShareLinkModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Share link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const formatExpiry = (date: Date) => {
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden [&>button]:text-white [&>button]:opacity-50 [&>button]:hover:opacity-100 [&>button]:transition-opacity"
        style={{
          background: '#0F0F0F',
          border: '1px solid rgba(42,42,42,0.8)',
          borderRadius: '16px',
          maxWidth: '440px',
          boxShadow: '0 0 0 1px rgba(34,197,94,0.04), 0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top accent line — green for success state */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.5) 50%, transparent 100%)' }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 pt-6 pb-5"
          style={{ borderBottom: '1px solid rgba(42,42,42,0.6)' }}
        >
          {/* Success icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              boxShadow: '0 0 16px rgba(34,197,94,0.08)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
              <path
                d="M5.5 9l2.5 2.5 4.5-5"
                stroke="#22C55E"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <DialogTitle
              className="text-sm font-semibold leading-none mb-1.5"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              Share Link Ready
            </DialogTitle>
            <p
              className="text-xs leading-none"
              style={{ color: 'rgba(113,113,122,0.7)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              PRESIGNED URL · COPY & SHARE
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">

          {/* File info */}
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(42,42,42,0.6)',
              borderLeft: '2px solid rgba(34,197,94,0.4)',
            }}
          >
            {/* File icon */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.18)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 2.5a1 1 0 0 1 1-1H8l3 3v7a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-9Z"
                  stroke="#F97316"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M8 1.5V4.5h3" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-medium text-white truncate leading-none mb-1.5"
              >
                {fileName}
              </p>
              <div className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <circle cx="5.5" cy="5.5" r="4.5" stroke="rgba(113,113,122,0.4)" strokeWidth="1" />
                  <path d="M5.5 3v3l1.5 1" stroke="rgba(113,113,122,0.4)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  className="text-xs"
                  style={{ color: 'rgba(113,113,122,0.6)', fontFamily: 'var(--font-geist-mono, monospace)' }}
                >
                  Expires {formatExpiry(expiryDate)}
                </span>
              </div>
            </div>
          </div>

          {/* URL display */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p
                className="text-[10px] tracking-widest uppercase"
                style={{ color: 'rgba(113,113,122,0.5)', fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                Share URL
              </p>
              {/* Mini copy shortcut */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] tracking-wider transition-colors duration-150"
                style={{
                  color: copied ? 'rgba(34,197,94,0.7)' : 'rgba(113,113,122,0.5)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
                onMouseEnter={(e) => {
                  if (!copied) (e.currentTarget as HTMLElement).style.color = 'rgba(249,115,22,0.7)'
                }}
                onMouseLeave={(e) => {
                  if (!copied) (e.currentTarget as HTMLElement).style.color = 'rgba(113,113,122,0.5)'
                }}
              >
                {copied ? '✓ COPIED' : 'CLICK TO COPY'}
              </button>
            </div>

            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(42,42,42,0.7)',
              }}
            >
              {/* Link icon — top-left pinned */}
              <div className="absolute left-3 top-3 pointer-events-none">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M5.5 7a3 3 0 0 0 4.24 0l2-2a3 3 0 0 0-4.24-4.24l-1 1"
                    stroke="rgba(113,113,122,0.35)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.5 7a3 3 0 0 0-4.24 0l-2 2a3 3 0 0 0 4.24 4.24l1-1"
                    stroke="rgba(113,113,122,0.35)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Textarea — scrollable, no resize, proper word-break */}
              <textarea
                readOnly
                value={url}
                rows={3}
                onClick={handleCopy}
                className="w-full resize-none outline-none cursor-pointer pl-8 pr-3 pt-2.5 pb-2.5 text-xs leading-relaxed"
                style={{
                  background: 'transparent',
                  color: 'rgba(161,161,170,0.6)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  wordBreak: 'break-all',
                  overflowWrap: 'anywhere',
                }}
                title="Click to copy"
              />
            </div>

            <p
              className="text-[10px] mt-1.5 text-right"
              style={{ color: 'rgba(113,113,122,0.35)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              Click URL to copy · {url.length} chars
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 pb-6 flex gap-2.5"
          style={{ borderTop: '1px solid rgba(42,42,42,0.5)', paddingTop: '20px' }}
        >
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden"
            style={{
              background: copied ? '#22C55E' : '#F97316',
              boxShadow: copied
                ? '0 4px 20px rgba(34,197,94,0.25)'
                : '0 4px 20px rgba(249,115,22,0.25)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                const el = e.currentTarget
                el.style.background = '#EA6C0A'
                el.style.boxShadow = '0 6px 28px rgba(249,115,22,0.35)'
                el.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                const el = e.currentTarget
                el.style.background = '#F97316'
                el.style.boxShadow = '0 4px 20px rgba(249,115,22,0.25)'
                el.style.transform = 'translateY(0)'
              }
            }}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="white" strokeWidth="1.3" />
                  <path d="M9 5V3.5A1.5 1.5 0 0 0 7.5 2H3.5A1.5 1.5 0 0 0 2 3.5V7.5A1.5 1.5 0 0 0 3.5 9H5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Copy Link
              </>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="h-11 px-5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(42,42,42,0.7)',
              color: 'rgba(161,161,170,0.7)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.07)'
              el.style.borderColor = 'rgba(60,60,60,0.8)'
              el.style.color = 'rgba(255,255,255,0.8)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.04)'
              el.style.borderColor = 'rgba(42,42,42,0.7)'
              el.style.color = 'rgba(161,161,170,0.7)'
            }}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
