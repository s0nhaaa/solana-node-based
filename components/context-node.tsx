import { useContextStore } from '@/stores/context'
import { useDataStructureStore } from '@/stores/data-structure'
import { useEffect, useMemo, useState } from 'react'
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
  const [contexts, openModal, setOpenModal, setModalContent, addAccountInvoledId, setCurrentContextConfig] =
    useContextStore((state) => [
      state.contexts,
      state.openModal,
      state.setOpenModal,
      state.setModalContent,
      state.addAccountInvoledId,
      state.setCurrentContextConfig,
    ])

  const currentContext = useMemo(() => contexts?.find((c) => c.id === data.id), [contexts, data.id])

  const onDataAccountNodeConnect = (dataAccountNode: Connection) => {
    if (dataAccountIds) {
      setdataAccountIds([...dataAccountIds, dataAccountNode.source!])
    } else {
      setdataAccountIds([dataAccountNode.source!])
    }
    addAccountInvoledId(dataAccountNode.source!)
  }

  const involvedAccounts = useMemo(
    () => dataStructure?.filter((ds) => dataAccountIds?.includes(ds.id)),
    [dataAccountIds, dataStructure],
  )

  const onOpenModal = (accountId: string, accountName: string) => {
    console.log(accountId)
    setOpenModal(true)
    setModalContent({
      title: `Configuration for ${accountName}`,
      description: 'Pick the behaviors you want to do with this account.',
      id: accountId,
    })
    setCurrentContextConfig(data.id)
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
        <div className='flex flex-col gap-2'>
          {currentContext &&
            involvedAccounts.length > 0 &&
            involvedAccounts?.map((account) => (
              <div key={account.id} className='flex flex-col bg-base-100 rounded-lg p-2 gap-1 w-56'>
                <div>
                  {currentContext.accounts?.find((a) => a.id === account.id)?.init && (
                    <div className='badge badge-primary mx-1'>init</div>
                  )}
                  {currentContext.accounts?.find((a) => a.id === account.id)?.mut && (
                    <div className='badge badge-secondary mx-1'>mut</div>
                  )}
                  {currentContext.accounts?.find((a) => a.id === account.id)?.seeds && (
                    <div className='badge badge-accent mx-1'>seeds</div>
                  )}
                </div>
                <button
                  className='btn no-animation normal-case'
                  onClick={() => onOpenModal(account.id, account.accountName)}>
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
