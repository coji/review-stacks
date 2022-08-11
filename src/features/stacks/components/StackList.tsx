import { Box, Grid, GridItem, Stack, Avatar } from '@chakra-ui/react'
import { StackItem } from './StackItem'
import { ReviewStackItem } from '~/interfaces/model'

interface StackListProps {
  title: string
  items: ReviewStackItem[]
}

export const StackList = ({ title, items }: StackListProps) => (
  <>
    <Box fontWeight="bold" my="4">
      {title}
    </Box>

    <Grid gridTemplateColumns="auto 1fr" gap="4">
      {items.map((item) => (
        <>
          <GridItem>
            <Stack direction="row" align="center">
              <Avatar size="sm" src={item.user.avatar} />
              <Box>{item.user.name}</Box>
            </Stack>
          </GridItem>

          <GridItem display="flex" alignItems="center" gap="4">
            <Box>{item.mergerequests.length}件</Box>
            <Box>
              {item.mergerequests.map((mr) => (
                <StackItem key={mr.id} item={mr}></StackItem>
              ))}
            </Box>
          </GridItem>
        </>
      ))}
    </Grid>
  </>
)
