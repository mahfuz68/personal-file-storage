import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, bucketName } from '@/lib/r2-client'
import { durationToSeconds } from '@/lib/constants'
import { shareSchema, parseBody, sanitizeKey, MAX_SHARE_EXPIRY_SECONDS } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = parseBody(shareSchema, body)
    if (!parsed.success) return parsed.response

    const { duration, unit } = parsed.data
    const key = sanitizeKey(parsed.data.key)

    // Enforce maximum presigned-URL lifetime (7 days)
    const rawExpiresIn = durationToSeconds(duration, unit)
    const expiresIn = Math.min(rawExpiresIn, MAX_SHARE_EXPIRY_SECONDS)

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn })

    const expiryDate = new Date(Date.now() + expiresIn * 1000)

    return NextResponse.json({ url, expiryDate })
  } catch (error) {
    console.error('Share URL error:', error)
    return NextResponse.json({ error: 'Failed to generate share URL' }, { status: 500 })
  }
}
