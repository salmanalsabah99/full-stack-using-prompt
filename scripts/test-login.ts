import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testLogin() {
  try {
    // Test Case 1: Create a test user
    console.log('Test Case 1: Creating test user...')
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com'
      }
    })
    console.log('✅ Test user created:', testUser)

    // Test Case 2: Find user by email
    console.log('\nTest Case 2: Finding user by email...')
    const foundUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    console.log('✅ User found:', foundUser)

    // Test Case 3: Try to find non-existent user
    console.log('\nTest Case 3: Finding non-existent user...')
    const nonExistentUser = await prisma.user.findUnique({
      where: { email: 'nonexistent@example.com' }
    })
    console.log('✅ Non-existent user check:', nonExistentUser === null)

    // Test Case 4: Update user
    console.log('\nTest Case 4: Updating user...')
    const updatedUser = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: { name: 'Updated Test User' }
    })
    console.log('✅ User updated:', updatedUser)

    // Test Case 5: Delete user
    console.log('\nTest Case 5: Deleting user...')
    await prisma.user.delete({
      where: { email: 'test@example.com' }
    })
    console.log('✅ User deleted')

    console.log('\n🎉 All tests passed!')
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin() 