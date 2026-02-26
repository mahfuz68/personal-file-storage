import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface DeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileNames: string[]
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteModal({
  open,
  onOpenChange,
  fileNames,
  onConfirm,
  isDeleting,
}: DeleteModalProps) {
  const isSingle = fileNames.length === 1
  const showList = fileNames.length <= 5

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden [&>button]:text-white [&>button]:opacity-50 [&>button]:hover:opacity-100 [&>button]:transition-opacity"
        style={{
          background: '#0F0F0F',
          border: '1px solid rgba(42,42,42,0.8)',
          borderRadius: '16px',
          maxWidth: '420px',
          boxShadow: '0 0 0 1px rgba(239,68,68,0.05), 0 32px 80px rgba(0,0,0,0.75)',
        }}
      >
        {/* Top red accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.6) 50%, transparent 100%)',
          }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 pt-6 pb-5"
          style={{ borderBottom: '1px solid rgba(42,42,42,0.6)' }}
        >
          {/* Trash icon badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              boxShadow: '0 0 16px rgba(239,68,68,0.08)',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path
                d="M2.5 4.5h12M6.5 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5"
                stroke="#EF4444"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 4.5l.75 9a1 1 0 0 0 1 .917h5.5a1 1 0 0 0 1-.917L13 4.5"
                stroke="#EF4444"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 7.5v4M8.5 7.5v4M10.5 7.5v4"
                stroke="#EF4444"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <DialogTitle
              className="text-sm font-semibold leading-none mb-1.5"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              {isSingle ? 'Delete File?' : `Delete ${fileNames.length} Files?`}
            </DialogTitle>
            <p
              className="text-xs leading-none"
              style={{
                color: 'rgba(113,113,122,0.7)',
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              PERMANENT · CANNOT BE UNDONE
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">

          {/* Warning banner */}
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
            style={{
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderLeft: '2px solid rgba(239,68,68,0.45)',
            }}
          >
            <svg
              className="flex-shrink-0 mt-0.5"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M7 1.5L13 12.5H1L7 1.5Z"
                stroke="rgba(239,68,68,0.7)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M7 6v3"
                stroke="rgba(239,68,68,0.7)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="7" cy="10.5" r="0.6" fill="rgba(239,68,68,0.7)" />
            </svg>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'rgba(239,68,68,0.65)' }}
            >
              {isSingle
                ? 'This file will be permanently removed from your R2 bucket and cannot be recovered.'
                : `These ${fileNames.length} files will be permanently removed from your R2 bucket and cannot be recovered.`}
            </p>
          </div>

          {/* File list */}
          {showList && (
            <div>
              <p
                className="text-[10px] tracking-widest uppercase mb-2.5"
                style={{
                  color: 'rgba(113,113,122,0.55)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                {isSingle ? 'File to delete' : `Files to delete (${fileNames.length})`}
              </p>
              <ul
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(42,42,42,0.7)' }}
              >
                {fileNames.map((name, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      background:
                        index % 2 === 0
                          ? 'rgba(255,255,255,0.02)'
                          : 'rgba(255,255,255,0.01)',
                      borderTop:
                        index > 0 ? '1px solid rgba(42,42,42,0.5)' : 'none',
                    }}
                  >
                    {/* File icon */}
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.15)',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 2.5a1 1 0 0 1 1-1h4.5l2.5 2.5v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7.5Z"
                          stroke="rgba(239,68,68,0.65)"
                          strokeWidth="1.1"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 1.5V4h2.5"
                          stroke="rgba(239,68,68,0.65)"
                          strokeWidth="1.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-xs truncate flex-1"
                      style={{
                        color: 'rgba(161,161,170,0.75)',
                        fontFamily: 'var(--font-geist-mono, monospace)',
                      }}
                    >
                      {name}
                    </span>
                    {/* Red dot indicator */}
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(239,68,68,0.4)' }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bulk count row when > 5 files */}
          {!showList && (
            <div
              className="flex items-center justify-between px-4 py-3.5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(42,42,42,0.6)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.18)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="2" width="4" height="4" rx="1" stroke="rgba(239,68,68,0.6)" strokeWidth="1.2" />
                    <rect x="8" y="2" width="4" height="4" rx="1" stroke="rgba(239,68,68,0.6)" strokeWidth="1.2" />
                    <rect x="2" y="8" width="4" height="4" rx="1" stroke="rgba(239,68,68,0.6)" strokeWidth="1.2" />
                    <rect x="8" y="8" width="4" height="4" rx="1" stroke="rgba(239,68,68,0.6)" strokeWidth="1.2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{fileNames.length} files selected</p>
                  <p
                    className="text-[11px]"
                    style={{
                      color: 'rgba(113,113,122,0.55)',
                      fontFamily: 'var(--font-geist-mono, monospace)',
                    }}
                  >
                    All will be permanently deleted
                  </p>
                </div>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-lg"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: 'rgba(239,68,68,0.7)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                ×{fileNames.length}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 pb-6 flex gap-2.5"
          style={{ borderTop: '1px solid rgba(42,42,42,0.5)', paddingTop: '20px' }}
        >
          {/* Cancel */}
          <button
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
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

          {/* Delete */}
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: '#EF4444',
              boxShadow: isDeleting ? 'none' : '0 4px 20px rgba(239,68,68,0.28)',
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                const el = e.currentTarget
                el.style.background = '#DC2626'
                el.style.boxShadow = '0 6px 28px rgba(239,68,68,0.4)'
                el.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                const el = e.currentTarget
                el.style.background = '#EF4444'
                el.style.boxShadow = '0 4px 20px rgba(239,68,68,0.28)'
                el.style.transform = 'translateY(0)'
              }
            }}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Deleting…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 3.5h9M5.5 3.5V2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1"
                    stroke="white"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.5 3.5l.65 7.8a1 1 0 0 0 1 .92h3.7a1 1 0 0 0 1-.92l.65-7.8"
                    stroke="white"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isSingle ? 'Delete File' : `Delete ${fileNames.length} Files`}
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}