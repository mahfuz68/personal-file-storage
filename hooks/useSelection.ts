import { useState, useCallback } from 'react'

export function useSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = useCallback((key: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((keys: string[]) => {
    setSelected(new Set(keys))
  }, [])

  const clear = useCallback(() => {
    setSelected(new Set())
  }, [])

  const isSelected = useCallback((key: string) => {
    return selected.has(key)
  }, [selected])

  return {
    selected,
    toggle,
    selectAll,
    clear,
    isSelected,
    count: selected.size,
    keys: Array.from(selected),
  }
}
