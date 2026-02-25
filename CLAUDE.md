# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint (flat config via eslint.config.mjs)
```

There are no tests in this project.

## Environment Setup

Requires a `.env.local` file with Cloudflare R2 credentials:

```env
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_REGION=auto
```

See `R2_SETUP_GUIDE.md` for full instructions including required R2 CORS configuration.

## Architecture

This is a **Next.js 16 App Router** file manager UI for Cloudflare R2 (S3-compatible). It uses React 19 with the React Compiler (`reactCompiler: true` in `next.config.ts`), Tailwind CSS v4, shadcn/ui (New York style), TanStack Query v5, Zustand v5, and Sonner for toasts.

### Data Flow

```
Browser → Next.js API Routes → AWS SDK (S3Client) → Cloudflare R2
```

The API routes in `app/api/files/` and `app/api/folders/` are the only server-side code. They use `lib/r2-client.ts` which builds an `S3Client` from env vars at module load time. All file operations use presigned URLs for upload/download (client calls API → gets presigned URL → browser talks directly to R2).

### State Management

- **TanStack Query** (`useFiles` hook): Fetches and caches `GET /api/files/list?prefix=<path>` — returns `{ files: FileItem[], folders: FolderItem[] }`. Query key is `['files', path]`. Mutations in `useFileActions` invalidate this key on success.
- **Zustand** (`store/bucketStore.ts`, persisted as `bucket-storage`): Tracks `isConnected`, `bucketName`, `currentPath`. Uses `skipHydration: true` — the root `page.tsx` manually rehydrates it client-side to avoid SSR mismatch.

### Routing & Path Encoding

- `/storage` → root of bucket (`currentPath = ""`)
- `/storage/[...path]` → subfolder (`currentPath = "folder/subfolder/"`)
- R2 uses a flat key namespace with `/` as delimiter. Folders are represented as zero-byte objects ending in `/` (created by `app/api/folders/create/route.ts`).
- Navigation is driven by `BreadcrumbNav` which pushes Next.js routes; `FileManagerShell` receives `currentPath` as a prop from the page.

### Component Structure

`FileManagerShell` is the single orchestrating client component. It owns all modal open/close state and wires together four hooks:

- `useFiles(path)` — data fetching
- `useUpload(path, onComplete)` — handles drag-and-drop upload via presigned PUT URLs, tracks per-file progress
- `useSelection()` — checkbox multi-select state
- `useFileActions(path)` — rename/delete/share/download mutations

All modals (`components/modals/`) are rendered at the bottom of `FileManagerShell` and controlled via local state.

### Styling Conventions

- Dark theme only. CSS variables defined in `.dark {}` block in `app/globals.css`.
- Key palette: background `#0A0A0A`, card/modal `#161616`, border `#2A2A2A`, primary orange `#F97316`, success green `#22C55E`, muted text `#A1A1AA`.
- Always use explicit `text-white` on interactive elements — shadcn component variants may default to muted/grey in this dark theme.
- `SelectContent` dropdowns require explicit `bg-[#1F1F1F] border-[#2A2A2A] text-white` and `SelectItem` needs `text-white focus:bg-[#2A2A2A] focus:text-white` to be visible.
- `cn()` from `lib/utils.ts` combines `clsx` + `tailwind-merge`.

### Adding a New API Route

Follow the pattern in existing routes: create `app/api/<resource>/<action>/route.ts`, import `r2Client` and `bucketName` from `lib/r2-client.ts`, use `@aws-sdk/client-s3` commands. All routes are POST except `/api/files/list` (GET).

### shadcn/ui Components

New components can be added with `npx shadcn add <component>`. They land in `components/ui/` and use `radix-ui` primitives directly (not the scoped `@radix-ui/*` packages).
