'use client'

import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'

interface UploadDropzoneProps {
  onDrop: (files: File[]) => void
  isUploading?: boolean
  uploadingFileName?: string
}

export function UploadDropzone({ onDrop, isUploading, uploadingFileName }: UploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: isUploading,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-xl mb-6 cursor-pointer overflow-hidden transition-all duration-300 group',
        isDragActive && 'scale-[1.01]',
      )}
      style={{
        border: isDragActive
          ? '1.5px solid rgba(249,115,22,0.7)'
          : isUploading
          ? '1.5px solid rgba(34,197,94,0.6)'
          : '1.5px dashed rgba(42,42,42,0.9)',
        background: isDragActive
          ? 'rgba(249,115,22,0.04)'
          : isUploading
          ? 'rgba(34,197,94,0.03)'
          : '#111',
        boxShadow: isDragActive
          ? '0 0 30px rgba(249,115,22,0.08), inset 0 0 40px rgba(249,115,22,0.03)'
          : isUploading
          ? '0 0 20px rgba(34,197,94,0.06)'
          : 'none',
      }}
    >
      <input {...getInputProps()} />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Corner accents */}
      {[
        'top-3 left-3 border-t border-l',
        'top-3 right-3 border-t border-r',
        'bottom-3 left-3 border-b border-l',
        'bottom-3 right-3 border-b border-r',
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${cls} pointer-events-none transition-colors duration-300`}
          style={{
            borderColor: isDragActive
              ? 'rgba(249,115,22,0.5)'
              : isUploading
              ? 'rgba(34,197,94,0.4)'
              : 'rgba(42,42,42,0.7)',
          }}
        />
      ))}

      <div className="relative flex items-center gap-6 px-8 py-6">
        {/* Icon area */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: isDragActive
              ? 'rgba(249,115,22,0.12)'
              : isUploading
              ? 'rgba(34,197,94,0.1)'
              : 'rgba(255,255,255,0.03)',
            border: isDragActive
              ? '1px solid rgba(249,115,22,0.3)'
              : isUploading
              ? '1px solid rgba(34,197,94,0.25)'
              : '1px solid rgba(42,42,42,0.8)',
          }}
        >
          {isUploading ? (
            // Spinner when uploading
            <svg
              className="w-6 h-6 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="rgba(34,197,94,0.25)"
                strokeWidth="2"
              />
              <path
                d="M12 3a9 9 0 0 1 9 9"
                stroke="#22C55E"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : isDragActive ? (
            // Arrow down when dragging
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 3v12M5 10l6 6 6-6"
                stroke="#F97316"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 19h16"
                stroke="#F97316"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          ) : (
            // Cloud upload idle
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M6 16a4 4 0 0 1 0-8h.4A5 5 0 0 1 16 8.4a3.6 3.6 0 1 1 .4 7.2H6Z"
                stroke="rgba(161,161,170,0.7)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M11 14v-5M8.5 11.5 11 9l2.5 2.5"
                stroke="rgba(161,161,170,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {isUploading ? (
            <>
              <p
                className="text-sm font-medium mb-0.5 truncate"
                style={{ color: '#22C55E', fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                {uploadingFileName}
              </p>
              <p className="text-xs" style={{ color: 'rgba(161,161,170,0.6)' }}>
                Uploading — please wait…
              </p>
            </>
          ) : isDragActive ? (
            <>
              <p
                className="text-sm font-semibold mb-0.5"
                style={{ color: '#F97316' }}
              >
                Release to upload
              </p>
              <p className="text-xs" style={{ color: 'rgba(249,115,22,0.5)' }}>
                Drop your files here
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium mb-0.5 text-white">
                Drop files or{' '}
                <span
                  className="underline underline-offset-2 decoration-dotted transition-colors group-hover:text-[#F97316]"
                  style={{ color: 'rgba(249,115,22,0.8)' }}
                >
                  click to browse
                </span>
              </p>
              <p className="text-xs" style={{ color: 'rgba(161,161,170,0.45)', fontFamily: 'var(--font-geist-mono, monospace)' }}>
                Any file type · Streamed via presigned URL
              </p>
            </>
          )}
        </div>

        {/* Right side badge */}
        {!isUploading && !isDragActive && (
          <div
            className="flex-shrink-0 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-300 group-hover:border-[#F97316]/30"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(42,42,42,0.8)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6h8M6 2v8"
                stroke="rgba(161,161,170,0.5)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="text-xs"
              style={{ color: 'rgba(161,161,170,0.45)', fontFamily: 'var(--font-geist-mono, monospace)', letterSpacing: '0.05em' }}
            >
              ADD FILES
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
