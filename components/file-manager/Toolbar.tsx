import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FILE_TYPE_FILTERS } from '@/lib/constants'

interface ToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  fileTypeFilter: string
  onFileTypeChange: (type: string) => void
}

const TYPE_DOTS: Record<string, string> = {
  all:      'rgba(161,161,170,0.5)',
  video:    '#F97316',
  image:    '#3B82F6',
  document: '#22C55E',
  audio:    '#A855F7',
  archive:  '#EAB308',
  code:     '#8B5CF6',
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  fileTypeFilter,
  onFileTypeChange,
}: ToolbarProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-4 p-3 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(42,42,42,0.6)',
      }}
      suppressHydrationWarning
    >
      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style={{ color: 'rgba(113,113,122,0.5)' }}
        />
        <input
          type="text"
          placeholder="Search files and folders…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg text-sm text-white placeholder:text-[rgba(113,113,122,0.45)] bg-transparent outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(42,42,42,0.7)',
            fontFamily: 'var(--font-geist-sans, sans-serif)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'
            e.currentTarget.style.background = 'rgba(249,115,22,0.03)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.07)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(42,42,42,0.7)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          spellCheck={false}
          autoComplete="off"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{ background: 'rgba(113,113,122,0.3)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(113,113,122,0.5)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(113,113,122,0.3)' }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Divider */}
      <div
        className="hidden sm:block w-px h-6 self-center flex-shrink-0"
        style={{ background: 'rgba(42,42,42,0.7)' }}
      />

      {/* Type filter */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Active dot indicator */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 hidden sm:block"
          style={{
            background: TYPE_DOTS[fileTypeFilter] || 'rgba(161,161,170,0.5)',
            boxShadow: fileTypeFilter !== 'all'
              ? `0 0 5px ${TYPE_DOTS[fileTypeFilter] || 'transparent'}`
              : 'none',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        />

        <Select value={fileTypeFilter} onValueChange={onFileTypeChange}>
          <SelectTrigger
            className="h-9 text-sm border-0 bg-transparent focus:ring-0 focus:ring-offset-0 min-w-[130px]"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(42,42,42,0.7)',
              borderRadius: '8px',
              color: fileTypeFilter !== 'all' ? '#F97316' : 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '12px',
              letterSpacing: '0.02em',
            }}
          >
            <SelectValue placeholder="All Files" />
          </SelectTrigger>
          <SelectContent
            className="border-[#2A2A2A] text-white"
            style={{ background: '#141414' }}
          >
            {FILE_TYPE_FILTERS.map((filter) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="text-white focus:bg-[#1F1F1F] focus:text-white cursor-pointer"
                style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '12px' }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: TYPE_DOTS[filter.value] || 'rgba(161,161,170,0.4)' }}
                  />
                  {filter.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
