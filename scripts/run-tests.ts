import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function runTests() {
  try {
    console.log('🚀 Starting test suite...\n')

    // Run auth tests
    console.log('📝 Running auth tests...')
    await execAsync('ts-node -r ./scripts/test-setup.ts scripts/test-auth.ts')
    console.log('✅ Auth tests completed\n')

    // Run API tests
    console.log('🔌 Running API tests...')
    await execAsync('ts-node -r ./scripts/test-setup.ts scripts/test-api.ts')
    console.log('✅ API tests completed\n')

    // Run component tests
    console.log('🎨 Running component tests...')
    await execAsync('ts-node -r ./scripts/test-setup.ts scripts/test-components.tsx')
    console.log('✅ Component tests completed\n')

    console.log('🎉 All tests completed successfully!')
  } catch (error) {
    console.error('❌ Test suite failed:', error)
    process.exit(1)
  }
}

runTests() 