export const DURATION_PRESETS = [
  { label: '15 min', duration: 15, unit: 'minutes' as const },
  { label: '1 hour', duration: 1, unit: 'hours' as const },
  { label: '1 day', duration: 1, unit: 'days' as const },
  { label: '1 week', duration: 1, unit: 'weeks' as const },
]

export const DURATION_UNITS = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
] as const

export const FILE_TYPE_FILTERS = [
  { value: 'all', label: 'All Files' },
  { value: 'video', label: 'Videos' },
  { value: 'image', label: 'Images' },
  { value: 'document', label: 'Documents' },
  { value: 'audio', label: 'Audio' },
  { value: 'archive', label: 'Archives' },
  { value: 'code', label: 'Code' },
] as const

export function durationToSeconds(duration: number, unit: 'minutes' | 'hours' | 'days' | 'weeks'): number {
  const multipliers = {
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
  }
  return duration * multipliers[unit]
}
