import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { createFolderSchema, parseBody, sanitizeKey } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = parseBody(createFolderSchema, body)
    if (!parsed.success) return parsed.response

    const sanitizedPath = parsed.data.path ? sanitizeKey(parsed.data.path) : ''
    const sanitizedFolderName = sanitizeKey(parsed.data.folderName)
    const key = sanitizedPath
      ? `${sanitizedPath}${sanitizedFolderName}/`
      : `${sanitizedFolderName}/`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: '',
    })

    await r2Client.send(command)

    return NextResponse.json({ success: true, key })
  } catch (error) {
    console.error('Create folder error:', error)
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
  }
}
