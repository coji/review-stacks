import { atom } from 'recoil'

export const selectedUserState = atom<string | null>({
  key: 'selected-user',
  default: null
})
