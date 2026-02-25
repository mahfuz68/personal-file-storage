import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBucketStore } from '@/store/bucketStore'

interface ConnectBucketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConnectBucketModal({ open, onOpenChange }: ConnectBucketModalProps) {
  const { connect } = useBucketStore()
  const [bucketName, setBucketName] = useState('')

  const handleConnect = () => {
    if (bucketName.trim()) {
      connect(bucketName)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161616] border-[#2A2A2A] max-w-md">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-xl">Connect to Bucket</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Bucket Name</Label>
            <Input
              placeholder="my-bucket"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              className="bg-[#0D0D0D] border-[#2A2A2A] h-11 text-base"
            />
          </div>
          <p className="text-xs text-[#71717A] bg-[#0D0D0D] p-3 rounded border border-[#2A2A2A]">
            Note: R2 credentials should be configured in environment variables
          </p>
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
            onClick={handleConnect} 
            className="bg-[#F97316] hover:bg-[#EA6C0A] min-w-[100px]"
          >
            Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
