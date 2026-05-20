'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'

interface UploadDropzoneProps {
  onDrop: (files: File[]) => void
  isUploading?: boolean
  uploadingFileName?: string
  currentPath?: string
}

interface CliConfig {
  apiKey: string
  baseUrl: string
}

export function UploadDropzone({ onDrop, isUploading, uploadingFileName, currentPath }: UploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: isUploading,
  })

  const [config, setConfig] = useState<CliConfig | null>(null)

  useEffect(() => {
    fetch('/api/files/upload-cli/config')
      .then((res) => res.json())
      .then(setConfig)
      .catch(() => setConfig({ apiKey: '', baseUrl: 'http://localhost:3000' }))
  }, [])

  const displayPath = currentPath || 'root'
  const pathSegments = currentPath ? currentPath.replace(/\/$/, '').split('/').filter(Boolean) : []
  const depth = pathSegments.length

  const baseUrl = config?.baseUrl || 'http://localhost:3000'
  const apiKeyHeader = config?.apiKey ? `-H "x-api-key: ${config.apiKey}" ` : ''

  let relevantCommand: { label: string; command: string }

  if (depth === 0) {
    relevantCommand = {
      label: 'Upload to root',
      command: `curl -X POST ${apiKeyHeader}-F "file=@myfile.txt" ${baseUrl}/api/files/upload-cli`,
    }
  } else if (depth === 1) {
    relevantCommand = {
      label: 'Upload to a specific folder',
      command: `curl -X POST ${apiKeyHeader}-F "file=@myfile.txt" -F "path=${currentPath}" ${baseUrl}/api/files/upload-cli`,
    }
  } else {
    relevantCommand = {
      label: 'Upload to nested folder',
      command: `curl -X POST ${apiKeyHeader}-F "file=@image.png" -F "path=${currentPath}" ${baseUrl}/api/files/upload-cli`,
    }
  }

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(relevantCommand.command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = relevantCommand.command
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-xl mb-3 cursor-pointer overflow-hidden transition-all duration-300 group',
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
                  Uploading to: <span style={{ color: 'rgba(249,115,22,0.6)' }}>{displayPath}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CLI Commands Panel */}
      {!isUploading && !isDragActive && (
        config ? (
        <div
          className="rounded-xl mb-6 overflow-hidden"
          style={{
            background: '#0D0D0D',
            border: '1px solid rgba(42,42,42,0.6)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{ borderBottom: '1px solid rgba(42,42,42,0.5)' }}
          >
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{
                background: 'rgba(249,115,22,0.1)',
                border: '1px solid rgba(249,115,22,0.2)',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 3l3 3-3 3" stroke="#F97316" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 9h4" stroke="#F97316" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <span
              className="text-[10px] tracking-widest uppercase"
              style={{ color: 'rgba(161,161,170,0.5)', fontFamily: 'var(--font-geist-mono, monospace)', letterSpacing: '0.08em' }}
            >
              CLI Upload Command
            </span>
          </div>

          {/* Single command */}
          <div className="px-3 py-2">
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-150 group/cmd"
              style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(42,42,42,0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(60,60,60,0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.015)'
                e.currentTarget.style.borderColor = 'rgba(42,42,42,0.4)'
              }}
            >
              {/* Label */}
              <span
                className="text-[10px] flex-shrink-0 w-[140px] truncate"
                style={{ color: 'rgba(161,161,170,0.5)', fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                {relevantCommand.label}
              </span>

              {/* Command text */}
              <code
                className="flex-1 min-w-0 text-xs truncate"
                style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                {relevantCommand.command}
              </code>

              {/* Copy button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150"
                style={{
                  background: copied
                    ? 'rgba(34,197,94,0.15)'
                    : 'transparent',
                  border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = 'rgba(60,60,60,0.6)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }
                }}
              >
                {copied ? (
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <rect x="5" y="5" width="7" height="7" rx="1" stroke="rgba(161,161,170,0.5)" strokeWidth="1.2" />
                    <path d="M9 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1" stroke="rgba(161,161,170,0.5)" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        ) : (
          <div
            className="rounded-xl mb-6 px-4 py-3 text-xs"
            style={{
              background: '#0D0D0D',
              border: '1px solid rgba(42,42,42,0.6)',
              color: 'rgba(161,161,170,0.5)',
              fontFamily: 'var(--font-geist-mono, monospace)',
            }}
          >
            Loading CLI config...
          </div>
        )
      )}
    </div>
  )
}
