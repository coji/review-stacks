import { Fragment } from 'react'
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

    <Grid gridTemplateColumns="auto auto 1fr" gap="4">
      {items.map((item) => (
        <Fragment key={item.user.username}>
          <GridItem>
            <Stack direction="row" align="center">
              <Avatar size="sm" src={item.user.avatar} />
              <Box>{item.user.name}</Box>
            </Stack>
          </GridItem>

          <GridItem>
            <Box whiteSpace="nowrap">{item.mergerequests.length}件</Box>
          </GridItem>

          <GridItem
            display="flex"
            alignItems="center"
            gap="4"
            overflow="scroll"
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
      ))}
    </Grid>
  </>
)
