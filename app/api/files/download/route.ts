import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { downloadSchema, parseBody, sanitizeKey } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = parseBody(downloadSchema, body)
    if (!parsed.success) return parsed.response

    const key = sanitizeKey(parsed.data.key)

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn: 300 })

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Download URL error:', error)
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
  }
}
