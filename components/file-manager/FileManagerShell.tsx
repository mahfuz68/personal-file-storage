'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Header } from '@/components/layout/Header'
import { BreadcrumbNav } from '@/components/layout/BreadcrumbNav'
import { Toolbar } from '@/components/file-manager/Toolbar'
import { UploadDropzone } from '@/components/file-manager/UploadDropzone'
import { UploadProgress } from '@/components/file-manager/UploadProgress'
import { BulkActions } from '@/components/file-manager/BulkActions'
import { FileList } from '@/components/file-manager/FileList'
import { NewFolderModal } from '@/components/modals/NewFolderModal'
import { RenameModal } from '@/components/modals/RenameModal'
import { DeleteModal } from '@/components/modals/DeleteModal'
import { ShareModal } from '@/components/modals/ShareModal'
import { ShareLinkModal } from '@/components/modals/ShareLinkModal'
import { useFiles } from '@/hooks/useFiles'
import { useUpload } from '@/hooks/useUpload'
import { useSelection } from '@/hooks/useSelection'
import { useFileActions } from '@/hooks/useFileActions'

interface FileManagerShellProps {
  currentPath: string
}

export function FileManagerShell({ currentPath }: FileManagerShellProps) {
  const router = useRouter()
  const { data, refetch, error, isError } = useFiles(currentPath)
  const { uploads, uploadFiles, clearUploads } = useUpload(currentPath, () => {
    refetch()
    setTimeout(clearUploads, 2000)
  })
  const selection = useSelection()
  const fileActions = useFileActions(currentPath)

  const [searchQuery, setSearchQuery] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState('all')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [renameFile, setRenameFile] = useState<{ key: string; name: string } | null>(null)
  const [deleteFiles, setDeleteFiles] = useState<string[]>([])
  const [shareFile, setShareFile] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState<{ fileName: string; url: string; expiryDate: Date } | null>(null)

  const allFiles = data?.files || []
  const folders = data?.folders || []

  const FILE_TYPE_MAP: Record<string, string[]> = {
    video: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v'],
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf', 'odt'],
    audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'],
    archive: ['zip', 'tar', 'gz', 'rar', '7z', 'bz2', 'xz'],
    code: ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'sh', 'yml', 'yaml', 'md'],
  }

  const files = allFiles.filter((file) => {
    const matchesSearch = searchQuery
      ? file.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesType = fileTypeFilter && fileTypeFilter !== 'all'
      ? (FILE_TYPE_MAP[fileTypeFilter] || []).includes(file.type.toLowerCase())
      : true
    return matchesSearch && matchesType
  })

  // T-047: Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if (e.key === 'Delete' && selection.count > 0) {
        setDeleteFiles(selection.keys)
      }
      // Escape key
      if (e.key === 'Escape') {
        selection.clear()
      }
      // Ctrl/Cmd + A
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        selection.selectAll([...folders.map(f => f.key), ...files.map(f => f.key)])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selection, files, folders])

  const handleFolderClick = (key: string) => {
    const folderPath = key.replace(/\/$/, '')
    router.push(`/storage/${folderPath}`)
  }

  const handleFileAction = (action: string, key: string) => {
    // BUG FIX: Search in allFiles (unfiltered), not files (filtered list).
    // When a search/type filter is active, the file may not appear in `files`
    // even though it exists — causing share/rename/delete to silently bail out.
    const file = allFiles.find(f => f.key === key)
    if (!file) return

    switch (action) {
      case 'rename':
        setRenameFile({ key, name: file.name })
        break
      case 'delete':
        setDeleteFiles([key])
        break
      case 'share':
        setShareFile(key)
        break
      case 'download':
        fileActions.download(key)
        break
    }
  }

  const handleRename = (newName: string) => {
    if (!renameFile) return
    const pathPrefix = currentPath
    const newKey = pathPrefix + newName
    fileActions.rename({ oldKey: renameFile.key, newKey })
    setRenameFile(null)
  }

  const handleDelete = () => {
    fileActions.delete(deleteFiles)
    setDeleteFiles([])
    selection.clear()
  }

  const handleBulkDelete = () => {
    setDeleteFiles(selection.keys)
  }

  const handleShare = async (duration: number, unit: string) => {
    if (!shareFile) return

    // Guard: folder keys end with '/'. R2 folder markers are zero-byte objects
    // and cannot be presigned meaningfully — doing so crashes the dev server.
    if (shareFile.endsWith('/')) {
      toast.error('Folders cannot be shared. Select an individual file instead.')
      setShareFile(null)
      return
    }

    // Look up in allFiles (unfiltered) so share works even when a
    // search / type filter is active. Also fall back to folders[] so that a
    // folder selected via BulkActions can be reported properly.
    const fileMatch = allFiles.find(f => f.key === shareFile)
    const folderMatch = folders.find(f => f.key === shareFile)
    const displayName = fileMatch?.name ?? folderMatch?.name
    if (!displayName) return

    try {
      const result = await fileActions.share({ key: shareFile, duration, unit })
      // Close the ShareModal AFTER the API call succeeds, not before.
      setShareFile(null)
      setShareLink({
        fileName: displayName,
        url: result.url,
        expiryDate: new Date(result.expiryDate),
      })
    } catch {
      // Leave the ShareModal open so the user can retry
      toast.error('Failed to generate share link. Please try again.')
    }
  }

  const handleBulkDownload = () => {
    selection.keys.forEach(key => fileActions.download(key))
  }

  const allSelected = selection.count > 0 && selection.count === files.length + folders.length

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <Header />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 py-7">
        <BreadcrumbNav
          currentPath={currentPath}
          onNewFolder={() => setShowNewFolder(true)}
        />

        {isError && (
          <div
            className="rounded-xl p-4 mb-5 flex items-start gap-3"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderLeft: '2px solid rgba(239,68,68,0.6)',
            }}
          >
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="rgba(239,68,68,0.7)" strokeWidth="1.2" />
              <path d="M8 5v4M8 11v.5" stroke="rgba(239,68,68,0.8)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <p className="text-sm" style={{ color: 'rgba(239,68,68,0.85)' }}>
              Failed to load files. Please check your R2 credentials and bucket name.
            </p>
          </div>
        )}

        {selection.count > 0 && (
          <BulkActions
            count={selection.count}
            onClear={selection.clear}
            onDownload={handleBulkDownload}
            onDelete={handleBulkDelete}
            onShare={() => {
              // Only share files, not folders (folder keys end with '/')
              const firstFileKey = selection.keys.find(k => !k.endsWith('/'))
              if (firstFileKey) {
                setShareFile(firstFileKey)
              } else {
                toast.error('Folders cannot be shared. Select a file to share.')
              }
            }}
          />
        )}

        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          fileTypeFilter={fileTypeFilter}
          onFileTypeChange={setFileTypeFilter}
        />

        <UploadDropzone
          onDrop={uploadFiles}
          isUploading={uploads.length > 0}
          uploadingFileName={uploads[0]?.file.name}
        />

        <UploadProgress uploads={uploads} />

        <div
          className="mt-5 rounded-xl p-5"
          style={{
            background: '#0F0F0F',
            border: '1px solid rgba(42,42,42,0.65)',
          }}
        >
          <FileList
            folders={folders}
            files={files}
            selectedKeys={selection.keys}
            onToggleSelect={selection.toggle}
            onSelectAll={() => {
              if (allSelected) {
                selection.clear()
              } else {
                selection.selectAll([...folders.map(f => f.key), ...files.map(f => f.key)])
              }
            }}
            allSelected={allSelected}
            onFolderClick={handleFolderClick}
            onFileAction={handleFileAction}
            isLoading={!data}
          />
        </div>
      </main>

      <NewFolderModal
        open={showNewFolder}
        onOpenChange={setShowNewFolder}
        currentPath={currentPath}
        onSuccess={refetch}
      />

      <RenameModal
        open={!!renameFile}
        onOpenChange={(open) => !open && setRenameFile(null)}
        currentName={renameFile?.name || ''}
        onRename={handleRename}
        isRenaming={fileActions.isRenaming}
      />

      <DeleteModal
        open={deleteFiles.length > 0}
        onOpenChange={(open) => !open && setDeleteFiles([])}
        fileNames={deleteFiles.map(key => {
          // Folder keys end with '/': strip the trailing slash first,
          // then take the last segment so we get the folder name not "".
          const normalized = key.endsWith('/') ? key.slice(0, -1) : key
          return normalized.split('/').pop() || normalized
        })}
        onConfirm={handleDelete}
        isDeleting={fileActions.isDeleting}
      />

      <ShareModal
        open={!!shareFile}
        onOpenChange={(open) => !open && setShareFile(null)}
        onGenerate={handleShare}
        isGenerating={fileActions.isSharing}
      />

      <ShareLinkModal
        open={!!shareLink}
        onOpenChange={(open) => !open && setShareLink(null)}
        fileName={shareLink?.fileName || ''}
        url={shareLink?.url || ''}
        expiryDate={shareLink?.expiryDate || new Date()}
      />
    </div>
  )
}
