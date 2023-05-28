import { v4 as uuidv4 } from 'uuid'
import { ChevronDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

type NodeData = {
  label: string
  onNewInstruction: () => void
}

type RustType =
  | 'pubkey'
  | 'u8/i8'
  | 'u16/i16'
  | 'u32/i32'
  | 'u64'
  | 'u128'
  | 'string'
  | 'bool'
  | 'u64/i64'
  | 'u128/i128'

type FieldType = {
  id: string
  value: string
  fieldType: RustType
}

export default function DataStructureNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [accountName, setAccountName] = useState('Account')
  const [fields, setFields] = useState<FieldType[]>([
    {
      id: uuidv4(),
      value: 'count',
      fieldType: 'string',
    },
  ])

  const onTypeSelected = (fieldId: string, type: RustType) => {
    // update fields type
    setFields(
      fields?.map((field) => {
        if (field.id === fieldId) {
          return {
            ...field,
            fieldType: type,
          }
        }
        return field
      }),
    )
  }

  const onFieldNameChange = (fieldId: string, fieldName: string) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          return {
            ...field,
            value: fieldName,
          }
        }
        return field
      }),
    )
  }

  return (
    <div className='card w-fit bg-base-200 shadow-xl'>
      <div className='card-body text-center'>
        <div className='card-title'>
          <input
            type='text'
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder='Account name'
            className='input input-bordered w-full max-w-xs border-none p-0 outline-none focus:outline-none bg-base-200'
          />
        </div>
        <p className='text-neutral-content'>
          All the things goes below <kbd className='kbd'>#[account]</kbd>
        </p>
        <div className='flex flex-col gap-2'>
          {fields.length > 0 &&
            fields.map((field, index) => (
              <div className='form-control' key={index}>
                <label className='label'>
                  <span className='label-text'>
                    <div className='badge badge-primary'>{field.fieldType}</div>
                  </span>
                </label>
                <label className='input-group'>
                  <input
                    type='text'
                    placeholder='Field name'
                    value={field.value}
                    onChange={(e) => onFieldNameChange(field.id, e.target.value)}
                    className='input input-bordered'
                  />
                  <div className='dropdown'>
                    <label tabIndex={0} className='btn btn-square'>
                      <ChevronDown size={20} />
                    </label>
                    <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52'>
                      <li onClick={() => onTypeSelected(field.id, 'bool')}>
                        <a>bool</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u8/i8')}>
                        <a>u8/i8</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u16/i16')}>
                        <a>u16/i16</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u32/i32')}>
                        <a>u32/i32</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u64/i64')}>
                        <a>u64/i64</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u128/i128')}>
                        <a>u128/i128</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'pubkey')}>
                        <a>pubkey</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'string')}>
                        <a>string</a>
                      </li>
                    </ul>
                  </div>
                </label>
              </div>
            ))}
        </div>

        <div className='card-actions flex flex-col justify-center items-center mt-2'>
          <button
            className='btn btn-square btn-sm btn-secondary'
            onClick={() => setFields([...(fields || []), { id: uuidv4(), value: 'name', fieldType: 'pubkey' }])}>
            <Plus size={12} />
          </button>
        </div>
      </div>

      <Handle
        type='source'
        position={Position.Right}
        id='1'
        style={{ width: 15, height: 15 }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
