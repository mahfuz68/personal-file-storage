import { useState } from 'react'
import { getMimeType } from '@/lib/file-utils'
import type { UploadProgress } from '@/types'

export function useUpload(currentPath: string, onComplete?: () => void) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  const uploadFiles = async (files: File[]) => {
    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      speed: 0,
      status: 'pending' as const,
    }))

    setUploads(newUploads)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        // Get presigned URL
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: getMimeType(file.name),
            path: currentPath,
          }),
        })

        const { url } = await response.json()

        // Upload file with progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          let startTime = Date.now()
          let startLoaded = 0

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100
              const elapsed = (Date.now() - startTime) / 1000
              const speed = elapsed > 0 ? (e.loaded - startLoaded) / elapsed : 0

              setUploads(prev => prev.map((u, idx) => 
                idx === i ? { ...u, progress, speed, status: 'uploading' as const } : u
              ))

              startTime = Date.now()
              startLoaded = e.loaded
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              setUploads(prev => prev.map((u, idx) => 
                idx === i ? { ...u, progress: 100, status: 'completed' as const } : u
              ))
              resolve()
            } else {
              reject(new Error('Upload failed'))
            }
          })

          xhr.addEventListener('error', () => reject(new Error('Upload failed')))

          xhr.open('PUT', url)
          xhr.setRequestHeader('Content-Type', getMimeType(file.name))
          xhr.send(file)
        })
      } catch (error) {
        setUploads(prev => prev.map((u, idx) => 
          idx === i ? { ...u, status: 'error' as const } : u
        ))
      }
    }

    onComplete?.()
  }

  const clearUploads = () => setUploads([])

  return { uploads, uploadFiles, clearUploads }
}
