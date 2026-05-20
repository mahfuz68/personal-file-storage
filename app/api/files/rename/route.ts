import { NextRequest, NextResponse } from 'next/server'
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { renameSchema, parseBody, sanitizeKey } from '@/lib/validations'

async function listAllKeysUnderPrefix(prefix: string): Promise<string[]> {
  const keys: string[] = []
  let continuationToken: string | undefined

  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    })
    const response = await r2Client.send(listCommand)
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key) keys.push(obj.Key)
      }
    }
    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  return keys
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = parseBody(renameSchema, body)
    if (!parsed.success) return parsed.response

    const oldKey = sanitizeKey(parsed.data.oldKey)
    const newKey = sanitizeKey(parsed.data.newKey)

    const isFolder = oldKey.endsWith('/')

    if (isFolder) {
      const allKeys = await listAllKeysUnderPrefix(oldKey)

      if (allKeys.length === 0) {
        return NextResponse.json({ error: 'Folder is empty or not found' }, { status: 404 })
      }

      for (const key of allKeys) {
        const relativePath = key.substring(oldKey.length)
        const newObjectKey = newKey + relativePath

        const copyCommand = new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: `${bucketName}/${key}`,
          Key: newObjectKey,
        })
        await r2Client.send(copyCommand)
      }

      const batchSize = 1000
      for (let i = 0; i < allKeys.length; i += batchSize) {
        const batch = allKeys.slice(i, i + batchSize)
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: batch.map((key) => ({ Key: key })),
            Quiet: true,
          },
        })
        await r2Client.send(deleteCommand)
      }
    } else {
      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${oldKey}`,
        Key: newKey,
      })
      await r2Client.send(copyCommand)

      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: oldKey,
      })
      await r2Client.send(deleteCommand)
    }

    return NextResponse.json({ success: true, isFolder })
  } catch (error) {
    console.error('Rename error:', error)
    return NextResponse.json({ error: 'Failed to rename' }, { status: 500 })
  }
}
