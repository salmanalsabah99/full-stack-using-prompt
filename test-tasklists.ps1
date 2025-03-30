# Test user ID (replace with an actual user ID from your database)
$USER_ID = "test_user_123"

Write-Host "Starting TaskList API tests..." -ForegroundColor Green

# 1. Create a task list
Write-Host "`nTesting POST /api/task-lists" -ForegroundColor Green
$createBody = @{
    name = "Today"
    userId = $USER_ID
} | ConvertTo-Json

$createResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/task-lists" -Method Post -Body $createBody -ContentType "application/json"
Write-Host "Response: $($createResponse | ConvertTo-Json)"

# Extract the task list ID from the response
$TASK_LIST_ID = $createResponse.data.id

if (-not $TASK_LIST_ID) {
    Write-Host "Failed to create task list" -ForegroundColor Red
    exit 1
}

Write-Host "Successfully created task list with ID: $TASK_LIST_ID" -ForegroundColor Green

# 2. Get all task lists
Write-Host "`nTesting GET /api/task-lists" -ForegroundColor Green
$getResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/task-lists?userId=$USER_ID" -Method Get
Write-Host "Response: $($getResponse | ConvertTo-Json)"

# 3. Update the task list
Write-Host "`nTesting PUT /api/task-lists/$TASK_LIST_ID" -ForegroundColor Green
$updateBody = @{
    name = "Updated Today"
    order = 1
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/task-lists/$TASK_LIST_ID" -Method Put -Body $updateBody -ContentType "application/json"
Write-Host "Response: $($updateResponse | ConvertTo-Json)"

# 4. Delete the task list
Write-Host "`nTesting DELETE /api/task-lists/$TASK_LIST_ID" -ForegroundColor Green
$deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/task-lists/$TASK_LIST_ID" -Method Delete
Write-Host "Response: $($deleteResponse | ConvertTo-Json)"

Write-Host "`nAll tests completed!" -ForegroundColor Green 