#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test user ID (replace with an actual user ID from your database)
USER_ID="test_user_123"

echo "Starting TaskList API tests..."

# 1. Create a task list
echo -e "\n${GREEN}Testing POST /api/task-lists${NC}"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/task-lists \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Today\", \"userId\": \"$USER_ID\"}")
echo "Response: $CREATE_RESPONSE"

# Extract the task list ID from the response
TASK_LIST_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TASK_LIST_ID" ]; then
  echo -e "${RED}Failed to create task list${NC}"
  exit 1
fi

echo -e "${GREEN}Successfully created task list with ID: $TASK_LIST_ID${NC}"

# 2. Get all task lists
echo -e "\n${GREEN}Testing GET /api/task-lists${NC}"
GET_RESPONSE=$(curl -s "http://localhost:3000/api/task-lists?userId=$USER_ID")
echo "Response: $GET_RESPONSE"

# 3. Update the task list
echo -e "\n${GREEN}Testing PUT /api/task-lists/$TASK_LIST_ID${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "http://localhost:3000/api/task-lists/$TASK_LIST_ID" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Today", "order": 1}')
echo "Response: $UPDATE_RESPONSE"

# 4. Delete the task list
echo -e "\n${GREEN}Testing DELETE /api/task-lists/$TASK_LIST_ID${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE "http://localhost:3000/api/task-lists/$TASK_LIST_ID")
echo "Response: $DELETE_RESPONSE"

echo -e "\n${GREEN}All tests completed!${NC}" 