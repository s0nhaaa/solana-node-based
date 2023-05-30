import { RustType } from '@/types/rust-type'

export const SPACE_REFERENCE: { [key in RustType]: string } = {
  pubkey: '32',
  u8: '1',
  u16: '2',
  u32: '4',
  u64: '8',
  u128: '16',
  string: '4 + 1000',
  bool: '1',
}

export const TYPE_DISPLAY: { [key in RustType]: string } = {
  pubkey: 'Pubkey',
  u8: 'u8',
  u16: 'u16',
  u32: 'u32',
  u64: 'u64',
  u128: 'u128',
  string: 'String',
  bool: 'bool',
}
