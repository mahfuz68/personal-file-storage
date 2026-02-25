import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileNames: string[]
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteModal({
  open,
  onOpenChange,
  fileNames,
  onConfirm,
  isDeleting,
}: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161616] border-[#2A2A2A] max-w-md">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-xl">Delete {fileNames.length} File(s)?</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-[#A1A1AA] mb-4">
            This action cannot be undone.
          </p>
          {fileNames.length <= 5 && (
            <ul className="space-y-2 text-sm bg-[#0D0D0D] rounded-lg p-4 border border-[#2A2A2A]">
              {fileNames.map((name, index) => (
                <li key={index} className="text-[#A1A1AA]">
                  • {name}
                </li>
              ))}
            </ul>
          )}
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
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-[#EF4444] hover:bg-[#DC2626] min-w-[100px]"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
