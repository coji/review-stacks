import { useRecoilState } from 'recoil'
import { selectedItemState } from '../stores/selectedItem'

export const useItemSelection = () => {
  const [selectedItem, setSelectedItem] = useRecoilState(selectedItemState)

  return {
    selectedItem,
    setSelectedItem
  }
}
