import { atom, selector } from 'recoil'

export const contractAddr = '0xb94fb1122b86d64c034992fd3e6acbf4472d335d'
export const totalSupply = 70
export const price = 0.1
export const mintedNumState = atom<number|undefined>({
  key: 'mintedNum',
  default: undefined,
})

export const isSoldOutState = selector({
  key: 'isSoldOutSelector',
  get: ({ get }) => {
    const mintedNum = get(mintedNumState)
    return mintedNum !== undefined && mintedNum >= totalSupply
  }
})
