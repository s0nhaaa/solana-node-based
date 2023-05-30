import { FieldType, useDataStructureStore } from '@/stores/data-structure'
import { RustType } from '@/types/rust-type'
import { TYPE_DISPLAY } from '@/utils/constants'
import { ChevronDown, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

type NodeData = {
  label: string
  isNative: boolean
  isSigner: boolean
  isCustom: boolean
  id: string
  onNewInstruction: () => void
}

export default function DataStructureNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [accountName, setAccountName] = useState(
    data.isNative ? 'System Program' : data.isSigner ? 'Signer' : 'MyAccount',
  )
  const [fields, setFields] = useState<FieldType[]>()
  const [dataStructure, addNewField, changeFieldType, changeFieldName, changeAccountName, removeField] =
    useDataStructureStore((state) => [
      state.dataStructure,
      state.addNewField,
      state.changeFieldType,
      state.changeFieldName,
      state.changeAccountName,
      state.removeField,
    ])

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

  return (
    <div className='card w-fit bg-base-200 shadow-xl'>
      <div className='card-body'>
        <div className='card-title'>
          <input
            type='text'
            defaultValue={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            onBlur={(e) => changeAccountName(data.id, accountName)}
            placeholder='Account name'
            disabled={data.isNative}
            className='input input-bordered w-full max-w-xs border-none p-0 outline-none focus:outline-none bg-base-200'
          />
        </div>
        {!data.isNative ? (
          <p className='text-neutral-content'>
            Define your <kbd className='kbd'>Data</kbd> schema
          </p>
        ) : (
          <p className='text-neutral-content'>
            This is a Solana&apos;s <kbd className='kbd'>Native Account</kbd>
          </p>
        )}
        <div className='flex flex-col gap-2'>
          {fields &&
            fields.length > 0 &&
            fields.map((field, index) => (
              <div className='form-control' key={index}>
                <label className='label'>
                  <span className='label-text'>
                    <div className='badge badge-primary'>{TYPE_DISPLAY[field.fieldType]}</div>
                  </span>
                </label>
                <label className='input-group items-center'>
                  <input
                    type='text'
                    placeholder='Field name'
                    className='input input-bordered'
                    disabled={data.isNative || data.isSigner}
                    value={field.value}
                    onChange={(e) => onFieldNameChange(field.id, e.target.value)}
                  />
                  <div className='dropdown'>
                    {!data.isNative && !data.isSigner && (
                      <label tabIndex={0} className='btn btn-square'>
                        <ChevronDown size={20} />
                      </label>
                    )}
                    <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52'>
                      <li onClick={() => onTypeSelected(field.id, 'bool')}>
                        <a>bool</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u8')}>
                        <a>u8</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u16')}>
                        <a>u16</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u32')}>
                        <a>u32</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u64')}>
                        <a>u64</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'u128')}>
                        <a>u128</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'pubkey')}>
                        <a>pubkey</a>
                      </li>
                      <li onClick={() => onTypeSelected(field.id, 'string')}>
                        <a>string</a>
                      </li>
                    </ul>
                  </div>
                  {!data.isNative && !data.isSigner && (
                    <div className='ml-2'>
                      <button className='btn btn-square btn-sm' onClick={() => removeField(data.id, field.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </label>
              </div>
            ))}
        </div>

        {!data.isNative && !data.isSigner && (
          <div className='card-actions flex flex-col justify-center items-center mt-2'>
            <button
              className='btn btn-square btn-sm btn-secondary'
              onClick={() => addNewField(data.id, { id: uuidv4(), value: 'name', fieldType: 'pubkey' })}>
              <Plus size={12} />
            </button>
          </div>
        )}
      </div>

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
