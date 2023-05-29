'use client'

import { AccountConfig, Context, Seed, useContextStore } from '@/stores/context'
import { useDataStructureStore } from '@/stores/data-structure'
import { Plus, X } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function AccountConfigModal() {
  const [
    currentContextConfig,
    openModal,
    modalContent,
    accountInvoledIds,
    accountContext,
    contexts,
    setContexts,
    setOpenModal,
    setAccountContext,
    updateContextByAccountContextId,
  ] = useContextStore((state) => [
    state.currentContextConfig,
    state.openModal,
    state.modalContent,
    state.accountInvoledIds,
    state.accountContext,
    state.contexts,
    state.setContexts,
    state.setOpenModal,
    state.setAccountContext,
    state.updateContextByAccountContextId,
  ])
  const [dataStructure] = useDataStructureStore((state) => [state.dataStructure])
  const [isSeed, setIsSeed] = useState(false)
  const [config, setConfig] = useState<AccountConfig>({
    init: false,
    mut: false,
    has_one: false,
  })
  const [newSeed, setNewSeed] = useState(false)
  const [newAccountSeed, setNewAccountSeed] = useState(false)
  const [seeds, setSeeds] = useState<Seed[]>()

  const accountsInvoled = useMemo(
    () => dataStructure?.filter((ds) => accountInvoledIds?.includes(ds.id)),
    [dataStructure, accountInvoledIds],
  )

  useEffect(() => {
    if (currentContextConfig && modalContent.id) {
      const currentContext = contexts?.find((ac) => ac.id === currentContextConfig)

      const currentAccount = currentContext?.accounts?.find((ac) => ac.id === modalContent.id)
      if (currentAccount) {
        setConfig({
          init: currentAccount.init,
          mut: currentAccount.mut,
          has_one: currentAccount.has_one,
        })

        if (currentAccount.seeds) {
          setSeeds(currentAccount.seeds)
          setIsSeed(true)
        }
      }
    }

    return () => {
      setConfig({
        init: false,
        mut: false,
        has_one: false,
      })
      setSeeds(undefined)
      setIsSeed(false)
    }
  }, [accountContext, contexts, currentContextConfig, modalContent.id])

  const addStringSeed = () => {
    const stringSeeds: Seed = { id: uuidv4(), value: 'SEED', type: 'string' }
    setSeeds((s) => (s ? [...s, stringSeeds] : [stringSeeds]))
    setNewSeed(false)
  }

  const updateStringSeedValue = (id: string, value: string) => {
    const stringSeeds = seeds?.map((s) => {
      if (s.id === id && s.type === 'string') {
        return {
          ...s,
          value: value,
        }
      }
      return s
    })
    setSeeds(stringSeeds)
  }

  const removeSeed = (id: string) => {
    const seed = seeds?.filter((s) => s.id !== id)
    setSeeds(seed)
  }

  const addAccountSeed = (id: string) => {
    const accountSeeds: Seed = {
      id: uuidv4(),
      value: id,
      type: 'account',
      accountField: '',
    }

    setNewAccountSeed(false)
    setSeeds((s) => (s ? [...s, accountSeeds] : [accountSeeds]))
  }

  const updateAccoutSeed = (id: string, accountField: string) => {
    const accountSeeds = seeds?.map((s) => {
      if (s.id === id && s.type === 'account') {
        return {
          ...s,
          accountField: accountField,
        }
      }
      return s
    })
    setSeeds(accountSeeds)
  }

  const openAccountInvolvedList = () => {
    setNewAccountSeed(true)
    setNewSeed(false)
  }

  const updateAccountContext = () => {
    console.log(modalContent.id)
    console.log({
      id: modalContent.id,
      init: config.init,
      mut: config.mut,
      has_one: config.has_one,
      seeds,
    })
    updateContextByAccountContextId(currentContextConfig, modalContent.id, {
      id: modalContent.id,
      init: config.init,
      mut: config.mut,
      has_one: config.has_one,
      seeds,
    })
    setOpenModal(false)
  }

  return (
    <div className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className='modal-box '>
        <h3 className='font-bold text-lg'>{modalContent.title}</h3>
        <p className='py-4'>{modalContent.description}</p>

        <div className='mt-2'>
          <div className='flex w-full gap-2'>
            <button
              className={`btn ${config.init ? 'btn-primary' : ''}`}
              onClick={() => setConfig({ ...config, init: !config.init })}>
              Initilize
            </button>
            <button
              className={`btn ${config.mut ? 'btn-secondary' : ''}`}
              onClick={() => setConfig({ ...config, mut: !config.mut })}>
              Mutable
            </button>
            <button className={`btn ${isSeed ? 'btn-accent' : ''}`} onClick={() => setIsSeed(!isSeed)}>
              Seeds
            </button>
          </div>

          {isSeed && (
            <div className='p-3 mt-4 rounded-lg bg-base-300'>
              <p className='label-text text-base text-accent-content'>Define your seeds</p>

              {seeds &&
                seeds.map((seed) => (
                  <Fragment key={seed.id}>
                    {seed.type === 'string' && (
                      <div key={seed.id} className='flex flex-col w-full mb-2'>
                        <label className='label'>
                          <span className='label-text-alt'>String</span>
                        </label>

                        <div className='flex w-full gap-1 items-center '>
                          <input
                            type='text'
                            defaultValue={seed.value as string}
                            onBlur={(e) => updateStringSeedValue(seed.id, e.target.value)}
                            placeholder='Type here'
                            className='input input-bordered w-full '
                          />
                          <button className='btn btn-square btn-sm' onClick={() => removeSeed(seed.id)}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                    {seed.type === 'account' && (
                      <div className='flex flex-col w-full justify-between' key={seed.id}>
                        <label className='label'>
                          <span className='label-text'>
                            {dataStructure.find((ds) => ds.id === seed.value)?.accountName}
                          </span>
                        </label>
                        <div className='flex gap-2 w-full items-center'>
                          <span className='ml-2'>Field</span>
                          <div className='flex gap-1 w-full '>
                            {dataStructure
                              .find((ds) => ds.id === seed.value)
                              ?.fields.map((field) => (
                                <button
                                  key={field.id}
                                  className={`btn btn-sm normal-case ${
                                    field.value === seed.accountField ? 'btn-primary' : ''
                                  }`}
                                  onClick={() => updateAccoutSeed(seed.id, field.value)}>
                                  {field.value}
                                </button>
                              ))}
                          </div>
                          <button className='btn btn-square btn-sm' onClick={() => removeSeed(seed.id)}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </Fragment>
                ))}

              {newAccountSeed && (
                <div className='flex items-center gap-2'>
                  <div className='w-full flex gap-2 flex-wrap my-4'>
                    {accountsInvoled.map((account) => (
                      <button key={account.id} className='btn btn-primary' onClick={() => addAccountSeed(account.id)}>
                        {account.accountName}
                      </button>
                    ))}
                  </div>
                  <button className='btn btn-square btn-sm' onClick={() => setNewAccountSeed(false)}>
                    <X size={16} />
                  </button>
                </div>
              )}

              {newSeed && (
                <div className='w-full my-4 flex gap-2 justify-center'>
                  <button className='btn btn-primary' onClick={addStringSeed}>
                    From String
                  </button>

                  <div className='tooltip' data-tip='No account' onClick={openAccountInvolvedList}>
                    <button className='btn'>From Account</button>
                  </div>
                </div>
              )}

              <div className='w-full flex items-center justify-center mt-4'>
                <div className='tooltip' data-tip='Add more'>
                  <button className='btn btn-square btn-sm btn-warning' onClick={() => setNewSeed(true)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='modal-action'>
          <button className='btn btn-ghost' onClick={() => setOpenModal(false)}>
            Cancel
          </button>
          <button className='btn btn-primary' onClick={() => updateAccountContext()}>
            Update
          </button>
        </div>
      </div>
    </div>
  )
}
