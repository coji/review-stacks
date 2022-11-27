import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import {
  Stack,
  Box,
  Heading,
  Center,
  Grid,
  GridItem,
  Switch
} from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { AuthSignInButton } from '~/features/auth/components/AuthSignInButton'
import { useTeam } from '~/features/team/hooks/useTeam'
import { StackList } from '~/features/stacks/components/StackList'
import dayjs from '~/libs/dayjs'

const Home: NextPage = () => {
  const { isAuthChecking, currentUser } = useAuth()
  const [isShowClosed, setIsShowClosed] = useState(false)
  const { data: teamData } = useTeam(currentUser?.teamId ?? null, isShowClosed)

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
          <Box flex="1">
            <Heading color="gray.600" size="sm">
              <Box>{teamData.name}</Box>
            </Heading>
            <Box fontSize="xs" color="gray.500">
              最終更新: {dayjs(teamData.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Box>
          </Box>
          <Box textAlign="right" fontSize="sm">
            <Switch
              isChecked={isShowClosed}
              onChange={() => setIsShowClosed((val) => !val)}
            >
              最近のマージ済みも表示
            </Switch>
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
