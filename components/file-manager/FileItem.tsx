import { Pencil, Share2, Trash2, Download, Check, Film, ImageIcon, FileText, File, Music, Archive, Code } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { formatFileSize, getFileType } from '@/lib/file-utils'
import type { FileItem } from '@/types'

interface FileItemProps {
  file: FileItem
  isSelected: boolean
  onToggleSelect: () => void
  onAction: (action: 'rename' | 'share' | 'delete' | 'download') => void
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: LucideIcon }> = {
  VIDEO:    { color: '#F97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)',  icon: Film      },
  IMAGE:    { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)',  icon: ImageIcon  },
  DOCUMENT: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',   icon: FileText  },
  AUDIO:    { color: '#A855F7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)',  icon: Music     },
  ARCHIVE:  { color: '#EAB308', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.25)',   icon: Archive   },
  CODE:     { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)',  icon: Code      },
  FILE:     { color: '#71717A', bg: 'rgba(113,113,122,0.1)',border: 'rgba(113,113,122,0.2)',  icon: File      },
}

export function FileItem({
  file,
  isSelected,
  onToggleSelect,
  onAction,
}: FileItemProps) {
  const fileType = getFileType(file.name)
  const typeConf = TYPE_CONFIG[fileType] || TYPE_CONFIG.FILE
  const FileIcon = typeConf.icon

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden',
      )}
      style={{
        background: isSelected
          ? 'rgba(249,115,22,0.08)'
          : 'rgba(255,255,255,0.018)',
        border: isSelected
          ? '1px solid rgba(249,115,22,0.35)'
          : '1px solid rgba(42,42,42,0.55)',
        borderLeft: isSelected
          ? '2px solid #F97316'
          : '2px solid rgba(42,42,42,0.3)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
          e.currentTarget.style.borderColor = 'rgba(55,55,55,0.75)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.018)'
          e.currentTarget.style.borderColor = 'rgba(42,42,42,0.55)'
        }
      }}
    >
      {/* Checkbox */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggleSelect}
        className={cn(
          'flex-shrink-0 transition-opacity duration-200',
          !isSelected && 'opacity-0 group-hover:opacity-100',
          'data-[state=checked]:bg-[#F97316] data-[state=checked]:border-[#F97316]',
        )}
        style={{ borderColor: isSelected ? '#F97316' : 'rgba(60,60,60,0.8)' }}
      />

      {/* File type icon box */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{
          background: isSelected ? 'rgba(249,115,22,0.12)' : typeConf.bg,
          border: `1px solid ${isSelected ? 'rgba(249,115,22,0.3)' : typeConf.border}`,
        }}
      >
        {isSelected ? (
          <Check className="w-4 h-4" style={{ color: '#F97316' }} />
        ) : (
          <FileIcon className="w-4 h-4" style={{ color: typeConf.color }} />
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <span
          className="text-sm font-medium block truncate"
          style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.85)' }}
        >
          {file.name}
        </span>
        <span
          className="text-xs block mt-0.5"
          style={{
            color: 'rgba(113,113,122,0.6)',
            fontFamily: 'var(--font-geist-mono, monospace)',
          }}
        >
          {formatFileSize(file.size)}
        </span>
      </div>

      {/* Type badge */}
      <div
        className="flex-shrink-0 hidden sm:flex items-center"
        style={{
          background: isSelected ? 'rgba(249,115,22,0.15)' : typeConf.bg,
          border: `1px solid ${isSelected ? 'rgba(249,115,22,0.3)' : typeConf.border}`,
          borderRadius: '6px',
          padding: '2px 8px',
        }}
      >
        <span
          className="text-[10px] font-medium tracking-wider"
          style={{
            color: isSelected ? '#F97316' : typeConf.color,
            fontFamily: 'var(--font-geist-mono, monospace)',
          }}
        >
          {fileType}
        </span>
      </div>

      {/* Action buttons — appear on hover */}
      <div
        className={cn(
          'flex-shrink-0 flex items-center gap-1 transition-all duration-200',
          isSelected ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100',
        )}
      >
        {[
          { action: 'rename' as const, icon: Pencil, title: 'Rename' },
          { action: 'share' as const, icon: Share2, title: 'Share' },
          { action: 'download' as const, icon: Download, title: 'Download' },
          { action: 'delete' as const, icon: Trash2, title: 'Delete' },
        ].map(({ action, icon: Icon, title }) => (
          <button
            key={action}
            onClick={(e) => { e.stopPropagation(); onAction(action) }}
            title={title}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150"
            style={{
              background: 'transparent',
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = action === 'delete'
                ? 'rgba(239,68,68,0.1)'
                : 'rgba(255,255,255,0.06)'
              el.style.borderColor = action === 'delete'
                ? 'rgba(239,68,68,0.25)'
                : 'rgba(60,60,60,0.6)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'transparent'
              el.style.borderColor = 'transparent'
            }}
          >
            <Icon
              className="w-3.5 h-3.5"
              style={{
                color: action === 'delete'
                  ? 'rgba(239,68,68,0.7)'
                  : 'rgba(161,161,170,0.65)',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
