import { atom } from 'recoil'

export const selectedItemState = atom<number | null>({
  key: 'selected-item',
  default: null
})
