import { z } from 'zod'
import { NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Path / key sanitisation
// ---------------------------------------------------------------------------

/**
 * Strips path-traversal sequences (`../`, `..`) from an object-storage key.
 * R2/S3 keys are treated as flat paths; a key containing `..` could be used
 * to escape the expected prefix scope.
 */
export function sanitizeKey(key: string): string {
  // Normalise Windows-style separators
  let sanitized = key.replace(/\\/g, '/')
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')
  // Preserve a single trailing slash (folder marker objects end with /)
  const hasTrailingSlash = sanitized.endsWith('/')
  // Collapse `../` and `./` sequences repeatedly until none remain
  while (sanitized.includes('../') || sanitized.startsWith('../') || sanitized === '..') {
    sanitized = sanitized
      .replace(/\.\.\//g, '')
      .replace(/^\.\.$/g, '')
      .replace(/\/\.\.\//g, '/')
  }
  // Remove leading slashes (absolute-path escape attempt)
  sanitized = sanitized.replace(/^\/+/, '')
  // Re-apply the trailing slash that belongs to folder marker objects
  if (hasTrailingSlash && !sanitized.endsWith('/')) {
    sanitized = sanitized + '/'
  }
  return sanitized
}

/**
 * Validates that a raw key does not contain path-traversal sequences or
 * other dangerous patterns.  We reject at the schema level — sanitizeKey()
 * is then applied at the route level as a second, defence-in-depth layer.
 */
function isValidKey(val: string): boolean {
  // Null bytes are always invalid
  if (val.includes('\0')) return false
  // Normalise backslashes for the check
  const normalized = val.replace(/\\/g, '/')
  // Reject any path segment that is exactly `..`
  if (normalized.split('/').some((seg) => seg === '..')) return false
  // Must be non-empty after trimming leading slashes
  const trimmed = normalized.replace(/^\/+/, '')
  return trimmed.length > 0
}

// ---------------------------------------------------------------------------
// Reusable field schemas
// ---------------------------------------------------------------------------

const keySchema = z
  .string()
  .min(1, 'Key must not be empty')
  .refine(isValidKey, { message: 'Key contains invalid path sequences' })

const prefixSchema = z
  .string()
  .refine(
    (v) => v === '' || isValidKey(v),
    { message: 'Prefix contains invalid path sequences' }
  )

// ---------------------------------------------------------------------------
// Route-specific schemas
// ---------------------------------------------------------------------------

export const uploadSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename must not be empty')
    .refine(isValidKey, { message: 'Filename contains invalid characters' }),
  contentType: z.string().min(1, 'Content-Type must not be empty'),
  path: prefixSchema.optional().default(''),
})

export const downloadSchema = z.object({
  key: keySchema,
})

export const deleteSchema = z.object({
  keys: z
    .array(keySchema)
    .min(1, 'At least one key must be provided')
    .max(1000, 'Cannot delete more than 1000 objects at once'),
})

export const renameSchema = z.object({
  oldKey: keySchema,
  newKey: keySchema,
})

// Maximum presigned-URL lifetime: 7 days in seconds
export const MAX_SHARE_EXPIRY_SECONDS = 604_800

export const shareSchema = z
  .object({
    key: keySchema.refine(
      (k) => !k.endsWith('/'),
      { message: 'Folders cannot be shared — select a file instead' }
    ),
    duration: z.number().positive('Duration must be positive'),
    unit: z.enum(['minutes', 'hours', 'days', 'weeks']),
  })

export const listSchema = z.object({
  prefix: prefixSchema.optional().default(''),
})

export const createFolderSchema = z.object({
  path: prefixSchema.optional().default(''),
  folderName: z
    .string()
    .min(1, 'Folder name must not be empty')
    .refine(isValidKey, { message: 'Folder name contains invalid characters' }),
})

// ---------------------------------------------------------------------------
// Helper: parse & respond with validation error
// ---------------------------------------------------------------------------

type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; response: ReturnType<typeof NextResponse.json> }

export function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): ParseResult<T> {
  const result = schema.safeParse(body)
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Validation failed',
          issues: result.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      ),
    }
  }
  return { success: true, data: result.data }
}
