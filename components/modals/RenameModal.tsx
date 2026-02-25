import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RenameModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  onRename: (newName: string) => void
  isRenaming: boolean
}

export function RenameModal({
  open,
  onOpenChange,
  currentName,
  onRename,
  isRenaming,
}: RenameModalProps) {
  const [newName, setNewName] = useState(currentName)

  useEffect(() => {
    setNewName(currentName)
  }, [currentName])

  const handleRename = () => {
    if (newName.trim() && newName !== currentName) {
      onRename(newName.trim())
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161616] border-[#2A2A2A] max-w-md">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-xl">Rename File</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium">New Name</Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
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
            onClick={handleRename}
            disabled={!newName.trim() || newName === currentName || isRenaming}
            className="bg-[#F97316] hover:bg-[#EA6C0A] min-w-[100px]"
          >
            Rename
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
