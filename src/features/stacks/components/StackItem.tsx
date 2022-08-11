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
  Stack
} from '@chakra-ui/react'
import { Types } from '@gitbeaker/node'
import dayjs from '~/libs/dayjs'

interface StackItemProps extends BoxProps {
  item: Types.MergeRequestSchema
}
export const StackItem = ({ item, ...rest }: StackItemProps) => {
  const assignee = item.assignee ?? item.author
  const reviewer = item.reviewers?.[0]

  return (
    <Popover placement="bottom" trigger="hover">
      <PopoverTrigger>
        <Box
          as="a"
          href={item.web_url}
          target="_blank"
          display="inline-block"
          h="8"
          w="8"
          bgColor="gray.500"
          _hover={{ bgColor: 'gray.400' }}
          key={item.iid}
          {...rest}
        ></Box>
      </PopoverTrigger>
      <PopoverContent w="20rem">
        <PopoverHeader pt={4} fontWeight="bold" border="0" overflow="hidden">
          <Stack
            direction="row"
            as="a"
            href={item.web_url}
            target="_blank"
            _hover={{ color: 'blue.500' }}
          >
            <Box>[{item.iid}]</Box>
            <Box noOfLines={2}>{item.title}</Box>
          </Stack>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Box>アサイン: {assignee.name as string}</Box>
          <Box>
            レビュー: {reviewer ? (reviewer.name as string) : '未アサイン'}
          </Box>
          <Box>
            更新: {dayjs(item.updated_at).format('YYYY-MM-DD(ddd) HH:mm')}
          </Box>
          <Box>
            作成: {dayjs(item.created_at).format('YYYY-MM-DD(ddd) HH:mm')}
          </Box>
        </PopoverBody>
        <PopoverFooter display="flex">
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
}
