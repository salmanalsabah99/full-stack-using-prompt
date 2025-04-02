import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  try {
    console.log('Updating existing users with default password...')
    
    // Hash the default password
    const defaultPassword = 'Welcome123!' // This is a secure default password
    const hashedPassword = await hash(defaultPassword, 12)
    
    // Update all users that have an empty password
    const result = await prisma.user.updateMany({
      where: {
        password: ''
      },
      data: {
        password: hashedPassword
      }
    })
    
    console.log(`Updated ${result.count} users with default password`)
    console.log('Default password for existing users:', defaultPassword)
    console.log('Please ask users to change their password on first login')
    
  } catch (error) {
    console.error('Error updating users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 