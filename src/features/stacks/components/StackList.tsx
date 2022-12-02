import { Fragment } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Stack,
  Center,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter
} from '@chakra-ui/react'
import { StackItem } from './StackItem'
import { ReviewStackItem } from '~/interfaces/model'
import { useUserSelection } from '../hooks/useUserSelection'
interface StackListProps {
  title: string
  items: ReviewStackItem[]
  type: 'assignee' | 'reviewer'
}

export const StackList = ({ title, items, type }: StackListProps) => {
  const { selectedUser, setSelectedUser } = useUserSelection()

  return (
    <>
      <Box fontWeight="bold" my="4" borderBottom="2px" borderColor="gray.200">
        {title}
      </Box>

      <Grid gridTemplateColumns="auto auto 1fr" gap="4">
        {items.map((item) => {
          const isActive =
            type === selectedUser?.type &&
            item.user.username === selectedUser?.username
          return (
            <Fragment key={item.user.username}>
              <GridItem>
                <Popover placement="bottom" trigger="hover" isLazy={true}>
                  <PopoverTrigger>
                    <Stack
                      direction="row"
                      align="center"
                      onMouseEnter={() =>
                        setSelectedUser({ username: item.user.username, type })
                      }
                      onMouseLeave={() => setSelectedUser(null)}
                      color={isActive ? 'blue.500' : 'inherit'}
                      borderColor={isActive ? 'blue.500' : 'transparent'}
                      borderWidth="1px"
                      rounded="md"
                      _hover={{
                        cursor: 'default'
                      }}
                    >
                      <Avatar size="sm" src={item.user.avatar} />
                      <Box w="9rem" whiteSpace="nowrap">
                        {item.user.name}
                      </Box>
                    </Stack>
                  </PopoverTrigger>
                  <PopoverContent w="30rem">
                    <PopoverHeader
                      pt={4}
                      fontWeight="bold"
                      border="0"
                    ></PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Stack>
                        {item.mergerequests.map((mr, idx) => (
                          <Stack direction="row" key={mr.id}>
                            <Box noOfLines={1}>
                              {idx + 1}. {mr.title}
                            </Box>
                          </Stack>
                        ))}
                      </Stack>
                    </PopoverBody>
                    <PopoverFooter border="none" display="flex"></PopoverFooter>
                  </PopoverContent>
                </Popover>
              </GridItem>

              <GridItem>
                <Center whiteSpace="nowrap" h="8" w="8">
                  {item.mergerequests.length}件
                </Center>
              </GridItem>

              <GridItem
                display="flex"
                alignItems="center"
                gap="4"
                overflow="auto"
              >
                <Box whiteSpace="nowrap">
                  {item.mergerequests.map((mr, idx) => (
                    <StackItem
                      key={mr.id}
                      item={mr}
                      roundedLeft={idx === 0 ? 'md' : undefined}
                      roundedRight={
                        idx === item.mergerequests.length - 1 ? 'md' : undefined
                      }
                    ></StackItem>
                  ))}
                </Box>
              </GridItem>
            </Fragment>
          )
        })}
      </Grid>
    </>
  )
}
