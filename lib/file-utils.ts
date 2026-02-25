import { Film, Image, FileText, File, Music, Archive, Code } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`
}

export function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv']
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  const documentExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac']
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
  const codeExts = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'php', 'rb', 'html', 'css']
  
  if (videoExts.includes(ext)) return 'VIDEO'
  if (imageExts.includes(ext)) return 'IMAGE'
  if (documentExts.includes(ext)) return 'DOCUMENT'
  if (audioExts.includes(ext)) return 'AUDIO'
  if (archiveExts.includes(ext)) return 'ARCHIVE'
  if (codeExts.includes(ext)) return 'CODE'
  
  return 'FILE'
}

export function getFileIcon(type: string): LucideIcon {
  switch (type) {
    case 'VIDEO': return Film
    case 'IMAGE': return Image
    case 'DOCUMENT': return FileText
    case 'AUDIO': return Music
    case 'ARCHIVE': return Archive
    case 'CODE': return Code
    default: return File
  }
}

export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  
  const mimeTypes: Record<string, string> = {
    // Video
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    // Image
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    // Document
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    // Archive
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    // Code
    js: 'text/javascript',
    ts: 'text/typescript',
    json: 'application/json',
    html: 'text/html',
    css: 'text/css',
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
}
