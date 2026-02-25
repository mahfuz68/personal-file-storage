'use client'

import { use } from 'react'
import { FileManagerShell } from '@/components/file-manager/FileManagerShell'

export default function StoragePathPage({ params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = use(params)
  const currentPath = resolvedParams.path.join('/') + '/'
  
  return <FileManagerShell currentPath={currentPath} />
}
