import { useInstructionStore } from '@/stores/instruction'
import { Fragment, useEffect } from 'react'
import { Handle, NodeProps, Position, Node } from 'reactflow'

type NodeData = {
  label: string
  nodes: Node<any, string | undefined>
}

export default function ProgramNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [instruction, addInstruction] = useInstructionStore((state) => [state.instruction, state.addInstruction])

  useEffect(() => {
    console.log('instruction added changed')
  }, [instruction])

  return (
    <div className='card w-60 bg-info shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title'>{data.label}</h2>
        {instruction.length > 0 && (
          <>
            <p>Instructions: </p>
            {instruction.map((ix, index) => (
              <Fragment key={ix.id}>
                <button className='btn no-animation'>{ix.id}</button>
              </Fragment>
            ))}
          </>
        )}
      </div>

      <Handle
        type='target'
        position={Position.Bottom}
        style={{ width: 15, height: 15 }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </div>
  )
}
