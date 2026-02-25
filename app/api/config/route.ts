import { NextResponse } from 'next/server'

export async function GET() {
  const bucketName = process.env.R2_BUCKET_NAME

  return NextResponse.json({
    bucketName: bucketName || null,
    hasEnvBucket: !!bucketName,
  })
}
