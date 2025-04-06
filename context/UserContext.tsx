'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface UserContextType {
  userId: string | null
  setUserId: (id: string | null) => void
  isLoading: boolean
}

export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
  isLoading: true
})

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for userId in localStorage on initial load
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    }
    setIsLoading(false)
  }, [])

  const handleSetUserId = (id: string | null) => {
    console.log('Setting userId:', id)
    if (id) {
      localStorage.setItem('userId', id)
    } else {
      localStorage.removeItem('userId')
    }
    setUserId(id)
  }

  return (
    <UserContext.Provider value={{ userId, setUserId: handleSetUserId, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export const useRequireAuth = () => {
  const { userId, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !userId) {
      console.log('No userId found, redirecting to login')
      router.push('/login')
    }
  }, [userId, isLoading, router])

  return { userId, isLoading }
} 