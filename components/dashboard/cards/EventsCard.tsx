'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { DashboardCardProps } from '@/types/components'
import { Event } from '@prisma/client'
import { Trash2, Pencil } from 'lucide-react'
import EditEventModal from '@/components/modals/EditEventModal'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const DashboardEventsCard: React.FC<DashboardCardProps> = ({ userId }) => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/events?userId=${userId}&date=${today}` : null,
    fetcher
  )
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      // Refresh the events list
      mutate()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const handleEventClick = async (event: Event) => {
    try {
      console.log('Event clicked, navigating to calendar:', event)
      await router.push('/calendar')
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-green-50 rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📅</span>
          <h2 className="text-lg font-semibold text-gray-900">Today's Events</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-green-100/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-green-50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📅</span>
          <h2 className="text-lg font-semibold text-gray-900">Today's Events</h2>
        </div>
        <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">
          Failed to load events
        </div>
      </div>
    )
  }

  const events = data?.data || []

  return (
    <>
      <div 
        className="bg-green-50 rounded-xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push('/calendar')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <h2 className="text-lg font-semibold text-gray-900">Today's Events</h2>
            <span className="text-sm text-gray-500">({events.length} total)</span>
          </div>
        </div>
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No events scheduled for today</p>
        ) : (
          <div className="space-y-3">
            {events.map((event: Event) => (
              <div
                key={event.id}
                className="p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="font-medium text-gray-900 truncate">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {format(new Date(event.startTime), 'h:mm a')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {format(new Date(event.endTime || event.startTime), 'h:mm a')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingEvent(event);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {editingEvent && (
        <EditEventModal
          isOpen={!!editingEvent}
          onClose={() => {
            setEditingEvent(null)
            mutate()
          }}
          event={editingEvent}
        />
      )}
    </>
  )
}

export default DashboardEventsCard 