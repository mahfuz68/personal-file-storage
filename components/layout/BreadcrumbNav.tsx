'use client'

import { FolderPlus, ChevronRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BreadcrumbNavProps {
  currentPath: string
  onNewFolder: () => void
}

export function BreadcrumbNav({ currentPath, onNewFolder }: BreadcrumbNavProps) {
  const router = useRouter()

  const segments = currentPath ? currentPath.split('/').filter(Boolean) : []

  const handleSegmentClick = (index: number) => {
    if (index === -1) {
      router.push('/storage')
    } else {
      const path = segments.slice(0, index + 1).join('/')
      router.push(`/storage/${path}`)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      {/* Breadcrumb trail */}
      <div className="flex items-center gap-1.5 min-w-0">
        <button
          onClick={() => handleSegmentClick(-1)}
          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150"
          style={{
            background: segments.length === 0 ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
            border: segments.length === 0 ? '1px solid rgba(249,115,22,0.25)' : '1px solid rgba(42,42,42,0.6)',
          }}
          onMouseEnter={(e) => {
            if (segments.length > 0) {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.06)'
              el.style.borderColor = 'rgba(60,60,60,0.8)'
            }
          }}
          onMouseLeave={(e) => {
            if (segments.length > 0) {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.03)'
              el.style.borderColor = 'rgba(42,42,42,0.6)'
            }
          }}
        >
          <Home
            className="w-3.5 h-3.5"
            style={{ color: segments.length === 0 ? '#F97316' : 'rgba(161,161,170,0.6)' }}
          />
        </button>

        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-1.5 min-w-0">
            <ChevronRight
              className="w-3 h-3 flex-shrink-0"
              style={{ color: 'rgba(42,42,42,0.9)' }}
            />
            <button
              onClick={() => handleSegmentClick(index)}
              className="flex items-center h-7 px-2.5 rounded-md text-sm transition-all duration-150 min-w-0"
              style={{
                background: index === segments.length - 1 ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.025)',
                border: index === segments.length - 1 ? '1px solid rgba(249,115,22,0.22)' : '1px solid rgba(42,42,42,0.55)',
                color: index === segments.length - 1 ? 'rgba(255,255,255,0.9)' : 'rgba(161,161,170,0.65)',
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: '12px',
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (index < segments.length - 1) {
                  const el = e.currentTarget
                  el.style.background = 'rgba(255,255,255,0.05)'
                  el.style.color = 'rgba(255,255,255,0.8)'
                }
              }}
              onMouseLeave={(e) => {
                if (index < segments.length - 1) {
                  const el = e.currentTarget
                  el.style.background = 'rgba(255,255,255,0.025)'
                  el.style.color = 'rgba(161,161,170,0.65)'
                }
              }}
            >
              {segment}
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onNewFolder}
          className="flex items-center gap-2 h-8 px-3.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.22)',
            color: 'rgba(34,197,94,0.85)',
            fontFamily: 'var(--font-geist-mono, monospace)',
            letterSpacing: '0.03em',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(34,197,94,0.14)'
            el.style.borderColor = 'rgba(34,197,94,0.35)'
            el.style.color = '#22C55E'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(34,197,94,0.08)'
            el.style.borderColor = 'rgba(34,197,94,0.22)'
            el.style.color = 'rgba(34,197,94,0.85)'
          }}
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>NEW FOLDER</span>
        </button>
      </div>
    </div>
  )
}
