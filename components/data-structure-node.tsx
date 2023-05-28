import { FieldType, RustType, useDataStructureStore } from '@/stores/data-structure'
import { ChevronDown, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

type NodeData = {
  label: string
  id: string
  onNewInstruction: () => void
}

export default function DataStructureNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [accountName, setAccountName] = useState('Account')
  const [fields, setFields] = useState<FieldType[]>()
  const [dataStructure, addNewField, changeFieldType, changeFieldName, changeAccountName] = useDataStructureStore(
    (state) => [
      state.dataStructure,
      state.addNewField,
      state.changeFieldType,
      state.changeFieldName,
      state.changeAccountName,
    ],
  )

  useEffect(() => {
    if (dataStructure) {
      const dataAccount = dataStructure.find((ds) => ds.id === data.id)
      if (dataAccount && dataAccount.fields && dataAccount.fields.length > 0) setFields(dataAccount.fields)
    }
  }, [dataStructure])

  const onTypeSelected = (fieldId: string, type: RustType) => {
    changeFieldType(data.id, fieldId, type)
  }

  const onFieldNameChange = (fieldId: string, fieldName: string) => {
    changeFieldName(data.id, fieldId, fieldName)
  }

  useEffect(() => {
    console.log(dataStructure)
  }, [dataStructure])

  return (
    <div className='card w-fit bg-base-200 shadow-xl'>
      <div className='card-body text-center'>
        <div className='card-title'>
          <input
            type='text'
            defaultValue={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            onBlur={(e) => changeAccountName(data.id, accountName)}
            placeholder='Account name'
            className='input input-bordered w-full max-w-xs border-none p-0 outline-none focus:outline-none bg-base-200'
          />
        </div>
        <p className='text-neutral-content'>
          All the things goes below <kbd className='kbd'>#[account]</kbd>
        </p>
        <div className='flex flex-col gap-2'>
          {fields &&
            fields.length > 0 &&
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
                    defaultValue={field.value}
                    // onChange={(e) => onFieldNameChange(field.id, e.target.value)}
                    className='input input-bordered'
                    onBlur={(e) => onFieldNameChange(field.id, e.target.value)}
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
            onClick={() => addNewField(data.id, { id: uuidv4(), value: 'name', fieldType: 'pubkey' })}>
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
