import { NextRequest, NextResponse } from 'next/server'
import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { renameSchema, parseBody, sanitizeKey } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = parseBody(renameSchema, body)
    if (!parsed.success) return parsed.response

    const oldKey = sanitizeKey(parsed.data.oldKey)
    const newKey = sanitizeKey(parsed.data.newKey)

    // Copy object to new key
    const copyCommand = new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `${bucketName}/${oldKey}`,
      Key: newKey,
    })
    await r2Client.send(copyCommand)

    // Delete old object
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: oldKey,
    })
    await r2Client.send(deleteCommand)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Rename file error:', error)
    return NextResponse.json({ error: 'Failed to rename file' }, { status: 500 })
  }
}
