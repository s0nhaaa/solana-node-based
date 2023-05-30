import { AccountContext, useContextStore } from '@/stores/context'
import { useDataStructureStore } from '@/stores/data-structure'
import { useEffect, useMemo, useState } from 'react'
import { Connection, Handle, Node, NodeProps, Position } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'

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
  const [context, setContexts, updateContextByAccountContextId] = useContextStore((state) => [
    state.contexts,
    state.setContexts,
    state.updateContextByAccountContextId,
  ])
  const currentContext = useMemo(() => contexts?.find((c) => c.id === data.id), [contexts, data.id])

  const onDataAccountNodeConnect = (dataAccountNode: Connection) => {
    if (dataAccountIds) {
      setdataAccountIds([...dataAccountIds, dataAccountNode.source!])
    } else {
      setdataAccountIds([dataAccountNode.source!])
    }
    const account: AccountContext = {
      id: dataAccountNode.source!,
      seeds: undefined,
      init: false,
      mut: false,
      has_one: false,
    }
    updateContextByAccountContextId(data.id, dataAccountNode.source!, account)
    // addAccountInvoledId(dataAccountNode.source!)
  }

  // const accountName = useMemo(() => dataStructure?.find((ds) => ds.id === account.id)?.accountName!, [

  // ])

  // const involvedAccounts = useMemo(
  //   () => dataStructure?.filter((ds) => dataAccountIds?.includes(ds.id)),
  //   [dataAccountIds, dataStructure],
  // )

  const involvedAccounts = useMemo(() => {
    const currentContext = contexts?.find((c) => c.id === data.id)
    return currentContext?.accounts
  }, [contexts, data.id])

  const onOpenModal = (accountId: string) => {
    const accountName = dataStructure?.find((ds) => ds.id === accountId)?.accountName
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
            involvedAccounts &&
            involvedAccounts.length > 0 &&
            involvedAccounts?.map((account) => (
              <div key={account.id} className='flex flex-col bg-base-100 rounded-lg p-2 gap-1 w-56'>
                <div>
                  {account?.init && <div className='badge badge-primary mx-1'>init</div>}
                  {account?.mut && <div className='badge badge-secondary mx-1'>mut</div>}
                  {account?.seeds && <div className='badge badge-accent mx-1'>seeds</div>}
                </div>
                <button className='btn no-animation normal-case' onClick={() => onOpenModal(account.id)}>
                  {dataStructure?.find((ds) => ds.id === account.id)?.accountName}
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
