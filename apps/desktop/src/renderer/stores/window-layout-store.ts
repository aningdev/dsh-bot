import type { Layout } from 'react-resizable-panels'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { LOCAL_STORAGE_KEYS } from '@/shared/constants'

interface WindowLayoutState {
  selectedBotId: string | null
  setSelectedBotId: (botId: string) => void
  layout: Layout | null
  setLayout: (layout: Layout) => void
}

export const useWindowLayoutStore = create<WindowLayoutState>()(
  persist(
    (set) => ({
      selectedBotId: null,
      setSelectedBotId: (selectedBotId) => set({ selectedBotId }),
      layout: null,
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: LOCAL_STORAGE_KEYS.WINDOW_LAYOUT,
      version: 1,
      partialize: ({ layout, selectedBotId }) => ({ layout, selectedBotId }),
    },
  ),
)
