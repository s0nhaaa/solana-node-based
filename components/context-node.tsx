import { useInstructionStore } from '@/stores/instruction'
import { Fragment, useEffect } from 'react'
import { Handle, Node, NodeProps, Position } from 'reactflow'

type NodeData = {
  label: string
  nodes: Node<any, string | undefined>
}

export default function ContextNode({ data, isConnectable }: NodeProps<NodeData>) {
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
                <Handle
                  type='target'
                  position={Position.Left}
                  style={{ width: 10, height: 10, top: 120 + 30 * index }}
                  onConnect={(params) => console.log('handle onConnect', params)}
                  isConnectable={isConnectable}
                />
              </Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
