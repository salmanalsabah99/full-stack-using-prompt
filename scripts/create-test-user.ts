import { prisma } from '../lib/prisma'

async function main() {
  const user = await prisma.user.create({
    data: {
      id: 'test_user_123',
      email: 'test@example.com',
      name: 'Test User',
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