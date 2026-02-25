import { NextRequest, NextResponse } from 'next/server'
import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { deleteSchema, parseBody, sanitizeKey } from '@/lib/validations'

/**
 * Recursively collect all object keys under a folder prefix (including the
 * folder marker itself).  Handles pagination via ContinuationToken.
 */
async function listAllKeysUnderPrefix(prefix: string): Promise<string[]> {
  const keys: string[] = []
  let continuationToken: string | undefined

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    })
    const response = await r2Client.send(command)

    for (const obj of response.Contents ?? []) {
      if (obj.Key) keys.push(obj.Key)
    }

    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  return keys
}

/**
 * Delete a batch of keys (max 1000 per DeleteObjects call).
 */
async function deleteBatch(keys: string[]): Promise<void> {
  if (keys.length === 0) return

  // S3/R2 DeleteObjects accepts at most 1000 keys per request
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000)
    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: chunk.map((key) => ({ Key: key })),
        Quiet: true,
      },
    })
    await r2Client.send(command)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = parseBody(deleteSchema, body)
    if (!parsed.success) return parsed.response

    const sanitizedKeys = parsed.data.keys.map(sanitizeKey)

    // Separate folder keys (end with '/') from file keys
    const folderKeys = sanitizedKeys.filter((k) => k.endsWith('/'))
    const fileKeys = sanitizedKeys.filter((k) => !k.endsWith('/'))

    // For each folder prefix, expand to all contained object keys recursively
    const expandedFolderKeys: string[] = []
    for (const prefix of folderKeys) {
      const children = await listAllKeysUnderPrefix(prefix)
      expandedFolderKeys.push(...children)
      // If the folder marker itself wasn't returned by list (empty folder),
      // make sure we still delete the marker key
      if (!expandedFolderKeys.includes(prefix)) {
        expandedFolderKeys.push(prefix)
      }
    }

    // Deduplicate and merge all keys to delete
    const allKeys = Array.from(new Set([...fileKeys, ...expandedFolderKeys]))

    await deleteBatch(allKeys)

    return NextResponse.json({ success: true, deleted: allKeys.length })
  } catch (error) {
    console.error('Delete files error:', error)
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 })
  }
}
