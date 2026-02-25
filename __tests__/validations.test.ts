/**
 * Tests for lib/validations.ts
 *
 * Covers:
 *  - sanitizeKey() path-traversal stripping
 *  - All Zod schemas (happy path + error cases)
 *  - parseBody() helper (validation error shape)
 *  - MAX_SHARE_EXPIRY_SECONDS constant
 */

import {
  sanitizeKey,
  uploadSchema,
  downloadSchema,
  deleteSchema,
  renameSchema,
  shareSchema,
  listSchema,
  createFolderSchema,
  parseBody,
  MAX_SHARE_EXPIRY_SECONDS,
} from '../lib/validations'

// ---------------------------------------------------------------------------
// sanitizeKey
// ---------------------------------------------------------------------------
describe('sanitizeKey', () => {
  it('passes through a clean key unchanged', () => {
    expect(sanitizeKey('folder/file.txt')).toBe('folder/file.txt')
  })

  it('strips leading ../ traversal', () => {
    const result = sanitizeKey('../../../etc/passwd')
    expect(result).not.toContain('..')
  })

  it('strips embedded ../ traversal', () => {
    const result = sanitizeKey('docs/../../../etc/passwd')
    expect(result).not.toContain('..')
  })

  it('removes leading slash (absolute-path escape)', () => {
    expect(sanitizeKey('/etc/passwd')).toBe('etc/passwd')
  })

  it('preserves trailing slash for folder marker objects', () => {
    expect(sanitizeKey('my-folder/')).toBe('my-folder/')
    expect(sanitizeKey('a/b/c/')).toBe('a/b/c/')
  })

  it('normalises Windows backslashes', () => {
    const result = sanitizeKey('folder\\..\\secret.txt')
    expect(result).not.toContain('..')
    expect(result).not.toContain('\\')
  })

  it('removes null bytes', () => {
    const result = sanitizeKey('file\0.txt')
    expect(result).not.toContain('\0')
  })

  it('preserves deep nested folder paths', () => {
    expect(sanitizeKey('a/b/c/d.mp4')).toBe('a/b/c/d.mp4')
  })
})

// ---------------------------------------------------------------------------
// MAX_SHARE_EXPIRY_SECONDS
// ---------------------------------------------------------------------------
describe('MAX_SHARE_EXPIRY_SECONDS', () => {
  it('equals 7 days in seconds', () => {
    expect(MAX_SHARE_EXPIRY_SECONDS).toBe(604_800)
  })
})

