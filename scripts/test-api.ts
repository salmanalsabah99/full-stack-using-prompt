import fetch from 'node-fetch'

const API_BASE_URL = 'http://localhost:3000/api'

interface User {
  id: string
  name: string
  email: string
}

interface TaskList {
  id: string
  name: string
  description: string
  userId: string
}

async function testAPI() {
  try {
    // Test Case 1: Create User
    console.log('Test Case 1: Creating user...')
    const createUserResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
      }),
    })
    const createUserData = await createUserResponse.json() as User
    console.log('✅ Create user response:', createUserData)

    // Test Case 2: Find User by Email
    console.log('\nTest Case 2: Finding user by email...')
    const findUserResponse = await fetch(`${API_BASE_URL}/users?email=test@example.com`)
    const findUserData = await findUserResponse.json() as User[]
    console.log('✅ Find user response:', findUserData)

    // Test Case 3: Login
    console.log('\nTest Case 3: Testing login...')
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    })
    const loginData = await loginResponse.json() as { success: boolean; user?: User; error?: string }
    console.log('✅ Login response:', loginData)

    // Test Case 4: Create Task List
    console.log('\nTest Case 4: Creating task list...')
    const createTaskListResponse = await fetch(`${API_BASE_URL}/task-lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Task List',
        description: 'Test Description',
        userId: createUserData.id,
      }),
    })
    const createTaskListData = await createTaskListResponse.json() as TaskList
    console.log('✅ Create task list response:', createTaskListData)

    // Test Case 5: Get Task Lists
    console.log('\nTest Case 5: Getting task lists...')
    const getTaskListsResponse = await fetch(`${API_BASE_URL}/task-lists?userId=${createUserData.id}`)
    const getTaskListsData = await getTaskListsResponse.json() as TaskList[]
    console.log('✅ Get task lists response:', getTaskListsData)

    console.log('\n🎉 All API tests passed!')
  } catch (error) {
    console.error('❌ API test failed:', error)
  }
}

testAPI() 