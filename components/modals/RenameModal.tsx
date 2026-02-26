import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface RenameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  onRename: (newName: string) => void
  isRenaming: boolean
}

export function RenameModal({
  open,
  onOpenChange,
  currentName,
  onRename,
  isRenaming,
}: RenameModalProps) {
  const [newName, setNewName] = useState(currentName)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNewName(currentName)
  }, [currentName])

  useEffect(() => {
    if (open) {
      // slight delay so dialog animation completes before focusing
      const t = setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 80)
      return () => clearTimeout(t)
    }
  }, [open])

  const isValid = newName.trim().length > 0 && newName.trim() !== currentName
  const hasExtension = currentName.includes('.')
  const ext = hasExtension ? currentName.split('.').pop() : null

  const handleRename = () => {
    if (isValid && !isRenaming) {
      onRename(newName.trim())
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden [&>button]:text-white [&>button]:opacity-50 [&>button]:hover:opacity-100 [&>button]:transition-opacity"
        style={{
          background: '#0F0F0F',
          border: '1px solid rgba(42,42,42,0.8)',
          borderRadius: '16px',
          maxWidth: '420px',
          boxShadow: '0 0 0 1px rgba(249,115,22,0.04), 0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top orange accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.55) 50%, transparent 100%)',
          }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 pt-6 pb-5"
          style={{ borderBottom: '1px solid rgba(42,42,42,0.6)' }}
        >
          {/* Pencil icon badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.25)',
              boxShadow: '0 0 16px rgba(249,115,22,0.08)',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path
                d="M12.1 2.1a1.5 1.5 0 0 1 2.12 2.12l-8.5 8.5-2.83.7.7-2.83 8.5-8.5Z"
                stroke="#F97316"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 3.7 13 6.2"
                stroke="#F97316"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <DialogTitle
              className="text-sm font-semibold leading-none mb-1.5"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              Rename File
            </DialogTitle>
            <p
              className="text-xs leading-none"
              style={{
                color: 'rgba(113,113,122,0.7)',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              EDIT · CLOUDFLARE R2
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">

          {/* Current name info chip */}
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(42,42,42,0.6)',
              borderLeft: '2px solid rgba(249,115,22,0.35)',
            }}
          >
            {/* File icon */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.18)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 2.5a1 1 0 0 1 1-1H8l3 3v7a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1v-9Z"
                  stroke="#F97316"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 1.5V4.5h3"
                  stroke="#F97316"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs truncate"
                style={{
                  color: 'rgba(161,161,170,0.75)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                {currentName}
              </p>
            </div>
            {ext && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                style={{
                  background: 'rgba(249,115,22,0.1)',
                  border: '1px solid rgba(249,115,22,0.2)',
                  color: 'rgba(249,115,22,0.7)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                .{ext}
              </span>
            )}
          </div>

          {/* New name input */}
          <div>
            <p
              className="text-[10px] tracking-widest uppercase mb-2.5"
              style={{
                color: 'rgba(113,113,122,0.55)',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              New Name
            </p>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter new name…"
                className="w-full h-11 px-4 rounded-xl text-sm text-white outline-none transition-all duration-200 placeholder:text-[rgba(113,113,122,0.4)]"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: focused
                    ? '1px solid rgba(249,115,22,0.45)'
                    : '1px solid rgba(42,42,42,0.75)',
                  boxShadow: focused
                    ? '0 0 0 3px rgba(249,115,22,0.08)'
                    : 'none',
                }}
              />
              {/* Character count */}
              {newName.length > 0 && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none select-none"
                  style={{
                    color: 'rgba(113,113,122,0.35)',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  {newName.length}
                </span>
              )}
            </div>

            {/* Validation hint */}
            <div className="mt-2 h-4">
              {newName.trim() && newName.trim() === currentName && (
                <p
                  className="text-[11px] flex items-center gap-1.5"
                  style={{
                    color: 'rgba(234,179,8,0.65)',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <circle cx="5.5" cy="5.5" r="4.5" stroke="rgba(234,179,8,0.6)" strokeWidth="1" />
                    <path d="M5.5 3.5v2.5" stroke="rgba(234,179,8,0.6)" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="5.5" cy="7.5" r="0.5" fill="rgba(234,179,8,0.6)" />
                  </svg>
                  Name is the same as the current one
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 pb-6 flex gap-2.5"
          style={{ borderTop: '1px solid rgba(42,42,42,0.5)', paddingTop: '20px' }}
        >
          {/* Cancel */}
          <button
            onClick={() => onOpenChange(false)}
            disabled={isRenaming}
            className="h-11 px-5 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40"
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
            Cancel
          </button>

          {/* Rename */}
          <button
            onClick={handleRename}
            disabled={!isValid || isRenaming}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: isValid && !isRenaming ? '#F97316' : 'rgba(249,115,22,0.4)',
              boxShadow: isValid && !isRenaming ? '0 4px 20px rgba(249,115,22,0.25)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (isValid && !isRenaming) {
                const el = e.currentTarget
                el.style.background = '#EA6C0A'
                el.style.boxShadow = '0 6px 28px rgba(249,115,22,0.35)'
                el.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (isValid && !isRenaming) {
                const el = e.currentTarget
                el.style.background = '#F97316'
                el.style.boxShadow = '0 4px 20px rgba(249,115,22,0.25)'
                el.style.transform = 'translateY(0)'
              }
            }}
          >
            {isRenaming ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Renaming…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M10.1 1.6a1.2 1.2 0 0 1 1.7 1.7L4.7 10.4l-2.2.55.55-2.2 7.05-7.15Z"
                    stroke="white"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M8.7 3 11 5.3" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Rename
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}