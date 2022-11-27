import type { NextPage } from 'next'
import Head from 'next/head'
import { Stack, Box, Heading, Center, Grid, GridItem } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { AuthSignInButton } from '~/features/auth/components/AuthSignInButton'
import { useTeam } from '~/features/team/hooks/useTeam'
import { StackList } from '~/features/stacks/components/StackList'
import dayjs from '~/libs/dayjs'

const Home: NextPage = () => {
  const { isAuthChecking, currentUser } = useAuth()
  const { data: teamData } = useTeam(currentUser?.teamId)

  if (!isAuthChecking && !currentUser) {
    return (
      <Center h="full" color="gray.500">
        <AuthSignInButton />
      </Center>
    )
  }

  if (!teamData) {
    return (
      <Center h="full" color="gray.500">
        Loading...
      </Center>
    )
  }

  return (
    <>
      <Head>
        <title>Review Stacks</title>
        <meta name="description" content="get review stacks!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack p="4">
        <Stack direction="row">
          <Heading color="gray.600" size="sm" flex="1">
            <Box>{teamData.name}</Box>
          </Heading>
          <Box fontSize="xs" color="gray.500" textAlign="right">
            <Box>
              最終更新: {dayjs(teamData.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Box>
            <Box fontStyle="italic">
              * opened 状態の MR と、過去１週間以内に更新された closed 状態の MR
              を表示しています
            </Box>
          </Box>
        </Stack>

        <Grid gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="4">
          <GridItem>
            <StackList
              title="作成した、またはアサインされているMR"
              items={teamData.assignees}
              type="assignee"
            />
          </GridItem>

          <GridItem>
            <StackList
              title="レビュー中のMR一覧"
              items={teamData.reviewers}
              type="reviewer"
            />
          </GridItem>
        </Grid>
      </Stack>
    </>
  )
}

export default Home
