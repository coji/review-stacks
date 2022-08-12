import { Types } from '@gitbeaker/node/dist/types'

export interface GitlabUser {
  username: string
  name: string
  avatar: string
}

export interface ReviewStackItem {
  user: GitlabUser
  mergerequests: Types.MergeRequestSchema[]
}

export interface UserInfo extends GitlabUser {
  assigned: Types.MergeRequestSchema[]
  reviews: Types.MergeRequestSchema[]
}
