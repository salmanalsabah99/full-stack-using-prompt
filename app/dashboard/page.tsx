'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import DashboardTasksCard from '@/components/DashboardTasksCard'
import DashboardNotesCard from '@/components/DashboardNotesCard'
import DashboardEventsCard from '@/components/DashboardEventsCard'
import OrbitPriorityCard from '@/components/dashboard/OrbitPriorityCard'
import FloatingActionButton from '@/components/FloatingActionButton'

const DashboardPage: React.FC = () => {
  const { userId, isLoading } = useUser()
  const router = useRouter()

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
        <div className="flex justify-between items-center mb-8">
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
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardTasksCard userId={userId} />
            <DashboardEventsCard userId={userId} />
            <DashboardNotesCard userId={userId} />
          </div>
          <div className="w-full">
            <OrbitPriorityCard />
          </div>
        </div>
      </div>

      <FloatingActionButton />
    </div>
  )
}

export default DashboardPage 