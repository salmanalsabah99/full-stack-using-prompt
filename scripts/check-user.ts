import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: 'Salman0alsabah3@gmail.com'
      }
    })

    if (user) {
      console.log('User found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      })
    } else {
      console.log('User not found')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser() 