import { TaskList } from '@prisma/client'

export type CreateTaskListInput = {
  name: string
  order?: number
  userId: string
}

export type UpdateTaskListInput = {
  name?: string
  order?: number
}

export type TaskListResponse = {
  success: boolean
  data?: TaskList
  error?: string
}

export type TaskListsResponse = {
  success: boolean
  data?: TaskList[]
  error?: string
} 