import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { uploadSchema, parseBody, sanitizeKey } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = parseBody(uploadSchema, body)
    if (!parsed.success) return parsed.response

    const { filename, contentType, path } = parsed.data

    // Sanitize each segment before joining
    const sanitizedPath = path ? sanitizeKey(path) : ''
    const sanitizedFilename = sanitizeKey(filename)
    const key = sanitizedPath ? `${sanitizedPath}${sanitizedFilename}` : sanitizedFilename

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 })

    return NextResponse.json({ url, key })
  } catch (error) {
    console.error('Upload presigned URL error:', error)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
