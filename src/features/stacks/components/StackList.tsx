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
  PopoverFooter,
  Link
} from '@chakra-ui/react'
import { StackItem } from './StackItem'
import { ReviewStackItem } from '~/interfaces/model'
import { useUserSelection } from '../hooks/useUserSelection'
import { useItemSelection } from '../hooks/useItemSelection'
interface StackListProps {
  title: string
  items: ReviewStackItem[]
  type: 'assignee' | 'reviewer'
}

export const StackList = ({ title, items, type }: StackListProps) => {
  const { selectedUser, setSelectedUser } = useUserSelection()
  const { setSelectedItem } = useItemSelection()

  return (
    <Box>
      <Box my="4" fontWeight="bold" borderColor="gray.200" borderBottom="2px">
        {title}
      </Box>

      <Grid gap="4" templateColumns="auto auto 1fr">
        {items.map((item) => {
          const isActive =
            type === selectedUser?.type &&
            item.user.username === selectedUser?.username
          return (
            <Fragment key={item.user.username}>
              <GridItem>
                <Popover isLazy={true} placement="bottom" trigger="hover">
                  <PopoverTrigger>
                    <Stack
                      align="center"
                      direction="row"
                      color={isActive ? 'blue.500' : 'inherit'}
                      borderWidth="1px"
                      borderColor={isActive ? 'blue.500' : 'transparent'}
                      _hover={{
                        cursor: 'default'
                      }}
                      onMouseEnter={() =>
                        setSelectedUser({ username: item.user.username, type })
                      }
                      onMouseLeave={() => setSelectedUser(null)}
                      rounded="md"
                    >
                      <Avatar size="sm" src={item.user.avatar} />
                      <Box w="9rem" whiteSpace="nowrap">
                        {item.user.name}
                      </Box>
                    </Stack>
                  </PopoverTrigger>

                  <PopoverContent minW={{ base: 'full', md: '30rem' }}>
                    <PopoverHeader pt={4} fontWeight="bold" border="0" />
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Stack>
                        {item.pullrequests.map((pr, idx) => (
                          <Stack
                            key={pr.id}
                            direction="row"
                            onMouseEnter={() => setSelectedItem(pr.number)}
                            onMouseLeave={() => setSelectedItem(null)}
                          >
                            <Box noOfLines={1}>
                              {idx + 1}.{' '}
                              <Link
                                color={'blue.500'}
                                textDecoration={'underline'}
                                href={pr.webUrl}
                                target="_blank"
                              >
                                {pr.title}
                              </Link>
                            </Box>
                          </Stack>
                        ))}
                      </Stack>
                    </PopoverBody>
                    <PopoverFooter display="flex" border="none"></PopoverFooter>
                  </PopoverContent>
                </Popover>
              </GridItem>

              <GridItem>
                <Center w="8" h="8" whiteSpace="nowrap">
                  {item.pullrequests.length}件
                </Center>
              </GridItem>

              <GridItem
                alignItems="center"
                gap="4"
                display="flex"
                overflow="auto"
              >
                <Box whiteSpace="nowrap">
                  {item.pullrequests.map((pr, idx) => (
                    <StackItem
                      key={pr.id}
                      item={pr}
                      roundedLeft={idx === 0 ? 'md' : undefined}
                      roundedRight={
                        idx === item.pullrequests.length - 1 ? 'md' : undefined
                      }
                    ></StackItem>
                  ))}
                </Box>
              </GridItem>
            </Fragment>
          )
        })}
      </Grid>
    </Box>
  )
}
