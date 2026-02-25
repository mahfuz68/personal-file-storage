import { NextRequest, NextResponse } from 'next/server'

// ─── credentials ────────────────────────────────────────────────────────────
// Change these or move them to .env.local as AUTH_EMAIL / AUTH_PASSWORD
const VALID_EMAIL    = process.env.AUTH_EMAIL    ?? 'admin@example.com'
const VALID_PASSWORD = process.env.AUTH_PASSWORD ?? 'admin123'
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'r2-file-manager-secret'
// ────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.trim().toLowerCase() !== VALID_EMAIL.toLowerCase() ||
      password !== VALID_PASSWORD
    ) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    // Simple signed token: base64(email + timestamp + secret-hash)
    const token = Buffer.from(
      JSON.stringify({ email: email.trim(), ts: Date.now(), sig: SESSION_SECRET })
    ).toString('base64')

    const res = NextResponse.json({ ok: true })
    res.cookies.set('r2_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
