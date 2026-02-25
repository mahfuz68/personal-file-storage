import { Download, Trash2, Share2, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface BulkActionsProps {
  count: number
  onClear: () => void
  onDownload: () => void
  onDelete: () => void
  onShare: () => void
}

export function BulkActions({
  count,
  onClear,
  onDownload,
  onDelete,
  onShare,
}: BulkActionsProps) {
  if (count === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-4 py-3 rounded-xl relative overflow-hidden"
      style={{
        background: 'rgba(249,115,22,0.05)',
        border: '1px solid rgba(249,115,22,0.25)',
        borderLeft: '2px solid #F97316',
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 0% 50%, rgba(249,115,22,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Left: count + clear */}
      <div className="relative flex items-center gap-3">
        {/* Count badge */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.3)',
          }}
        >
          <span
            className="text-sm font-bold leading-none"
            style={{ color: '#F97316', fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            {count}
          </span>
        </div>

        <div>
          <p className="text-sm font-medium text-white leading-none mb-0.5">
            {count} item{count > 1 ? 's' : ''} selected
          </p>
          <button
            onClick={onClear}
            className="flex items-center gap-1 transition-colors duration-150"
            style={{ color: 'rgba(161,161,170,0.55)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(161,161,170,0.55)' }}
          >
            <X className="w-3 h-3" />
            <span className="text-xs" style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}>
              CLEAR SELECTION
            </span>
          </button>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="relative flex flex-wrap items-center gap-2">
        {/* Download */}
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            background: 'rgba(249,115,22,0.12)',
            border: '1px solid rgba(249,115,22,0.3)',
            color: '#F97316',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(249,115,22,0.2)'
            el.style.borderColor = 'rgba(249,115,22,0.5)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(249,115,22,0.12)'
            el.style.borderColor = 'rgba(249,115,22,0.3)'
          }}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download</span>
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(60,60,60,0.7)',
            color: 'rgba(255,255,255,0.75)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(255,255,255,0.07)'
            el.style.borderColor = 'rgba(80,80,80,0.8)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(255,255,255,0.04)'
            el.style.borderColor = 'rgba(60,60,60,0.7)'
          }}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 self-center" style={{ background: 'rgba(60,60,60,0.6)' }} />

        {/* Delete */}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: 'rgba(239,68,68,0.8)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(239,68,68,0.14)'
            el.style.borderColor = 'rgba(239,68,68,0.4)'
            el.style.color = '#EF4444'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(239,68,68,0.08)'
            el.style.borderColor = 'rgba(239,68,68,0.25)'
            el.style.color = 'rgba(239,68,68,0.8)'
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </motion.div>
  )
}
