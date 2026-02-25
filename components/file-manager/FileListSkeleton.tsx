export function FileListSkeleton() {
  return (
    <div className="space-y-2.5">
      {/* Column header skeleton */}
      <div
        className="flex items-center gap-4 px-4 pb-3 mb-2"
        style={{ borderBottom: '1px solid rgba(42,42,42,0.4)' }}
      >
        <div className="w-4 h-4 rounded bg-[#1E1E1E] animate-pulse flex-shrink-0" />
        <div className="w-9 flex-shrink-0" />
        <div className="w-16 h-3 rounded bg-[#1E1E1E] animate-pulse" />
      </div>

      {/* Row skeletons */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 rounded-lg animate-pulse"
          style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(42,42,42,0.45)',
            borderLeft: '2px solid rgba(42,42,42,0.3)',
            animationDelay: `${i * 80}ms`,
          }}
        >
          {/* Checkbox placeholder */}
          <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: 'rgba(42,42,42,0.6)' }} />

          {/* Icon box skeleton */}
          <div
            className="w-9 h-9 rounded-lg flex-shrink-0"
            style={{ background: 'rgba(42,42,42,0.5)' }}
          />

          {/* Name + subtitle */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div
              className="h-3.5 rounded"
              style={{
                background: 'rgba(42,42,42,0.6)',
                width: `${40 + (i * 13) % 40}%`,
              }}
            />
            <div
              className="h-2.5 rounded"
              style={{
                background: 'rgba(42,42,42,0.35)',
                width: `${20 + (i * 7) % 20}%`,
              }}
            />
          </div>

          {/* Badge skeleton */}
          <div
            className="hidden sm:block w-14 h-5 rounded-md flex-shrink-0"
            style={{ background: 'rgba(42,42,42,0.4)' }}
          />

          {/* Actions placeholder */}
          <div className="w-[116px] flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}
