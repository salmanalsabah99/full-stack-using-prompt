import { prisma } from './prisma'

export async function ensureDefaultTaskList(userId: string) {
  console.log('ensureDefaultTaskList called with userId:', userId)
  
  try {
    // Check if user already has a default task list
    console.log('Checking for existing default task list...')
    let defaultTaskList = await prisma.taskList.findFirst({
      where: {
        userId,
        name: 'Default'
      }
    })

    // If no default task list exists, create one
    if (!defaultTaskList) {
      console.log('No default task list found, creating one...')
      defaultTaskList = await prisma.taskList.create({
        data: {
          name: 'Default',
          description: 'Your default task list',
          userId,
          order: 0
        }
      })
      console.log('Created new default task list:', defaultTaskList)
    } else {
      console.log('Found existing default task list:', defaultTaskList)
    }

    return defaultTaskList
  } catch (error) {
    console.error('Error in ensureDefaultTaskList:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    throw error
  }
} 