import type { Types } from '@gitbeaker/node'

export interface Team {
  id: string
  name: string
  projectId: string
  privateToken: string
  mergerequests: Types.MergeRequestSchema[]
  updatedAt: string
}
