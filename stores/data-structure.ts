import { RustType } from '@/types/rust-type'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'

export type FieldType = {
  id: string
  value: string
  fieldType: RustType
}

export type AccountType = 'native' | 'custom' | 'signer'

export type DataStructureType = {
  id: string
  type: string
  accountName: string
  accountType: AccountType
  data: { id: string }
  position: { x: number; y: number }
  fields: FieldType[]
}

interface DataStructureState {
  dataStructure: DataStructureType[] | undefined
  addDataStructure: (dataStructure: DataStructureType) => void
  removeDataStructure: (id: string) => void

  addNewField: (nodeId: string, field: FieldType) => void
  changeFieldType: (nodeId: string, fieldId: string, fieldType: RustType) => void
  changeFieldName: (nodeId: string, fieldId: string, fieldName: string) => void
  changeAccountName: (nodeId: string, accountName: string) => void
  removeField: (nodeId: string, fieldId: string) => void
}

export const useDataStructureStore = create<DataStructureState>()((set) => ({
  dataStructure: undefined,
  addDataStructure: (dataStructure: DataStructureType) =>
    set((state) => ({
      dataStructure: state.dataStructure ? [...state.dataStructure, dataStructure] : [dataStructure],
    })),

  removeDataStructure: (id: string) =>
    set((state) => ({
      dataStructure: state.dataStructure ? state.dataStructure.filter((node) => node.id !== id) : [],
    })),

  addNewField: (nodeId: string, field: FieldType) =>
    set((state) => ({
      dataStructure: state.dataStructure?.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            fields: [...node.fields, field],
          }
        }
        return node
      }),
    })),
  changeFieldType: (nodeId: string, fieldId: string, fieldType: RustType) =>
    set((state) => ({
      dataStructure: state.dataStructure?.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            fields: node.fields.map((field) => {
              if (field.id === fieldId) {
                return {
                  ...field,
                  fieldType,
                }
              }
              return field
            }),
          }
        }
        return node
      }),
    })),

  changeFieldName: (nodeId: string, fieldId: string, fieldName: string) =>
    set((state) => ({
      dataStructure: state.dataStructure?.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            fields: node.fields.map((field) => {
              if (field.id === fieldId) {
                return {
                  ...field,
                  value: fieldName,
                }
              }
              return field
            }),
          }
        }
        return node
      }),
    })),
  changeAccountName: (nodeId: string, accountName: string) =>
    set((state) => ({
      dataStructure: state.dataStructure?.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            accountName,
          }
        }
        return node
      }),
    })),

  removeField: (nodeId: string, fieldId: string) =>
    set((state) => ({
      dataStructure: state.dataStructure?.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            fields: node.fields.filter((field) => field.id !== fieldId),
          }
        }
        return node
      }),
    })),
}))
