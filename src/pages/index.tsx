import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Heading } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { useTeam } from '~/features/team/hooks/useTeam'

const Home: NextPage = () => {
  const { currentUser } = useAuth()
  const { data: teamData } = useTeam(currentUser?.teamId)

  if (!teamData) {
    return <div>loading...</div>
  }

  return (
    <>
      <Head>
        <title>Review Stacks</title>
        <meta name="description" content="get review stacks!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box p="4">
        <Heading color="gray.600">{teamData.name}</Heading>
      </Box>
    </>
  )
}

export default Home
