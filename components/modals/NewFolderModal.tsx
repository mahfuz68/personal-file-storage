import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface NewFolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPath: string
  onSuccess: () => void
}

export function NewFolderModal({ open, onOpenChange, currentPath, onSuccess }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!folderName.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/folders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath, folderName: folderName.trim() }),
      })

      if (!response.ok) throw new Error('Failed to create folder')

      toast.success(`Folder "${folderName}" created successfully`)
      setFolderName('')
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error('Failed to create folder')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161616] border-[#2A2A2A] max-w-md">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-xl">Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Folder Name</Label>
            <Input
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="bg-[#0D0D0D] border-[#2A2A2A] h-11 text-base"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
            className="bg-[#1F1F1F] hover:bg-[#2A2A2A] min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!folderName.trim() || isCreating}
            className="bg-[#22C55E] hover:bg-[#1EA952] min-w-[100px]"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
