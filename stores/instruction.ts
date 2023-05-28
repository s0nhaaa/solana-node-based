import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const initialInstruction = [
  {
    id: 'data-structure-node-1',
    type: 'dataStructureNode',
    data: { label: 'Output A' },
    position: { x: 650, y: 25 },
  },
]

type InstructionNodeType = (typeof initialInstruction)[0]

interface NodeState {
  instruction: InstructionNodeType[]
  addInstruction: (instruction: InstructionNodeType) => void
  removeInstruction: (id: string) => void
}

export const useInstructionStore = create<NodeState>()((set) => ({
  instruction: initialInstruction,
  addInstruction: (instruction: InstructionNodeType) =>
    set((state) => ({ instruction: [...state.instruction, instruction] })),
  removeInstruction: (id: string) =>
    set((state) => ({ instruction: state.instruction.filter((node) => node.id !== id) })),
}))
