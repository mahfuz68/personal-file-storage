import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface NewFolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPath: string
  onSuccess: () => void
}

export function NewFolderModal({ open, onOpenChange, currentPath, onSuccess }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(t)
    } else {
      setFolderName('')
    }
  }, [open])

  const isValid = folderName.trim().length > 0

  const handleCreate = async () => {
    if (!isValid || isCreating) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/folders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath, folderName: folderName.trim() }),
      })

      if (!response.ok) throw new Error('Failed to create folder')

      toast.success(`Folder "${folderName}" created successfully`)
      setFolderName('')
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error('Failed to create folder')
    } finally {
      setIsCreating(false)
    }
  }

  const displayPath = currentPath ? `/${currentPath}` : '/ (root)'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden [&>button]:text-white [&>button]:opacity-50 [&>button]:hover:opacity-100 [&>button]:transition-opacity"
        style={{
          background: '#0F0F0F',
          border: '1px solid rgba(42,42,42,0.8)',
          borderRadius: '16px',
          maxWidth: '420px',
          boxShadow: '0 0 0 1px rgba(34,197,94,0.04), 0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top green accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.55) 50%, transparent 100%)',
          }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 pt-6 pb-5"
          style={{ borderBottom: '1px solid rgba(42,42,42,0.6)' }}
        >
          {/* Folder icon badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              boxShadow: '0 0 16px rgba(34,197,94,0.08)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3l1.5 2H14.5A1.5 1.5 0 0 1 16 7.5v6A1.5 1.5 0 0 1 14.5 15h-11A1.5 1.5 0 0 1 2 13.5v-8Z"
                stroke="#22C55E"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M9 9.5v3M7.5 11h3"
                stroke="#22C55E"
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
              Create New Folder
            </DialogTitle>
            <p
              className="text-xs leading-none"
              style={{
                color: 'rgba(113,113,122,0.7)',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              NEW DIRECTORY · CLOUDFLARE R2
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">

          {/* Path context chip */}
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(42,42,42,0.6)',
              borderLeft: '2px solid rgba(34,197,94,0.35)',
            }}
          >
            {/* Location icon */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.18)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3l1.5 2H10.5A1.5 1.5 0 0 1 12 7.5v4A1.5 1.5 0 0 1 10.5 13h-7A1.5 1.5 0 0 1 2 11.5v-6Z"
                  stroke="#22C55E"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[10px] mb-0.5"
                style={{
                  color: 'rgba(113,113,122,0.5)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                CREATING INSIDE
              </p>
              <p
                className="text-xs truncate"
                style={{
                  color: 'rgba(161,161,170,0.75)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                {displayPath}
              </p>
            </div>
          </div>

          {/* Folder name input */}
          <div>
            <p
              className="text-[10px] tracking-widest uppercase mb-2.5"
              style={{
                color: 'rgba(113,113,122,0.55)',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              Folder Name
            </p>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="e.g. documents, images, 2026…"
                className="w-full h-11 px-4 rounded-xl text-sm text-white outline-none transition-all duration-200 placeholder:text-[rgba(113,113,122,0.4)]"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: focused
                    ? '1px solid rgba(34,197,94,0.45)'
                    : '1px solid rgba(42,42,42,0.75)',
                  boxShadow: focused
                    ? '0 0 0 3px rgba(34,197,94,0.07)'
                    : 'none',
                }}
              />
              {/* Character count */}
              {folderName.length > 0 && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none select-none"
                  style={{
                    color: 'rgba(113,113,122,0.35)',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  {folderName.length}
                </span>
              )}
            </div>

            {/* Preview of full path */}
            <div className="mt-2.5 h-4">
              {folderName.trim() && (
                <p
                  className="text-[11px] flex items-center gap-1.5"
                  style={{
                    color: 'rgba(113,113,122,0.5)',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M2 6.5A1 1 0 0 1 3 5.5h1.5l.75 1H7.5A1 1 0 0 1 8.5 7.5v2a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-3Z"
                      stroke="rgba(34,197,94,0.5)"
                      strokeWidth="0.9"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ color: 'rgba(34,197,94,0.6)' }}>
                    {currentPath}{folderName.trim()}/
                  </span>
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
            disabled={isCreating}
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

          {/* Create */}
          <button
            onClick={handleCreate}
            disabled={!isValid || isCreating}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: isValid && !isCreating ? '#22C55E' : 'rgba(34,197,94,0.4)',
              boxShadow: isValid && !isCreating ? '0 4px 20px rgba(34,197,94,0.22)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (isValid && !isCreating) {
                const el = e.currentTarget
                el.style.background = '#1EA952'
                el.style.boxShadow = '0 6px 28px rgba(34,197,94,0.32)'
                el.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (isValid && !isCreating) {
                const el = e.currentTarget
                el.style.background = '#22C55E'
                el.style.boxShadow = '0 4px 20px rgba(34,197,94,0.22)'
                el.style.transform = 'translateY(0)'
              }
            }}
          >
            {isCreating ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Creating…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3l1.5 2H10.5A1.5 1.5 0 0 1 12 7.5v4A1.5 1.5 0 0 1 10.5 13h-7A1.5 1.5 0 0 1 2 11.5v-6Z"
                    stroke="white"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                  <path d="M7 9.5v2.5M5.75 10.75h2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Create Folder
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}