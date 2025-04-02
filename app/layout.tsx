import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { UserProvider } from '@/context/UserContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Leo - Your Second Brain',
  description: 'Organize your thoughts, tasks, and schedule in one place',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <body className="min-h-screen bg-gray-50/50 text-gray-900">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
} 