import type { Types } from '@gitbeaker/node'
import type { ReviewStacks } from '~/interfaces/model'

export interface Team {
  id: string
  name: string
  projectId: string
  privateToken: string
  mergerequests: Types.MergeRequestSchema[]
  reviewStacks: ReviewStacks
  updatedAt: string
}
