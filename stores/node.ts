// import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

// const initialNodes = [
//   {
//     id: '1',
//     data: { label: 'Hello' },
//     position: { x: 0, y: 0 },
//     type: 'input',
//   },

// ]

// interface NodeState {
//   nodes:  Node
//   increase: (by: number) => void
// }

// const useNodeStore = create<NodeState>()(
//   devtools(
//     persist(
//       (set) => ({
//         bears: 0,
//         increase: (by) => set((state) => ({ bears: state.bears + by })),
//       }),
//       {
//         name: 'bear-storage',
//       }
//     )
//   )
// )
