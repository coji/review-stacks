import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Center } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { AuthSignInButton } from '~/features/auth/components/AuthSignInButton'
import { useTeam } from '~/features/team/hooks/useTeam'
import {
  ReviewStacks,
  ReviewStacksTitle,
  ReviewStacksBody,
  StackList
} from '~/features/stacks/components'
import dayjs from '~/libs/dayjs'

const SignIn = () => (
  <Center h="full" color="gray.500">
    <AuthSignInButton />
  </Center>
)

const Loading = () => (
  <Center h="full" color="gray.500">
    Loading...
  </Center>
)

const Home: NextPage = () => {
  const { isAuthChecking, currentUser } = useAuth()
  const [isShowMerged, setIsShowMerged] = useState(false)
  const { data: teamData } = useTeam(isShowMerged)

  if (!isAuthChecking && !currentUser) return <SignIn />
  if (!teamData) return <Loading />

  return (
    <>
      <Head>
        <title>Review Stacks</title>
        <meta name="description" content="get review stacks!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ReviewStacks>
        <ReviewStacksTitle
          title={teamData.name}
          updatedAt={dayjs(teamData.updatedAt).format('YYYY-MM-DD HH:mm')}
          isShowMerged={isShowMerged}
          onToggleShowMerged={(val) => setIsShowMerged(val)}
        />
        <ReviewStacksBody>
          <StackList
            title="作成した、またはアサインされているMR"
            items={teamData.reviewStacks.assignees}
            type="assignee"
          />
          <StackList
            title="レビュー中のMR一覧"
            items={teamData.reviewStacks.reviewers}
            type="reviewer"
          />
        </ReviewStacksBody>
      </ReviewStacks>
    </>
  )
}
export default Home
