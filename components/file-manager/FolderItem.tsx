import { Folder, ChevronRight } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { FolderItem } from '@/types'

interface FolderItemProps {
  folder: FolderItem
  isSelected: boolean
  onToggleSelect: () => void
  onClick: () => void
}

export function FolderItem({
  folder,
  isSelected,
  onToggleSelect,
  onClick,
}: FolderItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group relative overflow-hidden',
      )}
      style={{
        background: isSelected
          ? 'rgba(249,115,22,0.08)'
          : 'rgba(255,255,255,0.02)',
        border: isSelected
          ? '1px solid rgba(249,115,22,0.35)'
          : '1px solid rgba(42,42,42,0.6)',
        borderLeft: isSelected
          ? '2px solid #F97316'
          : '2px solid rgba(42,42,42,0.3)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.035)'
          e.currentTarget.style.borderColor = 'rgba(60,60,60,0.8)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
          e.currentTarget.style.borderColor = 'rgba(42,42,42,0.6)'
        }
      }}
    >
      {/* Selection indicator glow */}
      {isSelected && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #F97316 0%, rgba(249,115,22,0.3) 100%)' }}
        />
      )}

      {/* Checkbox */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggleSelect}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex-shrink-0 transition-opacity duration-200',
          !isSelected && 'opacity-0 group-hover:opacity-100',
          'data-[state=checked]:bg-[#F97316] data-[state=checked]:border-[#F97316]',
        )}
        style={{ borderColor: isSelected ? '#F97316' : 'rgba(60,60,60,0.8)' }}
      />

      {/* Folder icon */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{
          background: isSelected
            ? 'rgba(249,115,22,0.15)'
            : 'rgba(249,115,22,0.07)',
          border: isSelected
            ? '1px solid rgba(249,115,22,0.4)'
            : '1px solid rgba(249,115,22,0.15)',
        }}
        onClick={onClick}
      >
        <Folder
          className="w-4 h-4 transition-colors duration-200"
          style={{ color: isSelected ? '#F97316' : 'rgba(249,115,22,0.7)' }}
        />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0" onClick={onClick}>
        <span
          className="text-sm font-medium block truncate transition-colors duration-200"
          style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.85)' }}
        >
          {folder.name}
        </span>
        <span
          className="text-xs block mt-0.5"
          style={{ color: 'rgba(113,113,122,0.7)', fontFamily: 'var(--font-geist-mono, monospace)' }}
        >
          folder
        </span>
      </div>

      {/* Right arrow */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={onClick}>
        <ChevronRight
          className="w-4 h-4"
          style={{ color: isSelected ? '#F97316' : 'rgba(113,113,122,0.5)' }}
        />
      </div>
    </div>
  )
}
