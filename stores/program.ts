import { create } from 'zustand'

interface ProgramState {
  programName: string
  setProgramName: (programName: string) => void
}

export const useProgramStore = create<ProgramState>()((set) => ({
  programName: 'my_program',
  setProgramName: (programName) => set(() => ({ programName })),
}))
