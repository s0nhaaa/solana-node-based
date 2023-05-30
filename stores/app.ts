import { create } from 'zustand'

interface AppState {
  openGenerateCodeModal: boolean
  setOpenGenerateCodeModal: (isGenerateCode: boolean) => void
}

export const useAppStore = create<AppState>()((set) => ({
  openGenerateCodeModal: false,
  setOpenGenerateCodeModal: (openGenerateCodeModal) => set(() => ({ openGenerateCodeModal })),
}))
