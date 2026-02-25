import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BucketState {
  isConnected: boolean
  bucketName: string
  currentPath: string
  setPath: (path: string) => void
  connect: (name: string) => void
  disconnect: () => void
}

export const useBucketStore = create<BucketState>()(
  persist(
    (set) => ({
      isConnected: false,
      bucketName: '',
      currentPath: '',
      setPath: (path) => set({ currentPath: path }),
      connect: (name) => set({ isConnected: true, bucketName: name }),
      disconnect: () => set({ isConnected: false, bucketName: '', currentPath: '' }),
    }),
    {
      name: 'bucket-storage',
      skipHydration: true,
    }
  )
)
