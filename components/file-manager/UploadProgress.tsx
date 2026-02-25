import { formatFileSize } from '@/lib/file-utils'
import type { UploadProgress as UploadProgressType } from '@/types'

interface UploadProgressProps {
  uploads: UploadProgressType[]
}

export function UploadProgress({ uploads }: UploadProgressProps) {
  if (uploads.length === 0) return null

  const completed = uploads.filter(u => u.status === 'completed').length
  const hasActive = uploads.some(u => u.status === 'uploading')

  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{
        background: '#111',
        border: '1px solid rgba(42,42,42,0.7)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(42,42,42,0.6)' }}
      >
        <div className="flex items-center gap-2.5">
          {/* Animated status dot */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: hasActive ? '#F97316' : completed === uploads.length ? '#22C55E' : '#71717A',
              boxShadow: hasActive ? '0 0 6px rgba(249,115,22,0.5)' : 'none',
              animation: hasActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-geist-mono, monospace)', letterSpacing: '0.05em' }}
          >
            {hasActive ? 'UPLOADING' : 'UPLOAD COMPLETE'}
          </span>
        </div>
        <span
          className="text-xs"
          style={{ color: 'rgba(113,113,122,0.7)', fontFamily: 'var(--font-geist-mono, monospace)' }}
        >
          {completed}/{uploads.length}
        </span>
      </div>

      {/* Upload rows */}
      <div className="px-5 py-3 space-y-4">
        {uploads.map((upload, index) => (
          <div key={index}>
            {/* File info row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* File type mini icon */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center"
                  style={{
                    background: upload.status === 'completed'
                      ? 'rgba(34,197,94,0.1)'
                      : upload.status === 'error'
                      ? 'rgba(239,68,68,0.1)'
                      : 'rgba(249,115,22,0.08)',
                    border: `1px solid ${
                      upload.status === 'completed'
                        ? 'rgba(34,197,94,0.25)'
                        : upload.status === 'error'
                        ? 'rgba(239,68,68,0.25)'
                        : 'rgba(249,115,22,0.15)'
                    }`,
                  }}
                >
                  {upload.status === 'completed' ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : upload.status === 'error' ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="rgba(249,115,22,0.2)" strokeWidth="1.5" />
                      <path d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                {/* Filename + size */}
                <div className="min-w-0">
                  <p
                    className="text-sm text-white truncate leading-none mb-0.5"
                    style={{ maxWidth: '260px' }}
                  >
                    {upload.file.name}
                  </p>
                  <p
                    className="text-xs leading-none"
                    style={{ color: 'rgba(113,113,122,0.6)', fontFamily: 'var(--font-geist-mono, monospace)' }}
                  >
                    {formatFileSize(upload.file.size)}
                  </p>
                </div>
              </div>

              {/* Status / speed / percentage */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {upload.status === 'uploading' && (
                  <>
                    {upload.speed > 0 && (
                      <span
                        className="text-xs hidden sm:block"
                        style={{ color: 'rgba(161,161,170,0.5)', fontFamily: 'var(--font-geist-mono, monospace)' }}
                      >
                        {(upload.speed / 1024 / 1024).toFixed(1)} MB/s
                      </span>
                    )}
                    <span
                      className="text-sm font-semibold"
                      style={{ color: '#F97316', fontFamily: 'var(--font-geist-mono, monospace)' }}
                    >
                      {Math.round(upload.progress)}%
                    </span>
                  </>
                )}
                {upload.status === 'completed' && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: '#22C55E', fontFamily: 'var(--font-geist-mono, monospace)', letterSpacing: '0.04em' }}
                  >
                    DONE
                  </span>
                )}
                {upload.status === 'error' && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: '#EF4444', fontFamily: 'var(--font-geist-mono, monospace)', letterSpacing: '0.04em' }}
                  >
                    FAILED
                  </span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {upload.status === 'uploading' && (
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: 'rgba(42,42,42,0.8)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${upload.progress}%`,
                    background: upload.progress < 5
                      ? 'rgba(249,115,22,0.5)'
                      : 'linear-gradient(90deg, rgba(249,115,22,0.7) 0%, #F97316 100%)',
                  }}
                />
              </div>
            )}

            {upload.status === 'completed' && (
              <div
                className="h-1 rounded-full"
                style={{ background: 'rgba(34,197,94,0.3)' }}
              />
            )}

            {upload.status === 'error' && (
              <div
                className="h-1 rounded-full"
                style={{ background: 'rgba(239,68,68,0.3)' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
