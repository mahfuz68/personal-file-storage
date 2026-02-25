export interface FileItem {
  key: string
  name: string
  size: number
  lastModified: Date
  type: string
}

export interface FolderItem {
  key: string
  name: string
}

export interface ShareConfig {
  duration: number
  unit: 'minutes' | 'hours' | 'days' | 'weeks'
}

export interface UploadProgress {
  file: File
  progress: number
  speed: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
}

export interface BucketCredentials {
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  region: string
}
