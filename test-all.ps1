# Test user details
$TEST_USER_NAME = "Test User"
$TIMESTAMP = Get-Date -Format "yyyyMMddHHmmss"
$TEST_USER_EMAIL = "test_$TIMESTAMP@example.com"

Write-Host "Starting comprehensive API tests..." -ForegroundColor Green

# 1. Create test user
Write-Host "`nTesting POST /api/users" -ForegroundColor Green
$createUserBody = @{
    name = $TEST_USER_NAME
    email = $TEST_USER_EMAIL
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/users" -Method Post -Body $createUserBody -ContentType "application/json"
    $createUserResponse = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($createUserResponse | ConvertTo-Json)"
    
    if (-not $createUserResponse.success) {
        Write-Host "Failed to create test user: $($createUserResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    $USER_ID = $createUserResponse.user.id
    Write-Host "Successfully created test user with ID: $USER_ID" -ForegroundColor Green
} catch {
    Write-Host "Error creating test user: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.GetResponseStream())" -ForegroundColor Red
    exit 1
}

# 2. Test task lists
Write-Host "`nTesting Task Lists API..." -ForegroundColor Green

# 2.1 Get default task list
Write-Host "Testing GET /api/tasklists?default=true" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/tasklists?userId=$USER_ID&default=true" -Method Get
    $defaultListResponse = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($defaultListResponse | ConvertTo-Json)"
    
    if (-not $defaultListResponse.success) {
        Write-Host "Failed to get default task list: $($defaultListResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    $DEFAULT_TASK_LIST_ID = $defaultListResponse.data.id
    Write-Host "Successfully got default task list with ID: $DEFAULT_TASK_LIST_ID" -ForegroundColor Green
} catch {
    Write-Host "Error getting default task list: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.GetResponseStream())" -ForegroundColor Red
    exit 1
}

# 2.2 Create a new task list
Write-Host "`nTesting POST /api/tasklists" -ForegroundColor Green
$createListBody = @{
    name = "Test List"
    userId = $USER_ID
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/tasklists" -Method Post -Body $createListBody -ContentType "application/json"
    $createListResponse = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($createListResponse | ConvertTo-Json)"
    
    if (-not $createListResponse.success) {
        Write-Host "Failed to create task list: $($createListResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    $TEST_TASK_LIST_ID = $createListResponse.data.id
    Write-Host "Successfully created task list with ID: $TEST_TASK_LIST_ID" -ForegroundColor Green
} catch {
    Write-Host "Error creating task list: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.GetResponseStream())" -ForegroundColor Red
    exit 1
}

# 3. Test tasks
Write-Host "`nTesting Tasks API..." -ForegroundColor Green

# 3.1 Create a task
Write-Host "Testing POST /api/tasks" -ForegroundColor Green
$createTaskBody = @{
    title = "Test Task"
    userId = $USER_ID
    taskListId = $DEFAULT_TASK_LIST_ID
    priority = "MEDIUM"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/tasks" -Method Post -Body $createTaskBody -ContentType "application/json"
    $createTaskResponse = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($createTaskResponse | ConvertTo-Json)"
    
    if (-not $createTaskResponse.success) {
        Write-Host "Failed to create task: $($createTaskResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    $TEST_TASK_ID = $createTaskResponse.data.id
    Write-Host "Successfully created task with ID: $TEST_TASK_ID" -ForegroundColor Green
} catch {
    Write-Host "Error creating task: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.GetResponseStream())" -ForegroundColor Red
    exit 1
}

# 4. Test events
Write-Host "`nTesting Events API..." -ForegroundColor Green

# 4.1 Create an event
Write-Host "Testing POST /api/events" -ForegroundColor Green
$startTime = (Get-Date).AddHours(1).ToString("yyyy-MM-ddTHH:mm:ss")
$endTime = (Get-Date).AddHours(2).ToString("yyyy-MM-ddTHH:mm:ss")

$createEventBody = @{
    title = "Test Event"
    userId = $USER_ID
    startTime = $startTime
    endTime = $endTime
    location = "Test Location"
    taskId = $TEST_TASK_ID
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/events" -Method Post -Body $createEventBody -ContentType "application/json"
    $createEventResponse = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($createEventResponse | ConvertTo-Json)"
    
    if (-not $createEventResponse.success) {
        Write-Host "Failed to create event: $($createEventResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    $TEST_EVENT_ID = $createEventResponse.data.id
    Write-Host "Successfully created event with ID: $TEST_EVENT_ID" -ForegroundColor Green
} catch {
    Write-Host "Error creating event: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.GetResponseStream())" -ForegroundColor Red
    exit 1
}

# 5. Test notes
Write-Host "`nTesting Notes API..." -ForegroundColor Green

# 5.1 Create a note
Write-Host "Testing POST /api/notes" -ForegroundColor Green
$createNoteBody = @{
    title = "Test Note"
    content = "This is a test note content"
    userId = $USER_ID
    taskId = $TEST_TASK_ID
    eventId = $TEST_EVENT_ID
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/notes" -Method Post -Body $createNoteBody -ContentType "application/json"
    $createNoteResponse = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($createNoteResponse | ConvertTo-Json)"
    
    if (-not $createNoteResponse.success) {
        Write-Host "Failed to create note: $($createNoteResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    $TEST_NOTE_ID = $createNoteResponse.data.id
    Write-Host "Successfully created note with ID: $TEST_NOTE_ID" -ForegroundColor Green
} catch {
    Write-Host "Error creating note: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.GetResponseStream())" -ForegroundColor Red
    exit 1
}

Write-Host "`nAll tests completed successfully!" -ForegroundColor Green 