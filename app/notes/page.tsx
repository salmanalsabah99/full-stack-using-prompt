'use client'

import React, { useState } from 'react'
import { useUser } from '@/context/UserContext'
import useSWR from 'swr'
import { NoteWithCategory, NoteCategory } from '@/types/note'
import Sidebar from '@/components/notes/Sidebar'
import TopBar from '@/components/notes/TopBar'
import NoteCard from '@/components/notes/NoteCard'
import CreateNoteModal from '@/components/modals/CreateNoteModal'
import EditNoteModal from '@/components/modals/EditNoteModal'
import CategoryModal from '@/components/modals/CategoryModal'
import { motion } from 'framer-motion'
import PageTransitionWrapper from '@/components/common/PageTransitionWrapper'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function NotesPage() {
  const { userId } = useUser()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteWithCategory | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<NoteCategory | null>(null)

  // Fetch notes and categories
  const { data: notesData, mutate: mutateNotes } = useSWR(
    userId ? `/api/notes?userId=${userId}` : null,
    fetcher
  )
  const { data: categoriesData, mutate: mutateCategories } = useSWR(
    userId ? `/api/note-categories?userId=${userId}` : null,
    fetcher
  )

  const notes = notesData?.data || []
  const categories = categoriesData?.data || []

  // Filter notes by selected category
  const filteredNotes = selectedCategoryId
    ? notes.filter((note: NoteWithCategory) => note.categoryId === selectedCategoryId)
    : notes

  const handleCreateNote = () => {
    setIsCreateModalOpen(true)
  }

  const handleEditNote = (note: NoteWithCategory) => {
    setEditingNote(note)
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete note')
      }

      mutateNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleNoteUpdate = () => {
    mutateNotes()
    setEditingNote(null)
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (category: NoteCategory) => {
    setEditingCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/note-categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      mutateCategories()
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleCategoryUpdate = () => {
    mutateCategories()
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      },
    },
  }

  return (
    <PageTransitionWrapper direction="right">
      <div className="flex h-screen bg-yellow-50 dark:bg-gray-950">
        <Sidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onCreateCategory={handleCreateCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
        
        <div className="flex-1 flex flex-col">
          <TopBar onCreateNote={handleCreateNote} />
          
          <div className="flex-1 p-6 overflow-y-auto">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredNotes.map((note: NoteWithCategory, index: number) => (
                <motion.div
                  key={note.id}
                  variants={cardVariants}
                  custom={index}
                >
                  <NoteCard
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <CreateNoteModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          categories={categories}
        />

        {editingNote && (
          <EditNoteModal
            isOpen={!!editingNote}
            onClose={() => setEditingNote(null)}
            note={editingNote}
            categories={categories}
            onUpdate={handleNoteUpdate}
          />
        )}

        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false)
            setEditingCategory(null)
          }}
          category={editingCategory || undefined}
          onUpdate={handleCategoryUpdate}
        />
      </div>
    </PageTransitionWrapper>
  )
} 