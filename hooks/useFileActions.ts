import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useFileActions(currentPath: string) {
  const queryClient = useQueryClient()

  const renameMutation = useMutation({
    mutationFn: async ({ oldKey, newKey }: { oldKey: string; newKey: string }) => {
      const response = await fetch('/api/files/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldKey, newKey }),
      })
      if (!response.ok) throw new Error('Failed to rename')
      return response.json()
    },
    onSuccess: (_, { newKey }) => {
      queryClient.invalidateQueries({ queryKey: ['files', currentPath] })
      const filename = newKey.split('/').pop()
      toast.success(`File renamed to "${filename}" successfully`)
    },
    onError: () => {
      toast.error('Failed to rename file')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (keys: string[]) => {
      const response = await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys }),
      })
      if (!response.ok) throw new Error('Failed to delete')
      return response.json()
    },
    onSuccess: (_, keys) => {
      queryClient.invalidateQueries({ queryKey: ['files', currentPath] })
      toast.success(`${keys.length} file(s) deleted successfully`)
    },
    onError: () => {
      toast.error('Failed to delete files')
    },
  })

  const shareMutation = useMutation({
    mutationFn: async ({ key, duration, unit }: { key: string; duration: number; unit: string }) => {
      const response = await fetch('/api/files/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, duration, unit }),
      })
      if (!response.ok) throw new Error('Failed to generate share link')
      return response.json()
    },
  })

  const downloadFile = async (key: string) => {
    try {
      const response = await fetch('/api/files/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      const { url } = await response.json()
      window.open(url, '_blank')
    } catch (error) {
      toast.error('Failed to download file')
    }
  }

  return {
    rename: renameMutation.mutate,
    delete: deleteMutation.mutate,
    share: shareMutation.mutateAsync,
    download: downloadFile,
    isRenaming: renameMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSharing: shareMutation.isPending,
  }
}
