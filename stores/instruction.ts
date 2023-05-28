import { create } from 'zustand'

const initialInstruction = [
  {
    id: 'instruction-node-1',
    type: 'instructionNode',
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
