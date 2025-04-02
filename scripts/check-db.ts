import { prisma } from '../lib/prisma'

async function checkDatabase() {
  try {
    console.log('Checking database connection...')
    
    // Check users
    const users = await prisma.user.findMany()
    console.log('Users in database:', users)
    
    // Check task lists
    const taskLists = await prisma.taskList.findMany()
    console.log('Task lists in database:', taskLists)
    
    // Check tasks
    const tasks = await prisma.task.findMany()
    console.log('Tasks in database:', tasks)
    
    console.log('Database check completed successfully')
  } catch (error) {
    console.error('Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase() 