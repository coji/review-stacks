import type { NextPage } from 'next'
import Head from 'next/head'
import { Stack, Box, Heading, Center, Grid, GridItem } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { useTeam } from '~/features/team/hooks/useTeam'
import { StackList } from '~/features/stacks/components/StackList'
import dayjs from 'dayjs'

const Home: NextPage = () => {
  const { isAuthChecking, currentUser } = useAuth()
  const { data: teamData } = useTeam(currentUser?.teamId)

  if (!isAuthChecking && !currentUser) {
    return <Center h="full">サインインしてください。</Center>
  }

  if (!teamData) {
    return <Center h="full">loading...</Center>
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
          <Box fontSize="xs">
            最終更新: {dayjs(teamData.updatedAt).format('YYYY-MM-DD HH:mm')}
          </Box>
        </Stack>

        <Grid gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}>
          <GridItem>
            <StackList
              title="作成した、またはアサインされているMR"
              items={teamData.assignees}
            />
          </GridItem>

          <GridItem>
            <StackList title="レビュー中のMR一覧" items={teamData.reviewers} />
          </GridItem>
        </Grid>
      </Stack>
    </>
  )
}

export default Home