// ---------------------------------------------------------------------------
// uploadSchema
// ---------------------------------------------------------------------------
describe('uploadSchema', () => {
  it('accepts valid upload payload', () => {
    const result = uploadSchema.safeParse({
      filename: 'video.mp4',
      contentType: 'video/mp4',
      path: 'videos/',
    })
    expect(result.success).toBe(true)
  })

  it('applies default empty string for missing path', () => {
    const result = uploadSchema.safeParse({ filename: 'a.txt', contentType: 'text/plain' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.path).toBe('')
  })

  it('rejects empty filename', () => {
    const result = uploadSchema.safeParse({ filename: '', contentType: 'text/plain' })
    expect(result.success).toBe(false)
  })

  it('rejects path-traversal filename', () => {
    const result = uploadSchema.safeParse({
      filename: '../etc/passwd',
      contentType: 'text/plain',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty contentType', () => {
    const result = uploadSchema.safeParse({ filename: 'a.txt', contentType: '' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// downloadSchema
// ---------------------------------------------------------------------------
describe('downloadSchema', () => {
  it('accepts a valid key', () => {
    const result = downloadSchema.safeParse({ key: 'folder/video.mp4' })
    expect(result.success).toBe(true)
  })

  it('rejects empty key', () => {
    const result = downloadSchema.safeParse({ key: '' })
    expect(result.success).toBe(false)
  })

  it('rejects path-traversal key', () => {
    const result = downloadSchema.safeParse({ key: '../secret.env' })
    expect(result.success).toBe(false)
  })

  it('rejects missing key field', () => {
    const result = downloadSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// deleteSchema
// ---------------------------------------------------------------------------
describe('deleteSchema', () => {
  it('accepts valid keys array', () => {
    const result = deleteSchema.safeParse({ keys: ['a.txt', 'b/c.pdf'] })
    expect(result.success).toBe(true)
  })

  it('rejects empty keys array', () => {
    const result = deleteSchema.safeParse({ keys: [] })
    expect(result.success).toBe(false)
  })

  it('rejects keys array with path-traversal entry', () => {
    const result = deleteSchema.safeParse({ keys: ['ok.txt', '../etc/passwd'] })
    expect(result.success).toBe(false)
  })

  it('rejects more than 1000 keys', () => {
    const keys = Array.from({ length: 1001 }, (_, i) => `file${i}.txt`)
    const result = deleteSchema.safeParse({ keys })
    expect(result.success).toBe(false)
  })

  it('rejects non-array value', () => {
    const result = deleteSchema.safeParse({ keys: 'file.txt' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// renameSchema
// ---------------------------------------------------------------------------
describe('renameSchema', () => {
  it('accepts valid old and new keys', () => {
    const result = renameSchema.safeParse({ oldKey: 'old.txt', newKey: 'new.txt' })
    expect(result.success).toBe(true)
  })

  it('rejects path-traversal in oldKey', () => {
    const result = renameSchema.safeParse({ oldKey: '../../etc/passwd', newKey: 'safe.txt' })
    expect(result.success).toBe(false)
  })

  it('rejects path-traversal in newKey', () => {
    const result = renameSchema.safeParse({ oldKey: 'safe.txt', newKey: '../escape.txt' })
    expect(result.success).toBe(false)
  })

  it('rejects empty oldKey', () => {
    const result = renameSchema.safeParse({ oldKey: '', newKey: 'new.txt' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// shareSchema
// ---------------------------------------------------------------------------
describe('shareSchema', () => {
  it('accepts valid share request', () => {
    const result = shareSchema.safeParse({ key: 'video.mp4', duration: 1, unit: 'hours' })
    expect(result.success).toBe(true)
  })

  it('rejects negative duration', () => {
    const result = shareSchema.safeParse({ key: 'video.mp4', duration: -5, unit: 'hours' })
    expect(result.success).toBe(false)
  })

  it('rejects zero duration', () => {
    const result = shareSchema.safeParse({ key: 'video.mp4', duration: 0, unit: 'hours' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid unit', () => {
    const result = shareSchema.safeParse({ key: 'video.mp4', duration: 1, unit: 'years' })
    expect(result.success).toBe(false)
  })

  it('rejects path-traversal key', () => {
    const result = shareSchema.safeParse({ key: '../secret', duration: 1, unit: 'hours' })
    expect(result.success).toBe(false)
  })

  it('rejects folder keys (trailing slash) — would crash the dev server', () => {
    const result = shareSchema.safeParse({ key: 'my-folder/', duration: 1, unit: 'hours' })
    expect(result.success).toBe(false)
  })

  it('rejects nested folder keys', () => {
    const result = shareSchema.safeParse({ key: 'a/b/c/', duration: 1, unit: 'hours' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid units', () => {
    for (const unit of ['minutes', 'hours', 'days', 'weeks'] as const) {
      const result = shareSchema.safeParse({ key: 'f.txt', duration: 1, unit })
      expect(result.success).toBe(true)
    }
  })
})

// ---------------------------------------------------------------------------
// listSchema
// ---------------------------------------------------------------------------
describe('listSchema', () => {
  it('accepts a valid prefix', () => {
    const result = listSchema.safeParse({ prefix: 'folder/' })
    expect(result.success).toBe(true)
  })

  it('accepts empty string prefix', () => {
    const result = listSchema.safeParse({ prefix: '' })
    expect(result.success).toBe(true)
  })

  it('defaults prefix to empty string when omitted', () => {
    const result = listSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.prefix).toBe('')
  })

  it('rejects path-traversal prefix', () => {
    const result = listSchema.safeParse({ prefix: '../etc' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// createFolderSchema
// ---------------------------------------------------------------------------
describe('createFolderSchema', () => {
  it('accepts valid folder creation payload', () => {
    const result = createFolderSchema.safeParse({ path: 'docs/', folderName: 'reports' })
    expect(result.success).toBe(true)
  })

  it('defaults path to empty string when omitted', () => {
    const result = createFolderSchema.safeParse({ folderName: 'new-folder' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.path).toBe('')
  })

  it('rejects empty folderName', () => {
    const result = createFolderSchema.safeParse({ folderName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects path-traversal in folderName', () => {
    const result = createFolderSchema.safeParse({ folderName: '../secrets' })
    expect(result.success).toBe(false)
  })

  it('rejects path-traversal in path', () => {
    const result = createFolderSchema.safeParse({ path: '../../', folderName: 'ok' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// parseBody
// ---------------------------------------------------------------------------
describe('parseBody', () => {
  it('returns success:true with parsed data on valid input', () => {
    const result = parseBody(downloadSchema, { key: 'file.txt' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.key).toBe('file.txt')
  })

  it('returns success:false with a NextResponse on invalid input', () => {
    const result = parseBody(downloadSchema, { key: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      // The response should be a NextResponse object (has a status property)
      expect(result.response).toBeDefined()
    }
  })

  it('includes issues array in the error response body', async () => {
    const result = parseBody(downloadSchema, { key: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const body = await result.response.json()
      expect(body).toHaveProperty('error', 'Validation failed')
      expect(Array.isArray(body.issues)).toBe(true)
      expect(body.issues.length).toBeGreaterThan(0)
    }
  })
})
