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
import type { PullRequest } from '~/interfaces/model'
import dayjs from '~/libs/dayjs'
import { useUserSelection } from '../hooks/useUserSelection'
import { useItemSelection } from '../hooks/useItemSelection'
import { selectItemColor } from '../libs/selectItemColor'
interface StackItemProps extends BoxProps {
  item: PullRequest
}
export const StackItem = memo(({ item, ...rest }: StackItemProps) => {
  const assignee = item.assignee ?? item.author
  const reviewer = item.reviewers?.[0]
  const { selectedUser } = useUserSelection()
  const { selectedItem, setSelectedItem } = useItemSelection()

  const color = selectItemColor({
    item,
    assignee,
    reviewer,
    selectedUser,
    selectedItem
  })

  return (
    <Popover placement="bottom" trigger="hover" isLazy={true}>
      <PopoverTrigger>
        <Box
          display="inline-block"
          h="8"
          w="8"
          bgColor={color}
          _hover={{ cursor: 'pointer' }}
          key={item.number}
          onPointerDown={() => window.open(item.webUrl, '_blank')}
          onMouseEnter={() => setSelectedItem(item.number)}
          onMouseLeave={() => setSelectedItem(null)}
          {...rest}
        ></Box>
      </PopoverTrigger>
      <PopoverContent w="20rem">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          <Stack
            direction="row"
            as="a"
            href={item.webUrl}
            target="_blank"
            _hover={{ color: 'blue.500' }}
          >
            <Box>[{item.number}]</Box>
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
                  <Th>state</Th>
                  <Td>{String(item.state)}</Td>
                </Tr>
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
                {item.state === 'merged' && (
                  <Tr>
                    <Th>マージ</Th>
                    <Td>
                      {dayjs(item.mergedAt).format('YYYY-MM-DD(ddd) HH:mm')}
                    </Td>
                  </Tr>
                )}
                <Tr>
                  <Th>更新</Th>
                  <Td>
                    {dayjs(item.updatedAt).format('YYYY-MM-DD(ddd) HH:mm')}
                  </Td>
                </Tr>
                <Tr>
                  <Th>作成</Th>
                  <Td>
                    {dayjs(item.createdAt).format('YYYY-MM-DD(ddd) HH:mm')}
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
            href={item.webUrl}
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
