import { Types } from '@gitbeaker/node'
import { match } from 'ts-pattern'
import type { SelectedUser } from '../stores/selectedUser'

interface SelectItemColorProps {
  item: Types.MergeRequestSchema
  assignee: Omit<Types.UserSchema, 'created_at'>
  reviewer?: Omit<Types.UserSchema, 'created_at'>
  selectedUser: SelectedUser | null
  selectedItem: number | null
}

export const selectItemColor = ({
  item,
  assignee,
  reviewer,
  selectedUser,
  selectedItem
}: SelectItemColorProps) =>
  match(item)
    .when(
      (item) => item.state === 'merged' && selectedItem === item.iid,
      () => 'gray.500'
    )
    .when(
      // マージ済みのもの
      (item) => item.state === 'merged',
      () => 'gray.400'
    )
    .when(
      (item) => selectedItem === item.iid && !!reviewer, // 選択中のMRでレビュアーアサイン済み
      () => 'blue.500'
    )
    .when(
      (item) => selectedItem === item.iid, // 選択中のMRでレビュアー未アサイン
      () => 'blue.300'
    )
    .when(
      () =>
        selectedUser?.type == 'assignee' &&
        assignee.username === selectedUser?.username &&
        !!reviewer, // 選択中の assignee でレビュアーアサイン済み
      () => 'blue.500'
    )
    .when(
      () =>
        selectedUser?.type == 'assignee' &&
        assignee.username === selectedUser?.username, // 選択中の assignee でレビュアー未アサイン
      () => 'blue.300'
    )
    .when(
      () =>
        selectedUser?.type == 'reviewer' &&
        !!reviewer &&
        reviewer.username === selectedUser?.username &&
        !!reviewer, // 選択中の assignee でレビュアーアサイン済み
      () => 'blue.500'
    )
    .when(
      () =>
        selectedUser?.type == 'reviewer' &&
        !!reviewer &&
        reviewer.username === selectedUser?.username, // 選択中の assignee でレビュアー未アサイン
      () => 'blue.300'
    )
    .otherwise(() => 'gray.300') // それ以外
