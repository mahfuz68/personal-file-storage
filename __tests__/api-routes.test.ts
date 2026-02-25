/**
 * Integration tests for all API route handlers.
 *
 * AWS SDK calls are mocked so no real R2 bucket is needed.
 * NextResponse / NextRequest are imported directly from next/server.
 */

// ---------------------------------------------------------------------------
// Global mocks  (must be before any imports that touch @aws-sdk)
// ---------------------------------------------------------------------------
jest.mock('@aws-sdk/client-s3', () => {
  const mockSend = jest.fn().mockResolvedValue({
    CommonPrefixes: [],
    Contents: [],
  })
  return {
    S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
    ListObjectsV2Command: jest.fn(),
    PutObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
    DeleteObjectsCommand: jest.fn(),
    CopyObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
    __mockSend: mockSend,
  }
})

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://presigned.example.com/object?sig=abc'),
}))

// Stub env vars consumed by lib/r2-client.ts at module load time
process.env.R2_REGION = 'auto'
process.env.R2_ENDPOINT = 'https://test.r2.cloudflarestorage.com'
process.env.R2_ACCESS_KEY_ID = 'test-key-id'
process.env.R2_SECRET_ACCESS_KEY = 'test-secret'
process.env.R2_BUCKET_NAME = 'test-bucket'

// ---------------------------------------------------------------------------
// Helper: build a NextRequest-compatible object
// ---------------------------------------------------------------------------
import { NextRequest } from 'next/server'

function makeRequest(
  method: string,
  url: string,
  body?: Record<string, unknown>
): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

// ---------------------------------------------------------------------------
// Route handler imports  (after mocks are set up)
// ---------------------------------------------------------------------------
import { GET as listHandler } from '../app/api/files/list/route'
import { POST as uploadHandler } from '../app/api/files/upload/route'
import { POST as downloadHandler } from '../app/api/files/download/route'
import { POST as deleteHandler } from '../app/api/files/delete/route'
import { POST as renameHandler } from '../app/api/files/rename/route'
import { POST as shareHandler } from '../app/api/files/share/route'
import { POST as createFolderHandler } from '../app/api/folders/create/route'
import { GET as configHandler } from '../app/api/config/route'

// ---------------------------------------------------------------------------
// Helper to read response JSON
// ---------------------------------------------------------------------------
async function json(res: Response) {
  return res.json()
}

// ============================================================================
// /api/files/list (GET)
// ============================================================================
describe('GET /api/files/list', () => {
  it('returns 200 with folders and files on valid prefix', async () => {
    const req = makeRequest('GET', 'http://localhost/api/files/list?prefix=docs/')
    const res = await listHandler(req as NextRequest)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveProperty('folders')
    expect(body).toHaveProperty('files')
  })

  it('returns 200 with empty prefix (root listing)', async () => {
    const req = makeRequest('GET', 'http://localhost/api/files/list?prefix=')
    const res = await listHandler(req as NextRequest)
    expect(res.status).toBe(200)
  })

  it('returns 400 on path-traversal prefix', async () => {
    const req = makeRequest('GET', 'http://localhost/api/files/list?prefix=../etc')
    const res = await listHandler(req as NextRequest)
    expect(res.status).toBe(400)
    const body = await json(res)
    expect(body).toHaveProperty('error', 'Validation failed')
  })

  it('does NOT expose internal error details in 500 response', async () => {
    const { __mockSend } = require('@aws-sdk/client-s3') as any
    __mockSend.mockRejectedValueOnce(new Error('InternalSDKError: secret config'))

    const req = makeRequest('GET', 'http://localhost/api/files/list?prefix=')
    const res = await listHandler(req as NextRequest)
    expect(res.status).toBe(500)
    const body = await json(res)
    expect(body).not.toHaveProperty('details')
    expect(JSON.stringify(body)).not.toContain('InternalSDKError')
  })
})

// ============================================================================
// /api/files/upload (POST)
// ============================================================================
describe('POST /api/files/upload', () => {
  it('returns 200 with presigned URL on valid payload', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/upload', {
      filename: 'video.mp4',
      contentType: 'video/mp4',
      path: 'media/',
    })
    const res = await uploadHandler(req as NextRequest)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveProperty('url')
    expect(body).toHaveProperty('key')
  })

  it('returns 400 when filename is missing', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/upload', {
      contentType: 'video/mp4',
    })
    const res = await uploadHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 on path-traversal filename', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/upload', {
      filename: '../../etc/cron.d/evil',
      contentType: 'text/plain',
    })
    const res = await uploadHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 when contentType is empty', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/upload', {
      filename: 'a.txt',
      contentType: '',
    })
    const res = await uploadHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })
})

// ============================================================================
// /api/files/download (POST)
// ============================================================================
describe('POST /api/files/download', () => {
  it('returns 200 with presigned URL on valid key', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/download', {
      key: 'folder/video.mp4',
    })
    const res = await downloadHandler(req as NextRequest)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveProperty('url')
    expect(typeof body.url).toBe('string')
  })

  it('returns 400 on empty key', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/download', { key: '' })
    const res = await downloadHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 on path-traversal key', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/download', {
      key: '../../../sensitive',
    })
    const res = await downloadHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 when key field is missing', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/download', {})
    const res = await downloadHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })
})

