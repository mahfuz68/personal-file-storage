import { NextRequest, NextResponse } from 'next/server'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { listSchema, parseBody, sanitizeKey } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawPrefix = searchParams.get('prefix') ?? ''

    const parsed = parseBody(listSchema, { prefix: rawPrefix })
    if (!parsed.success) return parsed.response

    // Sanitize prefix to prevent path traversal via query string
    const prefix = sanitizeKey(parsed.data.prefix)

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: '/',
    })

    const response = await r2Client.send(command)

    const folders = (response.CommonPrefixes || []).map((p) => ({
      key: p.Prefix!,
      name: p.Prefix!.replace(prefix, '').replace('/', ''),
    }))

    const files = (response.Contents || [])
      .filter((obj) => obj.Key !== prefix && !obj.Key?.endsWith('/'))
      .map((obj) => ({
        key: obj.Key!,
        name: obj.Key!.replace(prefix, ''),
        size: obj.Size || 0,
        lastModified: obj.LastModified || new Date(),
        type: obj.Key!.split('.').pop() || '',
      }))

    return NextResponse.json({ folders, files })
  } catch (error) {
    // Do NOT expose internal error details (prevents information disclosure)
    console.error('List files error:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}
