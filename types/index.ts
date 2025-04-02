import { TaskList, Task, TaskStatus, Priority, Event, Note } from '@prisma/client'

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

export type CreateTaskInput = {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: Date
  order?: number
  userId: string
  taskListId: string
}

export type UpdateTaskInput = {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: Date
  order?: number
  taskListId?: string
  userId?: string
}

export type TaskResponse = {
  success: boolean
  data?: Task
  error?: string
}

export type TasksResponse = {
  success: boolean
  data?: Task[]
  error?: string
}

export type CreateEventInput = {
  title: string
  description?: string
  startTime: Date
  endTime?: Date
  location?: string
  userId: string
  taskId?: string
}

export type UpdateEventInput = {
  title?: string
  description?: string
  startTime?: Date
  endTime?: Date
  location?: string
  taskId?: string
}

export type EventResponse = {
  success: boolean
  data?: Event
  error?: string
}

export type EventsResponse = {
  success: boolean
  data?: Event[]
  error?: string
}

export type CreateNoteInput = {
  title: string
  content: string
  userId: string
  taskId?: string
  eventId?: string
}

export type UpdateNoteInput = {
  title?: string
  content?: string
  taskId?: string | null
  eventId?: string | null
}

export type NoteResponse = {
  success: boolean
  data?: Note
  error?: string
}

export type NotesResponse = {
  success: boolean
  data?: Note[]
  error?: string
} 