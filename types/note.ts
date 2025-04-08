import { Note } from './components'

export interface NoteCategory {
  id: string
  name: string
  color: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface NoteWithCategory extends Note {
  categoryId: string | null
  category?: NoteCategory | null
}

export interface CreateNoteCategoryInput {
  name: string
  color: string
  userId: string
}

export interface UpdateNoteCategoryInput {
  name?: string
  color?: string
}

export interface NoteCategoryResponse {
  success: boolean
  data?: NoteCategory
  error?: string
}

export interface NoteCategoriesResponse {
  success: boolean
  data?: NoteCategory[]
  error?: string
} 