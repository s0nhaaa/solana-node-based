import { useContextStore } from '@/stores/context'
import { useDataStructureStore } from '@/stores/data-structure'
import { useMemo, useState } from 'react'
import { Connection, Handle, Node, NodeProps, Position } from 'reactflow'

type NodeData = {
  id: string
  label: string
  nodes: Node<any, string | undefined>
}

export default function ContextNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [contextName, setContextName] = useState('MyContext')
  const [dataAccountIds, setdataAccountIds] = useState<string[]>()

  const [dataStructure] = useDataStructureStore((state) => [state.dataStructure])
  const [openModal, setOpenModal, setModalContent] = useContextStore((state) => [
    state.openModal,
    state.setOpenModal,
    state.setModalContent,
  ])

  const onDataAccountNodeConnect = (dataAccountNode: Connection) => {
    if (dataAccountIds) {
      setdataAccountIds([...dataAccountIds, dataAccountNode.source!])
    } else setdataAccountIds([dataAccountNode.source!])
  }

  const involvedAccounts = useMemo(
    () => dataStructure?.filter((ds) => dataAccountIds?.includes(ds.id)),
    [dataAccountIds, dataStructure],
  )

  const onOpenModal = (accountName: string) => {
    setOpenModal(true)
    setModalContent({
      title: `Configuration for ${accountName}`,
      description: 'Pick the behaviors you want to do with this account.',
    })
  }

  return (
    <div className='card w-fit bg-base-300 shadow-xl'>
      <div className='card-body'>
        <div className='card-title'>
          <input
            type='text'
            defaultValue={contextName}
            onChange={(e) => setContextName(e.target.value)}
            // onBlur={(e) => changeAccountName(data.id, accountName)}
            placeholder='Account name'
            className='input input-bordered w-full max-w-xs border-none p-0 outline-none focus:outline-none bg-base-300'
          />
        </div>
        <div className='flex flex-col gap-1'>
          {involvedAccounts.length > 0 &&
            involvedAccounts?.map((account) => (
              <div key={account.id} className='flex flex-col bg-base-100 rounded-lg p-2 gap-1 w-56'>
                <div>
                  <div className='badge badge-primary mr-1'>mut</div>
                  <div className='badge badge-secondary mr-1'>init</div>
                  <div className='badge badge-accent mr-1'>accent</div>
                  <div className='badge badge-ghost'>ghost</div>
                </div>
                <button className='btn no-animation normal-case' onClick={() => onOpenModal(account.accountName)}>
                  {account.accountName}
                </button>
              </div>
            ))}
        </div>
      </div>

      <Handle
        type='target'
        id='1'
        position={Position.Left}
        style={{ width: 20, height: 20 }}
        onConnect={onDataAccountNodeConnect}
        isConnectable={isConnectable}
      />

      <Handle
        type='source'
        id='2'
        position={Position.Right}
        style={{ width: 20, height: 20 }}
        onConnect={onDataAccountNodeConnect}
        isConnectable={isConnectable}
      />
    </div>
  )
}
