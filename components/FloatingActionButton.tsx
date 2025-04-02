'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CheckSquare, Calendar, StickyNote } from 'lucide-react'
import CreateTaskModal from './modals/CreateTaskModal'
import CreateEventModal from './modals/CreateEventModal'
import CreateNoteModal from './modals/CreateNoteModal'

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<'task' | 'event' | 'note' | null>(null)

  const handleOpenModal = (type: 'task' | 'event' | 'note') => {
    setActiveModal(type)
    setIsOpen(false)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 right-0 space-y-2"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenModal('task')}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <CheckSquare className="w-5 h-5" />
                  <span>New Task</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenModal('event')}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>New Event</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenModal('note')}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors"
                >
                  <StickyNote className="w-5 h-5" />
                  <span>New Note</span>
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {activeModal === 'task' && (
          <CreateTaskModal isOpen={true} onClose={handleCloseModal} />
        )}
        {activeModal === 'event' && (
          <CreateEventModal isOpen={true} onClose={handleCloseModal} />
        )}
        {activeModal === 'note' && (
          <CreateNoteModal isOpen={true} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingActionButton 