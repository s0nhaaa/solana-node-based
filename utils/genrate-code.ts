import { AccountContext, Context } from '@/stores/context'
import { DataStructureType } from '@/stores/data-structure'
import { SPACE_REFERENCE, TYPE_DISPLAY } from './constants'
import { Instruction } from '@/stores/instruction'

export const PROGRAM_TEMPLATE = `use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("11111111111111111111111111111111");

#[program]
pub mod {{program_name}} {
    use super::*;
    {{instructions}}
}

{{contexts}}

{{accounts}}
`

export const INSTRUCTION_TEMPLATE = `pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
  ctx.accounts.new_account.data = data;
  msg!("Changed data to: {}!", data); // Message will show up in the tx logs
  Ok(())
}
`

export const CONTEXT_TEMPLATE = `pub struct Initialize<'info> {
  // We must specify the space in order to initialize an account.
  // First 8 bytes are default account discriminator,
  // next 8 bytes come from NewAccount.data being type u64.
  // (u64 = 64 bits unsigned integer = 8 bytes)
  #[account(init, payer = signer, space = 8 + 8)]
  pub new_account: Account<'info, NewAccount>,
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
}`

export const ACCOUNT_TEMPLATE = `pub struct {{name}} {
  {{field}}
}`

export const generateAccounts = (data: DataStructureType[]) => {
  if (!data) return ''

  const generated = data.map((dataStructure) => {
    if (dataStructure.accountType === 'native' || dataStructure.accountType === 'signer') return

    const field = dataStructure.fields.map((field) => {
      return `    pub ${field.value}: ${TYPE_DISPLAY[field.fieldType]},`
    })

    return `#[account]
pub struct ${dataStructure.accountName} {
${field.join('\n')}
}
`
  })

  return generated.join('\n')
}

const genAccount = (account: AccountContext, ds: DataStructureType[]) => {
  const accountContext = ds?.find((d) => d.id === account.id)
  const accountName = accountContext?.accountName
  const accountData = accountContext?.fields

  if (!accountName || !accountData) return

  let macroList = []

  const init = account.init ? 'init' : ''
  Boolean(init) && macroList.push(init)

  const mut = account.mut ? 'mut' : ''
  Boolean(mut) && macroList.push(mut)

  if (account.seeds) {
    const acc = account.seeds.map((s) => {
      if (s.type === 'string') return `b"${s.value}"`
      else
        return `${ds
          ?.find((d) => d.id === s.value)
          ?.accountName.replace(' ', '_')
          .toLowerCase()}.${s.accountField}.${
          ds?.find((d) => d.id === s.value)?.accountType === 'signer' ? 'key()' : 'to_le_bytes()'
        }`
    })
    macroList.push(`seeds = [${acc.join(',')}], bump`)
  }

  if (Boolean(init)) {
    const ref = accountData.map((ad) => {
      return SPACE_REFERENCE[ad.fieldType]
    })

    macroList.push(`space = 8 + ${ref.join(' + ')}`)
  }

  const macro = macroList.length > 0 ? `#[account(${macroList.join(', ')})]\n` : ''

  if (accountContext.accountType === 'native') {
    return `pub ${accountName.replace(' ', '_').toLowerCase()}: Program<'info, System>,\n
    `
  }

  if (accountContext.accountType === 'signer') {
    return `#[account(mut)]
    pub ${accountName.replace(' ', '_').toLowerCase()}: Signer<'info>,\n
    `
  }

  return `${macro}    pub ${accountName.replace(' ', '_').toLowerCase()}: Account<'info, ${accountName}>,\n
    `
}

export const generateContext = (data: Context[], ds: DataStructureType[]) => {
  const generated = data.map((context) => {
    const accountCtx = context.accounts?.map((account) => genAccount(account, ds))

    return `#[derive(Accounts)]
pub struct ${context.name}<'info> {
    ${accountCtx ? accountCtx.join('') : ''}
}`
  })
  return generated.join(' \n\n')
}

export const generateInstruction = (data: Instruction[], ctx: Context[]) => {
  const generated = data.map((instruction) => {
    let params = []

    const contextName = ctx.find((c) => c.id === instruction.context?.id)?.name
    params.push(`ctx: Context<${contextName ? contextName : ''}>`)

    instruction.params?.map((param) => {
      params.push(`${param.value}: ${TYPE_DISPLAY[param.paramType]}`)
    })

    return `pub fn ${instruction.name}(${params.join(', ')}) -> Result<()> {
        Ok(())
    }
`
  })

  return generated.join(' \n\n')
}
