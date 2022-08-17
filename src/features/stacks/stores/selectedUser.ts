import { atom } from 'recoil'

export interface SelectedUser {
  username: string
  type: 'assignee' | 'reviewer'
}
export const selectedUserState = atom<SelectedUser | null>({
  key: 'selected-user',
  default: null
})
