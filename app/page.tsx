'use client'

import AccountConfigModal from '@/components/account-config-modal'
import ContextNode from '@/components/context-node'
import DataStructureNode from '@/components/data-structure-node'
import InstructionNode from '@/components/instruction-node'
import ProgramNode from '@/components/program-node'
import { Context, useContextStore } from '@/stores/context'
import { useDataStructureStore } from '@/stores/data-structure'
import { useInstructionStore } from '@/stores/instruction'
import { useCallback, useEffect, useState } from 'react'
import ReactFlow, { Background, Controls, OnNodesDelete, addEdge, useEdgesState, useNodesState } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

const connectionLineStyle = { stroke: '#fff' }
const nodeTypes = {
  selectorNode: ProgramNode,
  dataStructureNode: DataStructureNode,
  contextNode: ContextNode,
  instructionNode: InstructionNode,
}

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [openModal, modalContent, setOpenModal, setContexts] = useContextStore((state) => [
    state.openModal,
    state.modalContent,
    state.setOpenModal,
    state.setContexts,
  ])

  const [instruction, addInstruction, removeInstruction] = useInstructionStore((state) => [
    state.instruction,
    state.addInstruction,
    state.removeInstruction,
  ])

  const [dataStructure, addDataStructure] = useDataStructureStore((state) => [
    state.dataStructure,
    state.addDataStructure,
  ])

  const [programName, setProgramName] = useState('my-program')

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
    const onChange = (event) => {
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
        type: 'selectorNode',
        data: { onChange: onChange, label: programName, nodes },
        position: { x: 300, y: 50 },
      },
    ])

    setEdges([
      {
        id: 'e2b-4',
        source: '2',
        target: '4',
        sourceHandle: 'b',
        animated: true,
        style: { stroke: '#fff' },
      },
    ])
  }, [])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, eds)),
    [],
  )

  // const newInstruction = () => {
  //   setNodes([
  //     ...nodes,
  //     {
  //       id: `data-structure-node-${nodes.length + 1}`,
  //       type: 'dataStructureNode',
  //       data: { label: 'Output A' },
  //       position: { x: 650, y: 25 },
  //     },
  //   ])
  //   addInstruction({
  //     id: `data-structure-node-${nodes.length + 1}`,
  //     type: 'dataStructureNode',
  //     data: { label: 'Output A' },
  //     position: { x: 650, y: 25 },
  //   })
  // }

  const onNodesDelete = (node) => {
    node && removeInstruction(node[0].id)
  }

  const newDataStructure = () => {
    const randomId = uuidv4()
    setNodes([
      ...nodes,
      {
        id: `data-structure-node-${randomId}`,
        type: 'dataStructureNode',
        data: { id: `data-structure-node-${randomId}` },
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
          fieldType: 'string',
        },
      ],
    })
  }

  const newInstruction = () => {
    const newIx = {
      id: `instruction-node-${nodes.length + 1}`,
      type: 'instructionNode',
      data: { label: 'Output A' },
      position: { x: 60, y: 25 },
    }
    setNodes([...nodes, newIx])
    addInstruction(newIx)

    // newContext()
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
    setContexts({ ...newCtx, accounts: undefined })
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
            <button className='btn' onClick={newInstruction}>
              New Instruction
            </button>
            <button className='btn' onClick={newContext}>
              New Context
            </button>
            <button className='btn' onClick={newContext}>
              New System Account
            </button>
            <button className='btn' onClick={newContext}>
              New Signer
            </button>
          </div>
          <div className='flex flex-col'>
            <button className='btn btn-primary'>Generate</button>
          </div>
        </div>
        <div className='col-span-5'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesDelete={onNodesDelete}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionLineStyle={connectionLineStyle}>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <AccountConfigModal />
    </main>
  )
}
