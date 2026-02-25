import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DURATION_PRESETS, DURATION_UNITS } from '@/lib/constants'

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (duration: number, unit: string) => void
  isGenerating: boolean
}

export function ShareModal({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
}: ShareModalProps) {
  const [duration, setDuration] = useState(1)
  const [unit, setUnit] = useState<'minutes' | 'hours' | 'days' | 'weeks'>('hours')
  const [activePreset, setActivePreset] = useState<string | null>('1 hour')

  const handlePreset = (preset: typeof DURATION_PRESETS[0]) => {
    setDuration(preset.duration)
    setUnit(preset.unit as typeof unit)
    setActivePreset(preset.label)
  }

  const handleDurationChange = (val: string) => {
    setDuration(parseInt(val) || 1)
    setActivePreset(null)
  }

  const handleUnitChange = (v: string) => {
    setUnit(v as typeof unit)
    setActivePreset(null)
  }

  const handleGenerate = () => {
    onGenerate(duration, unit)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden [&>button]:text-white [&>button]:opacity-50 [&>button]:hover:opacity-100 [&>button]:transition-opacity"
        style={{
          background: '#0F0F0F',
          border: '1px solid rgba(42,42,42,0.8)',
          borderRadius: '16px',
          maxWidth: '420px',
          boxShadow: '0 0 0 1px rgba(249,115,22,0.04), 0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.5) 50%, transparent 100%)' }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 pt-6 pb-5"
          style={{ borderBottom: '1px solid rgba(42,42,42,0.6)' }}
        >
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.25)',
              boxShadow: '0 0 16px rgba(249,115,22,0.08)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2v9M5.5 7.5 9 11l3.5-3.5"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 13.5A1.5 1.5 0 0 0 4.5 15h9a1.5 1.5 0 0 0 1.5-1.5"
                stroke="#F97316"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="14" cy="4" r="3" fill="rgba(249,115,22,0.15)" stroke="#F97316" strokeWidth="1.2" />
              <path d="M14 3v2M13 4h2" stroke="#F97316" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <DialogTitle
              className="text-sm font-semibold leading-none mb-1"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              Generate Share Link
            </DialogTitle>
            <p
              className="text-xs leading-none"
              style={{ color: 'rgba(113,113,122,0.7)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              PRESIGNED URL · CLOUDFLARE R2
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">

          {/* Quick presets */}
          <div>
            <p
              className="text-[10px] tracking-widest uppercase mb-3"
              style={{ color: 'rgba(113,113,122,0.55)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              Quick Expiry
            </p>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_PRESETS.map((preset) => {
                const isActive = activePreset === preset.label
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className="h-9 rounded-lg text-xs font-medium transition-all duration-150"
                    style={{
                      background: isActive ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(42,42,42,0.7)',
                      color: isActive ? '#F97316' : 'rgba(161,161,170,0.7)',
                      fontFamily: 'var(--font-geist-mono, monospace)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        const el = e.currentTarget
                        el.style.background = 'rgba(255,255,255,0.06)'
                        el.style.borderColor = 'rgba(60,60,60,0.8)'
                        el.style.color = 'rgba(255,255,255,0.8)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        const el = e.currentTarget
                        el.style.background = 'rgba(255,255,255,0.03)'
                        el.style.borderColor = 'rgba(42,42,42,0.7)'
                        el.style.color = 'rgba(161,161,170,0.7)'
                      }
                    }}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider with label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(42,42,42,0.6)' }} />
            <span
              className="text-[10px] tracking-widest"
              style={{ color: 'rgba(113,113,122,0.4)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              OR CUSTOM
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(42,42,42,0.6)' }} />
          </div>

          {/* Custom duration row */}
          <div>
            <p
              className="text-[10px] tracking-widest uppercase mb-3"
              style={{ color: 'rgba(113,113,122,0.55)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              Custom Duration
            </p>
            <div className="flex gap-2">
              {/* Number input */}
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                className="w-24 h-10 px-3 rounded-lg text-sm text-white text-center outline-none transition-all duration-200 flex-shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(42,42,42,0.7)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  MozAppearance: 'textfield',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.07)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(42,42,42,0.7)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />

              {/* Unit select */}
              <Select value={unit} onValueChange={handleUnitChange}>
                <SelectTrigger
                  className="flex-1 h-10 text-sm border-0 focus:ring-0 focus:ring-offset-0"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(42,42,42,0.7)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    fontSize: '12px',
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="border-[#2A2A2A] text-white"
                  style={{ background: '#141414' }}
                >
                  {DURATION_UNITS.map((u) => (
                    <SelectItem
                      key={u.value}
                      value={u.value}
                      className="text-white focus:bg-[#1F1F1F] focus:text-white cursor-pointer"
                      style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '12px' }}
                    >
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Summary line */}
            <p
              className="text-xs mt-2.5 flex items-center gap-1.5"
              style={{ color: 'rgba(113,113,122,0.55)', fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <circle cx="5.5" cy="5.5" r="4.5" stroke="rgba(113,113,122,0.5)" strokeWidth="1" />
                <path d="M5.5 3.5v2.5l1.5 1" stroke="rgba(113,113,122,0.5)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Link expires after{' '}
              <span style={{ color: 'rgba(249,115,22,0.7)' }}>{duration} {unit}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 pb-6"
          style={{ borderTop: '1px solid rgba(42,42,42,0.5)', paddingTop: '20px' }}
        >
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              background: '#F97316',
              boxShadow: isGenerating ? 'none' : '0 4px 20px rgba(249,115,22,0.25)',
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                const el = e.currentTarget
                el.style.background = '#EA6C0A'
                el.style.boxShadow = '0 6px 28px rgba(249,115,22,0.35)'
                el.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isGenerating) {
                const el = e.currentTarget
                el.style.background = '#F97316'
                el.style.boxShadow = '0 4px 20px rgba(249,115,22,0.25)'
                el.style.transform = 'translateY(0)'
              }
            }}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Generating…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5v7M4 6l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 10.5A1.5 1.5 0 0 0 3.5 12h7a1.5 1.5 0 0 0 1.5-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Generate Share Link
              </span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
