import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { sanitizeKey } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.CLI_API_KEY

    if (!expectedKey) {
      return NextResponse.json({ error: 'CLI upload not configured. Set CLI_API_KEY in .env.local' }, { status: 503 })
    }

    if (!apiKey || apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Invalid or missing API key. Use -H "x-api-key: YOUR_KEY" with curl.' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const path = (formData.get('path') as string) || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided. Use -F "file=@filename" with curl.' }, { status: 400 })
    }

    const sanitizedPath = path ? sanitizeKey(path) : ''
    const sanitizedFilename = sanitizeKey(file.name)
    const key = sanitizedPath ? `${sanitizedPath}${sanitizedFilename}` : sanitizedFilename

    const buffer = Buffer.from(await file.arrayBuffer())

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
    })

    await r2Client.send(command)

    return NextResponse.json({
      success: true,
      key,
      size: buffer.length,
      message: `File uploaded successfully to ${key}`,
    })
  } catch (error) {
    console.error('CLI upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
