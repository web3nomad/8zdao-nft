import { atom, selector } from 'recoil'

export const walletAddressState = atom({
  key: 'walletAddress',
  default: '',
})

export const walletAddressShortState = selector({
  key: 'walletAddressSelector',
  get: ({ get }) => get(walletAddressState).replace(/^(.{5}).*(.{4})$/, '$1...$2'),
})

export const chaineIDState = atom<number|null>({
  key: 'chaineID',
  default: null
})
