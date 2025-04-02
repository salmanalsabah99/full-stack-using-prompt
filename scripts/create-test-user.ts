import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  const hashedPassword = await hash('testpassword123', 12)
  const user = await prisma.user.create({
    data: {
      id: 'test_user_123',
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword
    },
  })

  console.log('Created test user:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 