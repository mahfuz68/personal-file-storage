import { useQuery } from '@tanstack/react-query'
import type { FileItem, FolderItem } from '@/types'

interface FilesResponse {
  files: FileItem[]
  folders: FolderItem[]
}

async function fetchFiles(path: string): Promise<FilesResponse> {
  const params = new URLSearchParams({ prefix: path })
  const response = await fetch(`/api/files/list?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch files')
  }
  
  return response.json()
}

export function useFiles(path: string) {
  return useQuery({
    queryKey: ['files', path],
    queryFn: () => fetchFiles(path),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  })
}
