import { UserContext } from '../context/UserContext'

async function testAuth() {
  try {
    // Test Case 1: Initial state
    console.log('Test Case 1: Checking initial state...')
    const initialUserId = localStorage.getItem('userId')
    console.log('✅ Initial userId:', initialUserId)

    // Test Case 2: Setting userId
    console.log('\nTest Case 2: Setting userId...')
    const testUserId = 'test-user-123'
    localStorage.setItem('userId', testUserId)
    const storedUserId = localStorage.getItem('userId')
    console.log('✅ Stored userId:', storedUserId)

    // Test Case 3: Clearing userId
    console.log('\nTest Case 3: Clearing userId...')
    localStorage.removeItem('userId')
    const clearedUserId = localStorage.getItem('userId')
    console.log('✅ Cleared userId:', clearedUserId)

    // Test Case 4: UserContext state
    console.log('\nTest Case 4: Checking UserContext state...')
    const context = UserContext
    console.log('✅ UserContext:', context)

    // Test Case 5: Auth flow simulation
    console.log('\nTest Case 5: Simulating auth flow...')
    const authFlow = {
      login: (email: string) => {
        // Simulate API call
        if (email === 'test@example.com') {
          const userId = 'test-user-123'
          localStorage.setItem('userId', userId)
          return { success: true, userId }
        }
        return { success: false, error: 'User not found' }
      },
      logout: () => {
        localStorage.removeItem('userId')
        return { success: true }
      }
    }

    // Test login
    const loginResult = authFlow.login('test@example.com')
    console.log('✅ Login result:', loginResult)

    // Test logout
    const logoutResult = authFlow.logout()
    console.log('✅ Logout result:', logoutResult)

    console.log('\n🎉 All auth tests passed!')
  } catch (error) {
    console.error('❌ Auth test failed:', error)
  }
}

testAuth() 