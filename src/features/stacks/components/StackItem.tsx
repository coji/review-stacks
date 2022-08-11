import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Spacer,
  ButtonGroup,
  Button,
  Stack
} from '@chakra-ui/react'
import { Types } from '@gitbeaker/node'

interface StackItemProps {
  item: Types.MergeRequestSchema
}
export const StackItem = ({ item }: StackItemProps) => {
  return (
    <Popover placement="bottom" trigger="hover">
      <PopoverTrigger>
        <Box
          display="inline-block"
          h="8"
          w="8"
          bgColor="gray.500"
          _hover={{ bgColor: 'gray.400' }}
          key={item.iid}
        ></Box>
      </PopoverTrigger>
      <PopoverContent w="40rem">
        <PopoverHeader pt={4} fontWeight="bold" border="0" overflow="hidden">
          <Stack direction="row">
            <Box>[{item.iid}]</Box>
            <Box noOfLines={2}>{item.title}</Box>
          </Stack>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Box fontSize="xs" noOfLines={5}>
            {item.description}
          </Box>
        </PopoverBody>
        <PopoverFooter display="flex">
          <Spacer />
          <ButtonGroup size="sm">
            <Button colorScheme="green">Setup Email</Button>
            <Button colorScheme="blue">Next</Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
