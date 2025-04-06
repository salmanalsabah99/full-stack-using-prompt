'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import TasksCard from '@/components/dashboard/cards/TasksCard'
import NotesCard from '@/components/dashboard/cards/NotesCard'
import EventsCard from '@/components/dashboard/cards/EventsCard'
import OrbitPriorityCard from '@/components/dashboard/cards/OrbitPriorityCard'
import FloatingActionButton from '@/components/common/FloatingActionButton'
import { motion } from 'framer-motion'

const DashboardPage: React.FC = () => {
  const { userId, isLoading } = useUser()
  const router = useRouter()

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userId) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('userId')
              router.push('/login')
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Out
          </button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <motion.div variants={cardVariants}>
              <TasksCard userId={userId} />
            </motion.div>
            <motion.div variants={cardVariants}>
              <EventsCard userId={userId} />
            </motion.div>
            <motion.div variants={cardVariants}>
              <NotesCard userId={userId} />
            </motion.div>
          </motion.div>
          <motion.div 
            className="w-full"
            variants={cardVariants}
          >
            <OrbitPriorityCard />
          </motion.div>
        </motion.div>
      </div>

      <FloatingActionButton />
    </div>
  )
}

export default DashboardPage 