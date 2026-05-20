import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    apiKey: process.env.CLI_API_KEY || '',
    baseUrl: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  })
}
