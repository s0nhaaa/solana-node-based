import { create } from 'zustand'

export type ModalContentType = {
  title: string
  description: string
  id: string
}

export type AccountConfig = {
  init: boolean
  mut: boolean
  has_one: boolean | string
}

export type Seed = {
  id: string
  type: 'string' | 'account'
  value: string | undefined
  accountField?: string
}

export type AccountContext = AccountConfig & {
  id: string
  seeds: Seed[] | undefined
}

export type Context = {
  id: string
  type: string
  data: { label: string }
  position: { x: number; y: number }
  accounts: AccountContext[] | undefined
}

interface ContextState {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  modalContent: ModalContentType
  setModalContent: (modalContent: ModalContentType) => void

  accountInvoledIds: string[]
  addAccountInvoledId: (accountInvoledId: string) => void
  removeAccountInvoledId: (accountInvoledId: string) => void

  currentContextConfig: string
  setCurrentContextConfig: (config: string) => void

  accountContext: AccountContext[] | undefined
  setAccountContext: (accountContext: AccountContext) => void

  contexts: Context[] | undefined
  setContexts: (contexts: Context) => void

  updateContextByAccountContextId: (contextId: string, accountId: string, account: AccountContext) => void
}

export const useContextStore = create<ContextState>()((set) => ({
  openModal: false,
  setOpenModal: (openModal: boolean) => set(() => ({ openModal })),
  modalContent: {
    title: '',
    description: '',
    id: '',
  },
  setModalContent: (modalContent: ModalContentType) => set(() => ({ modalContent })),

  accountInvoledIds: [],
  addAccountInvoledId: (accountInvoledId: string) =>
    set((state) => ({
      accountInvoledIds: state.accountInvoledIds ? [...state.accountInvoledIds, accountInvoledId] : [accountInvoledId],
    })),
  removeAccountInvoledId: (accountInvoledId: string) =>
    set((state) => ({
      accountInvoledIds: state.accountInvoledIds.filter((id) => id !== accountInvoledId),
    })),

  currentContextConfig: '',
  setCurrentContextConfig: (currentContextConfig: string) => set(() => ({ currentContextConfig })),

  accountContext: undefined,
  setAccountContext: (accountContext: AccountContext) =>
    set((state) => ({
      accountContext: state.accountContext ? [...state.accountContext, accountContext] : [accountContext],
    })),

  contexts: [],
  setContexts: (contexts: Context) =>
    set((state) => ({ contexts: state.contexts ? [...state.contexts, contexts] : [contexts] })),

  updateContextByAccountContextId: (contextId: string, accountId: string, account: AccountContext) =>
    set((state) => ({
      contexts: state.contexts?.map((context) => {
        if (context.id === contextId) {
          if (context.accounts?.find((accountContext) => accountContext.id === accountId)) {
            return {
              ...context,
              accounts: context.accounts?.map((accountContext) => {
                if (accountContext.id === accountId) {
                  return account
                }
                return accountContext
              }),
            }
          } else {
            return {
              ...context,
              accounts: context.accounts ? [...context.accounts, account] : [account],
            }
          }
        }
        return context
      }),
    })),
}))
