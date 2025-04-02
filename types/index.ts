export interface TasksResponse {
  data: {
    id: string
    title: string
    description?: string | null
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    dueDate: string | null
    completedAt: string | null
    order: number
    createdAt: string
    updatedAt: string
    userId: string
    taskListId: string
  }[]
  error?: string
}

export interface EventsResponse {
  data: {
    id: string
    title: string
    description?: string | null
    startTime: string
    endTime: string | null
    location: string | null
    createdAt: string
    updatedAt: string
    userId: string
    taskId: string | null
  }[]
  error?: string
}

export interface NotesResponse {
  data: {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
    userId: string
    taskId: string | null
    eventId: string | null
  }[]
  error?: string
}

export interface TaskListsResponse {
  data: {
    id: string
    name: string
    description: string | null
    order: number
    createdAt: string
    updatedAt: string
    userId: string
  }[]
  error?: string
}

export interface CreateTaskListInput {
  name: string
  description?: string
  order?: number
  userId: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  order?: number
  userId: string
  taskListId: string
}

export interface CreateEventInput {
  title: string
  description?: string
  startTime: string
  endTime?: string
  location?: string
  userId: string
  taskId?: string
}

export interface CreateNoteInput {
  title: string
  content: string
  userId: string
  taskId?: string
  eventId?: string
}

export interface UpdateTaskListInput {
  name?: string
  description?: string
  order?: number
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  order?: number
  taskListId?: string
}

export interface UpdateEventInput {
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  location?: string
  taskId?: string
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  taskId?: string
  eventId?: string
}

export interface TaskListResponse {
  success: boolean
  data?: {
    id: string
    name: string
    description: string | null
    order: number
    createdAt: string
    updatedAt: string
    userId: string
  }
  error?: string
}

export interface TaskResponse {
  success: boolean
  data?: {
    id: string
    title: string
    description?: string | null
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    dueDate: string | null
    completedAt: string | null
    order: number
    createdAt: string
    updatedAt: string
    userId: string
    taskListId: string
  }
  error?: string
}

export interface EventResponse {
  success: boolean
  data?: {
    id: string
    title: string
    description?: string | null
    startTime: string
    endTime: string | null
    location: string | null
    createdAt: string
    updatedAt: string
    userId: string
    taskId: string | null
  }
  error?: string
}

export interface NoteResponse {
  success: boolean
  data?: {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
    userId: string
    taskId: string | null
    eventId: string | null
  }
  error?: string
} 