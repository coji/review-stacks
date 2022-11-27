// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createFetcher } from '~/features/gitlab/services/fetcher.server'
import type { Types } from '@gitbeaker/node'
import { getIdTokenFromRequest } from '~/libs/firebase-admin.server'
import { getTeam, updateTeam } from '~/features/team/libs/team.server'
import dayjs from '~/libs/dayjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Types.MergeRequestSchema[] | string>
) {
  if (!req.query.teamId) {
    return res.status(500).send('teamId is required')
  }
  const teamId = String(req.query.teamId)

  // ユーザ認証
  const verified = await getIdTokenFromRequest(req)
  if (!verified) {
    return res.status(500).send('authorization failure')
  }

  const team = await getTeam(teamId)
  let mergerequests: Types.MergeRequestSchema[] = []
  if (team.mergerequests) mergerequests = team.mergerequests

  // 最終更新から5分以上経過していたら更新かける
  if (dayjs().isAfter(dayjs(team.updatedAt).add(5, 'minute'))) {
    // update
    const fetcher = createFetcher({
      projectId: team.projectId,
      privateToken: team.privateToken
    })
    mergerequests = await (
      await fetcher.closedInWeekMergerequests()
    ).concat(await fetcher.openedMergerequests())
    updateTeam(team.id, mergerequests)
  }

  res.status(200).json(mergerequests)
}
