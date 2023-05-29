import { create } from 'zustand'

export type ModalContentType = {
  title: string
  description: string
}

interface ContextState {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  modalContent: ModalContentType
  setModalContent: (modalContent: ModalContentType) => void
}

export const useContextStore = create<ContextState>()((set) => ({
  openModal: false,
  setOpenModal: (openModal: boolean) => set(() => ({ openModal })),
  modalContent: {
    title: '',
    description: '',
  },
  setModalContent: (modalContent: ModalContentType) => set(() => ({ modalContent })),
}))
