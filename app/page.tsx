'use client'

import AccountConfigModal from '@/components/account-config-modal'
import ContextNode from '@/components/context-node'
import DataStructureNode from '@/components/data-structure-node'
import GenerateCodeModal from '@/components/generate-code-modal'
import InstructionNode from '@/components/instruction-node'
import ProgramNode from '@/components/program-node'
import { useAppStore } from '@/stores/app'
import { useContextStore } from '@/stores/context'
import { useDataStructureStore } from '@/stores/data-structure'
import { useInstructionStore } from '@/stores/instruction'
import { useProgramStore } from '@/stores/program'
import { useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

const connectionLineStyle = { stroke: '#fff' }
const nodeTypes = {
  programNode: ProgramNode,
  dataStructureNode: DataStructureNode,
  contextNode: ContextNode,
  instructionNode: InstructionNode,
}

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [openModal, modalContent, setOpenModal, setContexts, removeContext] = useContextStore((state) => [
    state.openModal,
    state.modalContent,
    state.setOpenModal,
    state.setContexts,
    state.removeContext,
  ])

  const [instructions, addInstruction, removeInstruction] = useInstructionStore((state) => [
    state.instructions,
    state.addInstruction,
    state.removeInstruction,
  ])

  const [dataStructure, addDataStructure, removeDataStructure] = useDataStructureStore((state) => [
    state.dataStructure,
    state.addDataStructure,
    state.removeDataStructure,
  ])

  const [openGenerateCodeModal, setOpenGenerateCodeModal] = useAppStore((state) => [
    state.openGenerateCodeModal,
    state.setOpenGenerateCodeModal,
  ])

  const [programName, setProgramName] = useProgramStore((state) => [state.programName, state.setProgramName])

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'program-node') {
          node.data = {
            ...node.data,
            label: programName,
          }
        }

        return node
      }),
    )
  }, [programName, setNodes])

  useEffect(() => {
    const onChange = (event: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== '2') {
            return node
          }

          const color = event.target.value

          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          }
        }),
      )
    }

    setNodes([
      {
        id: 'program-node',
        type: 'programNode',
        data: { onChange: onChange, label: programName, nodes },
        position: { x: 300, y: 50 },
      },
    ])
  }, [])

  const onConnect = useCallback(
    (params: Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, eds)),
    [],
  )

  const onNodesDelete = (node: Node[]) => {
    const nodeType = node[0].id.split('-')[0]

    if (nodeType === 'instruction') {
      removeInstruction(node[0].id)
    }

    if (nodeType === 'context') {
      removeContext(node[0].id)
    }

    if (nodeType === 'dataStructure') {
      removeDataStructure(node[0].id)
    }
  }

  const newDataStructure = () => {
    const randomId = uuidv4()
    setNodes([
      ...nodes,
      {
        id: `data-structure-node-${randomId}`,
        type: 'dataStructureNode',
        data: { id: `data-structure-node-${randomId}`, isNative: false, isSigner: false },
        position: { x: -50, y: 25 },
      },
    ])
    addDataStructure({
      id: `data-structure-node-${randomId}`,
      type: 'dataStructureNode',
      data: { id: `data-structure-node-${randomId}` },
      accountName: 'MyAccount',
      position: { x: -50, y: 25 },
      accountType: 'custom',
      fields: [
        {
          id: uuidv4(),
          value: 'count',
          fieldType: 'u8',
        },
      ],
    })
  }

  const newInstruction = () => {
    const randomId = uuidv4()

    const newIx = {
      id: `instruction-node-${randomId}`,
      type: 'instructionNode',
      data: { label: 'Output A', id: `instruction-node-${randomId}` },
      position: { x: 60, y: 25 },
    }
    setNodes([...nodes, newIx])
    const connection: Connection = {
      source: newIx.id,
      target: 'program-node',
      sourceHandle: 'a',
      targetHandle: 'b',
    }
    setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#fff' } }, eds))
    addInstruction({ ...newIx, context: undefined, name: 'init', params: undefined })
  }

  const newContext = () => {
    const randomId = uuidv4()
    const newCtx = {
      id: `context-node-${randomId}`,
      type: 'contextNode',
      data: { label: 'Output A', id: `context-node-${randomId}` },
      position: { x: 50, y: 25 },
    }
    setNodes([...nodes, newCtx])
    setContexts({ ...newCtx, name: 'MyContext', accounts: undefined })
  }

  const newSystemAccount = () => {
    const randomId = uuidv4()
    setNodes([
      ...nodes,
      {
        id: `data-structure-node-${randomId}`,
        type: 'dataStructureNode',
        data: { id: `data-structure-node-${randomId}`, isNative: true, isSigner: false },
        position: { x: -50, y: 25 },
      },
    ])
    addDataStructure({
      id: `data-structure-node-${randomId}`,
      type: 'dataStructureNode',
      data: { id: `data-structure-node-${randomId}` },
      accountName: 'System Program',
      position: { x: -50, y: 25 },
      accountType: 'native',
      fields: [
        {
          id: uuidv4(),
          value: '11111111111111111111111111111111',
          fieldType: 'pubkey',
        },
      ],
    })
  }

  const newSigner = () => {
    const randomId = uuidv4()
    setNodes([
      ...nodes,
      {
        id: `data-structure-node-${randomId}`,
        type: 'dataStructureNode',
        data: { id: `data-structure-node-${randomId}`, isSigner: true, isNative: false },
        position: { x: -50, y: 25 },
      },
    ])
    addDataStructure({
      id: `data-structure-node-${randomId}`,
      type: 'dataStructureNode',
      data: { id: `data-structure-node-${randomId}` },
      accountName: 'Signer',
      position: { x: -50, y: 25 },
      accountType: 'signer',
      fields: [
        {
          id: uuidv4(),
          value: 'key',
          fieldType: 'pubkey',
        },
      ],
    })
  }

  return (
    <main className='w-full h-screen '>
      <div className='w-full p-2 bg-base-300 flex justify-center items-center'>
        <input
          type='text'
          placeholder='Program Name'
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          className='text-center input w-full max-w-xs'
        />
      </div>

      <div className='grid grid-cols-6 bg-base-100 h-[calc(100vh-64px)]'>
        <div className='col-span-1 bg-base-200 flex flex-col p-2 justify-between'>
          <div className='flex flex-col gap-1.5'>
            <button className='btn' onClick={newDataStructure}>
              New Data Structure
            </button>
            <button className='btn' onClick={newContext}>
              New Context
            </button>
            <button className='btn' onClick={newInstruction}>
              New Instruction
            </button>
            <button className='btn' onClick={newSystemAccount}>
              New System Account
            </button>
            <button className='btn' onClick={newSigner}>
              New Signer
            </button>
          </div>
          <div className='flex flex-col'>
            <button className='btn btn-primary' onClick={() => setOpenGenerateCodeModal(true)}>
              Generate
            </button>
          </div>
        </div>
        <div className='col-span-5'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesDelete={onNodesDelete}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            // @ts-ignore
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionLineStyle={connectionLineStyle}>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <AccountConfigModal />
      <GenerateCodeModal />
    </main>
  )
}
