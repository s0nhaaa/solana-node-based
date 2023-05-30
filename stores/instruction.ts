import { RustType } from '@/types/rust-type'
import { create } from 'zustand'

export type InstructionParam = {
  id: string
  value: string
  paramType: RustType
}

export type Instruction = {
  id: string
  type: string
  data: any
  position: { x: number; y: number }
  context:
    | {
        id: string
      }
    | undefined
  name: string
  params: InstructionParam[] | undefined
}

interface NodeState {
  instructions: Instruction[] | undefined
  addContextToInstruction: (
    instructionId: string,
    context: {
      id: string
    },
  ) => void
  addInstruction: (instruction: Instruction) => void
  removeInstruction: (instructionId: string) => void

  addParamToInstruction: (instructionId: string, param: InstructionParam) => void
  changeParamType: (instructionId: string, paramId: string, paramType: RustType) => void
  changeParamName: (instructionId: string, paramId: string, name: string) => void
  removeParam: (instructionId: string, paramId: string) => void

  updateInstructionName: (instructionId: string, name: string) => void
}

export const useInstructionStore = create<NodeState>()((set) => ({
  instructions: [],

  addContextToInstruction: (instructionId, context) =>
    set((state) => ({
      instructions: state.instructions?.map((instruction) => {
        if (instruction.id === instructionId) {
          return {
            ...instruction,
            context,
          }
        }
        return instruction
      }),
    })),
  addInstruction: (instruction: Instruction) =>
    set((state) => ({ instructions: state.instructions ? [...state.instructions, instruction] : [instruction] })),
  removeInstruction: (instructionId: string) =>
    set((state) => ({
      instructions: state.instructions?.filter((instruction) => instruction.id !== instructionId),
    })),

  addParamToInstruction: (instructionId, param: InstructionParam) =>
    set((state) => ({
      instructions: state.instructions?.map((instruction) => {
        if (instruction.id === instructionId) {
          return {
            ...instruction,
            params: instruction.params ? [...instruction.params, param] : [param],
          }
        }
        return instruction
      }),
    })),

  changeParamType: (instructionId, paramId, paramType) =>
    set((state) => ({
      instructions: state.instructions?.map((instruction) => {
        if (instruction.id === instructionId) {
          return {
            ...instruction,
            params: instruction.params?.map((param) => {
              if (param.id === paramId) {
                return {
                  ...param,
                  paramType,
                }
              }
              return param
            }),
          }
        }
        return instruction
      }),
    })),

  changeParamName: (instructionId, paramId, name) =>
    set((state) => ({
      instructions: state.instructions?.map((instruction) => {
        if (instruction.id === instructionId) {
          return {
            ...instruction,
            params: instruction.params?.map((param) => {
              if (param.id === paramId) {
                return {
                  ...param,
                  value: name,
                }
              }
              return param
            }),
          }
        }
        return instruction
      }),
    })),

  removeParam: (instructionId, paramId) =>
    set((state) => ({
      instructions: state.instructions?.map((instruction) => {
        if (instruction.id === instructionId) {
          return {
            ...instruction,
            params: instruction.params?.filter((param) => param.id !== paramId),
          }
        }
        return instruction
      }),
    })),

  updateInstructionName: (instructionId, name) =>
    set((state) => ({
      instructions: state.instructions?.map((instruction) => {
        if (instruction.id === instructionId) {
          return {
            ...instruction,
            name,
          }
        }
        return instruction
      }),
    })),
}))
