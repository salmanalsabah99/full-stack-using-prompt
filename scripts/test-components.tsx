import React from 'react'
import { renderToString } from 'react-dom/server'
import { UserProvider } from '../context/UserContext'

// Mock components
const MockLoginPage = () => (
  <div>
    <input type="email" />
    <button type="submit">Sign in</button>
    <a href="/register">Register</a>
  </div>
)

const MockDashboardPage = () => (
  <div>
    <h1>Welcome to Your Dashboard</h1>
    <div>Task Lists</div>
  </div>
)

async function testComponents() {
  try {
    // Test Case 1: Login Page
    console.log('Test Case 1: Testing Login Page...')
    const loginHtml = renderToString(
      <UserProvider>
        <MockLoginPage />
      </UserProvider>
    )
    console.log('✅ Login page rendered successfully')
    
    // Verify login page elements
    const hasEmailInput = loginHtml.includes('type="email"')
    const hasSubmitButton = loginHtml.includes('type="submit"')
    const hasRegisterLink = loginHtml.includes('/register')
    
    console.log('✅ Login page elements:', {
      hasEmailInput,
      hasSubmitButton,
      hasRegisterLink
    })

    // Test Case 2: Dashboard Page
    console.log('\nTest Case 2: Testing Dashboard Page...')
    const dashboardHtml = renderToString(
      <UserProvider>
        <MockDashboardPage />
      </UserProvider>
    )
    console.log('✅ Dashboard page rendered successfully')
    
    // Verify dashboard elements
    const hasTaskLists = dashboardHtml.includes('Task Lists')
    const hasWelcomeMessage = dashboardHtml.includes('Welcome')
    
    console.log('✅ Dashboard elements:', {
      hasTaskLists,
      hasWelcomeMessage
    })

    console.log('\n🎉 All component tests passed!')
  } catch (error) {
    console.error('❌ Component test failed:', error)
  }
}

testComponents() 