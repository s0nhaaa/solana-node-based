import { useContextStore } from '@/stores/context'
import { useInstructionStore } from '@/stores/instruction'
import { RustType } from '@/types/rust-type'
import { ChevronDown, Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Connection, Handle, Node, NodeProps, Position } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

type NodeData = {
  id: string
  label: string
  nodes: Node<any, string | undefined>
}

export default function InstructionNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [instructionName, setInstructionName] = useState('init')
  const [
    instructions,
    addInstruction,
    addContextToInstruction,
    addParamToInstruction,
    changeParamType,
    changeParamName,
    removeParam,
    updateInstructionName,
  ] = useInstructionStore((state) => [
    state.instructions,
    state.addInstruction,
    state.addContextToInstruction,
    state.addParamToInstruction,
    state.changeParamType,
    state.changeParamName,
    state.removeParam,
    state.updateInstructionName,
  ])

  const [contexts] = useContextStore((state) => [state.contexts])
  const onDataAccountNodeConnect = (dataAccountNode: Connection) => {
    const ctx = contexts?.find((ctx) => ctx.id === dataAccountNode.source!)
    if (!ctx) return

    addContextToInstruction(data.id, {
      id: ctx.id,
    })
  }

  const context = useMemo(
    () => instructions?.find((instruction) => instruction.id === data.id)?.context,
    [instructions, data.id],
  )

  const instructionParams = useMemo(
    () => instructions?.find((instruction) => instruction.id === data.id)?.params || [],
    [data.id, instructions],
  )

  const onTypeSelected = (paramId: string, type: RustType) => {
    changeParamType(data.id, paramId, type)
  }

  const onParamNameChange = (paramId: string, name: string) => {
    changeParamName(data.id, paramId, name)
  }

  return (
    <div className='card bg-base-300 shadow-xl'>
      <div className='card-body'>
        <div className='card-title'>
          <input
            type='text'
            value={instructionName}
            onChange={(e) => setInstructionName(e.target.value)}
            onBlur={(e) => updateInstructionName(data.id, e.target.value)}
            placeholder='Instruction name'
            className='input input-bordered w-full max-w-xs border-none p-0 outline-none focus:outline-none bg-base-300'
          />
        </div>

        <span className='text-neutral-content'>
          Define your <kbd className='kbd'>Instruction</kbd>, params <br /> and connect to the context
        </span>
        <p className=''>Params</p>
        <div className='w-full flex flex-col p-2 bg-base-100 rounded-lg'>
          <div className='flex flex-col gap-2 justify-center'>
            {instructionParams.length > 0 &&
              instructionParams.map((param, index) => (
                <div className='form-control' key={index}>
                  <label className='label'>
                    <span className='label-text'>
                      <div className='badge badge-primary'>{param.paramType}</div>
                    </span>
                  </label>
                  <label className='input-group items-center justify-center'>
                    <input
                      type='text'
                      placeholder='Param name'
                      className='input input-bordered'
                      value={param.value}
                      onChange={(e) => onParamNameChange(param.id, e.target.value)}
                    />
                    <div className='dropdown'>
                      <label tabIndex={0} className='btn btn-square'>
                        <ChevronDown size={20} />
                      </label>
                      <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52'>
                        <li onClick={() => onTypeSelected(param.id, 'bool')}>
                          <a>bool</a>
                        </li>
                        <li onClick={() => onTypeSelected(param.id, 'u8')}>
                          <a>u8</a>
                        </li>
                        <li onClick={() => onTypeSelected(param.id, 'u16')}>
                          <a>u16</a>
                        </li>
                        <li onClick={() => onTypeSelected(param.id, 'u32')}>
                          <a>u32</a>
                        </li>
                        <li onClick={() => onTypeSelected(param.id, 'u64')}>
                          <a>u64</a>
                        </li>
                        <li onClick={() => onTypeSelected(param.id, 'u128')}>
                          <a>u128</a>
                        </li>
                        <li onClick={() => onTypeSelected(param.id, 'pubkey')}>
                          <a>pubkey</a>
                        </li>
                        <li onClick={() => onTypeSelected(param.id, 'string')}>
                          <a>string</a>
                        </li>
                      </ul>
                    </div>
                    <div className='ml-2'>
                      <button className='btn btn-square btn-sm' onClick={() => removeParam(data.id, param.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  </label>
                </div>
              ))}
          </div>
          <div className='flex w-full justify-center mt-2'>
            <button
              className='btn btn-square btn-sm btn-secondary'
              onClick={() => addParamToInstruction(data.id, { id: uuidv4(), value: 'name', paramType: 'pubkey' })}>
              <Plus size={12} />
            </button>
          </div>
        </div>
        {context && (
          <div className='w-full flex-col flex p-2 bg-base-100 rounded-lg'>
            <button className='btn no-animation normal-case'>
              {contexts?.find((ctx) => ctx.id === context.id)?.name}
            </button>
          </div>
        )}
      </div>

      <Handle
        type='target'
        position={Position.Left}
        style={{ width: 20, height: 20 }}
        onConnect={onDataAccountNodeConnect}
        isConnectable={isConnectable}
      />

      <Handle
        type='source'
        position={Position.Right}
        id='1'
        style={{ width: 15, height: 15, background: 'orange' }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
