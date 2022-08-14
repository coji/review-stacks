import { memo } from 'react'
import {
  Box,
  BoxProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Spacer,
  Button,
  Stack,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react'
import { Types } from '@gitbeaker/node'
import dayjs from '~/libs/dayjs'
import { useUserSelection } from '../hooks/useUserSelection'
import { useItemSelection } from '../hooks/useItemSelection'
import { match } from 'ts-pattern'

interface StackItemProps extends BoxProps {
  item: Types.MergeRequestSchema
}
export const StackItem = memo(({ item, ...rest }: StackItemProps) => {
  const assignee = item.assignee ?? item.author
  const reviewer = item.reviewers?.[0]
  const { selectedUser } = useUserSelection()
  const { selectedItem, setSelectedItem } = useItemSelection()

  const color = match(item)
    .when(
      (item) => selectedItem === item.iid && !!reviewer, // 選択中のMRでレビュアーアサイン済み
      () => 'blue.500'
    )
    .when(
      (item) => selectedItem === item.iid, // 選択中のMRでレビュアー未アサイン
      () => 'blue.300'
    )
    .when(
      () => assignee.username === selectedUser && !!reviewer, // 選択中の assignee でレビュアーアサイン済み
      () => 'blue.500'
    )
    .when(
      () => assignee.username === selectedUser, // 選択中の assignee でレビュアー未アサイン
      () => 'blue.300'
    )
    .otherwise(() => 'gray.300') // それ以外

  return (
    <Popover placement="bottom" trigger="hover">
      <PopoverTrigger>
        <Box
          display="inline-block"
          h="8"
          w="8"
          bgColor={color}
          _hover={{ cursor: 'pointer' }}
          key={item.iid}
          onPointerDown={() => window.open(item.web_url, '_blank')}
          onMouseEnter={() => setSelectedItem(item.iid)}
          onMouseLeave={() => setSelectedItem(null)}
          {...rest}
        ></Box>
      </PopoverTrigger>
      <PopoverContent w="20rem">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          <Stack
            direction="row"
            as="a"
            href={item.web_url}
            target="_blank"
            _hover={{ color: 'blue.500' }}
          >
            <Box>[{item.iid}]</Box>
            <Box noOfLines={1}>{item.title}</Box>
          </Stack>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <TableContainer>
            <Table size="sm" variant="simple">
              <Tbody>
                <Tr>
                  <Th>アサイン</Th>
                  <Td>{String(assignee.name)}</Td>
                </Tr>
                <Tr>
                  <Th>レビュアー</Th>
                  <Td color={!reviewer ? 'blue.300' : undefined}>
                    {reviewer ? String(reviewer.name) : '未アサイン'}
                  </Td>
                </Tr>
                <Tr>
                  <Th>更新</Th>
                  <Td>
                    {dayjs(item.updated_at).format('YYYY-MM-DD(ddd) HH:mm')}
                  </Td>
                </Tr>
                <Tr>
                  <Th>作成</Th>
                  <Td>
                    {dayjs(item.created_at).format('YYYY-MM-DD(ddd) HH:mm')}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </PopoverBody>
        <PopoverFooter border="none" display="flex">
          <Spacer />
          <Button
            as="a"
            target="_blank"
            href={item.web_url}
            size="sm"
            colorScheme="blue"
          >
            GitLabで開く
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
})
StackItem.displayName = 'StackItem'
