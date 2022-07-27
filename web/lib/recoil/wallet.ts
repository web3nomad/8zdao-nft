import { atom, selector } from 'recoil'

export const walletAddressState = atom({
  key: 'walletAddress',
  default: '',
})

export const chaineIDState = atom<number|null>({
  key: 'chaineID',
  default: null
})
