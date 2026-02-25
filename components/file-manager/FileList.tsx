import { Checkbox } from '@/components/ui/checkbox'
import { FolderItem as FolderItemComponent } from './FolderItem'
import { FileItem as FileItemComponent } from './FileItem'
import { FileListSkeleton } from './FileListSkeleton'
import type { FileItem, FolderItem } from '@/types'

interface FileListProps {
  folders: FolderItem[]
  files: FileItem[]
  selectedKeys: string[]
  onToggleSelect: (key: string) => void
  onSelectAll: () => void
  allSelected: boolean
  onFolderClick: (key: string) => void
  onFileAction: (action: string, key: string) => void
  isLoading?: boolean
}

export function FileList({
  folders,
  files,
  selectedKeys,
  onToggleSelect,
  onSelectAll,
  allSelected,
  onFolderClick,
  onFileAction,
  isLoading,
}: FileListProps) {
  const totalItems = folders.length + files.length

  if (isLoading) {
    return <FileListSkeleton />
  }

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Empty state icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(42,42,42,0.7)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M4 21V10a2 2 0 0 1 2-2h4.5l2 2.5H22a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
              stroke="rgba(113,113,122,0.5)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M14 13v6M11 16l3-3 3 3"
              stroke="rgba(113,113,122,0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-white mb-1.5">No files yet</p>
        <p
          className="text-xs"
          style={{ color: 'rgba(113,113,122,0.7)', fontFamily: 'var(--font-geist-mono, monospace)' }}
        >
          Drop files above to get started
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Column headers */}
      <div
        className="flex items-center gap-4 px-4 pb-3 mb-2"
        style={{ borderBottom: '1px solid rgba(42,42,42,0.5)' }}
      >
        {/* Checkbox placeholder */}
        <div className="w-4 flex-shrink-0">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            className="data-[state=checked]:bg-[#F97316] data-[state=checked]:border-[#F97316]"
            style={{ borderColor: 'rgba(60,60,60,0.8)' }}
          />
        </div>

        {/* Icon placeholder */}
        <div className="w-9 flex-shrink-0" />

        {/* Name */}
        <div className="flex-1 min-w-0">
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: 'rgba(113,113,122,0.55)', fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            Name
          </span>
        </div>

        {/* Type */}
        <div className="flex-shrink-0 hidden sm:block w-20 text-center">
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: 'rgba(113,113,122,0.55)', fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            Type
          </span>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 w-[116px]" />
      </div>

      {/* Items */}
      <div className="space-y-2.5">
        {folders.map((folder) => (
          <FolderItemComponent
            key={folder.key}
            folder={folder}
            isSelected={selectedKeys.includes(folder.key)}
            onToggleSelect={() => onToggleSelect(folder.key)}
            onClick={() => onFolderClick(folder.key)}
          />
        ))}

        {folders.length > 0 && files.length > 0 && (
          <div
            className="my-2"
            style={{ borderBottom: '1px solid rgba(42,42,42,0.3)' }}
          />
        )}

        {files.map((file) => (
          <FileItemComponent
            key={file.key}
            file={file}
            isSelected={selectedKeys.includes(file.key)}
            onToggleSelect={() => onToggleSelect(file.key)}
            onAction={(action) => onFileAction(action, file.key)}
          />
        ))}
      </div>

      {/* Footer count */}
      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(42,42,42,0.3)' }}>
        <span
          className="text-xs"
          style={{ color: 'rgba(113,113,122,0.5)', fontFamily: 'var(--font-geist-mono, monospace)' }}
        >
          {folders.length > 0 && `${folders.length} folder${folders.length !== 1 ? 's' : ''}`}
          {folders.length > 0 && files.length > 0 && ' · '}
          {files.length > 0 && `${files.length} file${files.length !== 1 ? 's' : ''}`}
        </span>
        {selectedKeys.length > 0 && (
          <span
            className="text-xs"
            style={{ color: 'rgba(249,115,22,0.6)', fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            {selectedKeys.length} selected
          </span>
        )}
      </div>
    </div>
  )
}
