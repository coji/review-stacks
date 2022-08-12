import { useRecoilState } from 'recoil'
import { selectedUserState } from '../stores/selectedUser'

export const useUserSelection = () => {
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUserState)

  return {
    selectedUser,
    setSelectedUser
  }
}