// ============================================================================
// /api/files/delete (POST)
// ============================================================================
describe('POST /api/files/delete', () => {
  it('returns 200 on valid keys array', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/delete', {
      keys: ['a.txt', 'b/c.pdf'],
    })
    const res = await deleteHandler(req as NextRequest)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveProperty('success', true)
  })

  it('returns 400 on empty keys array', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/delete', { keys: [] })
    const res = await deleteHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 when keys contains path-traversal', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/delete', {
      keys: ['ok.txt', '../etc/passwd'],
    })
    const res = await deleteHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 when keys exceeds 1000 items', async () => {
    const keys = Array.from({ length: 1001 }, (_, i) => `file${i}.txt`)
    const req = makeRequest('POST', 'http://localhost/api/files/delete', { keys })
    const res = await deleteHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 when keys is not an array', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/delete', {
      keys: 'file.txt',
    })
    const res = await deleteHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })
})

// ============================================================================
// /api/files/rename (POST)
// ============================================================================
describe('POST /api/files/rename', () => {
  it('returns 200 on valid rename payload', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/rename', {
      oldKey: 'old.txt',
      newKey: 'new.txt',
    })
    const res = await renameHandler(req as NextRequest)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveProperty('success', true)
  })

  it('returns 400 when oldKey is missing', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/rename', { newKey: 'new.txt' })
    const res = await renameHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 on path-traversal in newKey', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/rename', {
      oldKey: 'safe.txt',
      newKey: '../../etc/crontab',
    })
    const res = await renameHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 on path-traversal in oldKey', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/rename', {
      oldKey: '../secret',
      newKey: 'destination.txt',
    })
    const res = await renameHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })
})

// ============================================================================
// /api/files/share (POST)
// ============================================================================
describe('POST /api/files/share', () => {
  it('returns 200 with url and expiryDate on valid request', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/share', {
      key: 'video.mp4',
      duration: 1,
      unit: 'hours',
    })
    const res = await shareHandler(req as NextRequest)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveProperty('url')
    expect(body).toHaveProperty('expiryDate')
  })

  it('caps expiresIn at MAX_SHARE_EXPIRY_SECONDS (7 days)', async () => {
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner') as any
    getSignedUrl.mockClear()

    const req = makeRequest('POST', 'http://localhost/api/files/share', {
      key: 'video.mp4',
      duration: 999,
      unit: 'weeks', // 999 * 604800 >> 604800
    })
    const res = await shareHandler(req as NextRequest)
    expect(res.status).toBe(200)

    // getSignedUrl should have been called with expiresIn <= 604800
    const callArgs = getSignedUrl.mock.calls[0]
    const options = callArgs[2] as { expiresIn: number }
    expect(options.expiresIn).toBeLessThanOrEqual(604_800)
  })

  it('returns 400 on path-traversal key', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/share', {
      key: '../secrets.env',
      duration: 1,
      unit: 'hours',
    })
    const res = await shareHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 for a folder key (trailing slash) — prevents dev server crash', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/share', {
      key: 'my-folder/',
      duration: 1,
      unit: 'hours',
    })
    const res = await shareHandler(req as NextRequest)
    expect(res.status).toBe(400)
    const body = await json(res)
    expect(body.error).toBe('Validation failed')
  })

  it('returns 400 for a nested folder key', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/share', {
      key: 'a/b/c/',
      duration: 1,
      unit: 'hours',
    })
    const res = await shareHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 on invalid unit', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/share', {
      key: 'file.mp4',
      duration: 1,
      unit: 'centuries',
    })
    const res = await shareHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 when duration is zero', async () => {
    const req = makeRequest('POST', 'http://localhost/api/files/share', {
      key: 'file.mp4',
      duration: 0,
      unit: 'hours',
    })
    const res = await shareHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })
})

// ============================================================================
// /api/folders/create (POST)
// ============================================================================
describe('POST /api/folders/create', () => {
  it('returns 200 with key on valid payload', async () => {
    const req = makeRequest('POST', 'http://localhost/api/folders/create', {
      path: 'docs/',
      folderName: 'reports',
    })
    const res = await createFolderHandler(req as NextRequest)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveProperty('success', true)
    expect(body).toHaveProperty('key')
    expect((body.key as string).endsWith('/')).toBe(true)
  })

  it('creates root-level folder when path is omitted', async () => {
    const req = makeRequest('POST', 'http://localhost/api/folders/create', {
      folderName: 'new-folder',
    })
    const res = await createFolderHandler(req as NextRequest)
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body.key).toBe('new-folder/')
  })

  it('returns 400 when folderName is missing', async () => {
    const req = makeRequest('POST', 'http://localhost/api/folders/create', { path: 'docs/' })
    const res = await createFolderHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 on path-traversal in folderName', async () => {
    const req = makeRequest('POST', 'http://localhost/api/folders/create', {
      folderName: '../../evil',
    })
    const res = await createFolderHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })

  it('returns 400 on path-traversal in path', async () => {
    const req = makeRequest('POST', 'http://localhost/api/folders/create', {
      path: '../../../',
      folderName: 'ok',
    })
    const res = await createFolderHandler(req as NextRequest)
    expect(res.status).toBe(400)
  })
})

// ============================================================================
// /api/config (GET)
// ============================================================================
describe('GET /api/config', () => {
  it('returns 200 with bucketName and hasEnvBucket', async () => {
    const res = await configHandler()
    expect(res.status).toBe(200)
    const body = await json(res)
    expect(body).toHaveProperty('bucketName')
    expect(body).toHaveProperty('hasEnvBucket')
  })

  it('hasEnvBucket is true when R2_BUCKET_NAME is set', async () => {
    process.env.R2_BUCKET_NAME = 'test-bucket'
    const res = await configHandler()
    const body = await json(res)
    expect(body.hasEnvBucket).toBe(true)
  })
})
