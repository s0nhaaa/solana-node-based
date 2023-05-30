import { useInstructionStore } from '@/stores/instruction'
import { Fragment, useEffect } from 'react'
import { Handle, NodeProps, Position, Node } from 'reactflow'

type NodeData = {
  label: string
  nodes: Node<any, string | undefined>
}

export default function ProgramNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [instructions, addInstruction] = useInstructionStore((state) => [state.instructions, state.addInstruction])

  return (
    <div className='card w-60 bg-info shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title'>{data.label}</h2>
        {instructions && instructions.length > 0 && (
          <>
            <p>Instructions: </p>
            {instructions.map((ix, index) => (
              <Fragment key={ix.id}>
                <button className='btn no-animation normal-case'>{ix.name}</button>
              </Fragment>
            ))}
          </>
        )}
      </div>

      <Handle
        type='target'
        position={Position.Bottom}
        style={{ width: 20, height: 20 }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </div>
  )
}
