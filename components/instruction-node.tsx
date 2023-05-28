import { useInstructionStore } from '@/stores/instruction'
import { Fragment, useEffect, useState } from 'react'
import { Handle, NodeProps, Position, Node, Connection } from 'reactflow'

type NodeData = {
  label: string
  nodes: Node<any, string | undefined>
}

export default function InstructionNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [instructionName, setInstructionName] = useState('init')

  const onDataAccountNodeConnect = (dataAccountNode: Connection) => {
    console.log('handle onConnect', dataAccountNode)
  }

  return (
    <div className='card w-60 bg-base-300 shadow-xl'>
      <div className='card-body'>
        <div className='card-title'>
          <input
            type='text'
            value={instructionName}
            onChange={(e) => setInstructionName(e.target.value)}
            placeholder='Instruction name'
            className='input input-bordered w-full max-w-xs border-none p-0 outline-none focus:outline-none bg-base-300'
          />
        </div>
      </div>

      <Handle
        type='target'
        position={Position.Left}
        style={{ width: 20, height: 20 }}
        onConnect={onDataAccountNodeConnect}
        isConnectable={isConnectable}
      />
    </div>
  )
}
