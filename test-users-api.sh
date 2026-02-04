#!/bin/bash

# Users Module Test Script
# This script demonstrates all the Users API endpoints

BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

echo "=========================================="
echo "Users Module API Test"
echo "=========================================="
echo ""

# Step 1: Login as Admin
echo "1. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Login failed. Please ensure you have an admin user registered."
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful!"
echo ""

# Step 2: Get All Users
echo "2. Getting all users..."
curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Step 3: Get User Statistics
echo "3. Getting user statistics..."
curl -s -X GET "$BASE_URL/users/stats" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Step 4: Filter Users by Role
echo "4. Getting all BUYER users..."
curl -s -X GET "$BASE_URL/users?role=BUYER" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Step 5: Create a test user (for demonstration)
echo "5. Creating a test user..."
TEST_USER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+233123456789"
  }')

TEST_USER_ID=$(echo $TEST_USER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TEST_USER_ID" ]; then
  echo "⚠️  Test user might already exist, fetching existing users..."
  ALL_USERS=$(curl -s -X GET "$BASE_URL/users" -H "Authorization: Bearer $ACCESS_TOKEN")
  TEST_USER_ID=$(echo $ALL_USERS | jq -r '.[] | select(.email=="testuser@example.com") | .id')
fi

echo "Test User ID: $TEST_USER_ID"
echo ""

if [ ! -z "$TEST_USER_ID" ]; then
  # Step 6: Get User by ID
  echo "6. Getting user by ID..."
  curl -s -X GET "$BASE_URL/users/$TEST_USER_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
  echo ""

  # Step 7: Update User
  echo "7. Updating user information..."
  curl -s -X PUT "$BASE_URL/users/$TEST_USER_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "firstName": "Updated",
      "lastName": "Name",
      "phone": "+233987654321"
    }' | jq '.'
  echo ""

  # Step 8: Change User Role
  echo "8. Promoting user to DELIVERY role..."
  curl -s -X PATCH "$BASE_URL/users/$TEST_USER_ID/role" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"role": "DELIVERY"}' | jq '.'
  echo ""

  # Step 9: Get Updated Statistics
  echo "9. Getting updated user statistics..."
  curl -s -X GET "$BASE_URL/users/stats" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
  echo ""

  # Step 10: Delete User (optional - commented out)
  # echo "10. Deleting test user..."
  # curl -s -X DELETE "$BASE_URL/users/$TEST_USER_ID" \
  #   -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
  # echo ""
fi

echo "=========================================="
echo "✅ All tests completed successfully!"
echo "=========================================="
echo ""
echo "Note: The test user was NOT deleted. To delete manually:"
echo "curl -X DELETE \"$BASE_URL/users/$TEST_USER_ID\" -H \"Authorization: Bearer $ACCESS_TOKEN\""
