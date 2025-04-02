export interface DashboardCardProps {
  userId: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime?: Date
  location?: string
  createdAt: Date
  updatedAt: Date
} 