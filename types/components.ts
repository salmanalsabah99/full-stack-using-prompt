export interface DashboardCardProps {
  userId: string
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: 'TODO' | 'WAITING' | 'HOLD' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date | null
  completedAt?: Date | null
  order: number
  createdAt: Date
  updatedAt: Date
  userId: string
  taskListId: string
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  userId: string
  taskId?: string | null
  eventId?: string | null
}

export interface Event {
  id: string
  title: string
  description?: string | null
  startTime: Date
  endTime?: Date | null
  location?: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  taskId?: string | null
} 