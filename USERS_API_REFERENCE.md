# Users API Quick Reference

## Base URL
```
http://localhost:3000
```

## Authentication
All endpoints require admin authentication. Include JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 Endpoints

### 1️⃣ List All Users
```http
GET /users
```

**Query Parameters:**
- `role` (optional): Filter by role (`ADMIN`, `BUYER`, `DELIVERY`)

**Examples:**
```bash
# Get all users
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/users

# Get only buyers
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/users?role=BUYER

# Get only delivery persons
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/users?role=DELIVERY
```

**Response:** `200 OK`
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+233123456789",
    "role": "BUYER",
    "createdAt": "2026-01-28T00:00:00.000Z",
    "updatedAt": "2026-01-28T00:00:00.000Z"
  }
]
```

---

### 2️⃣ Get User Statistics
```http
GET /users/stats
```

**Example:**
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/users/stats
```

**Response:** `200 OK`
```json
{
  "totalUsers": 150,
  "buyers": 120,
  "deliveryPersons": 25,
  "admins": 5
}
```

---

### 3️⃣ Get User by ID
```http
GET /users/:id
```

**Example:**
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```

**Response:** `200 OK`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+233123456789",
  "role": "BUYER",
  "createdAt": "2026-01-28T00:00:00.000Z",
  "updatedAt": "2026-01-28T00:00:00.000Z",
  "_count": {
    "orders": 5,
    "deliveryOrders": 0
  }
}
```

**Errors:**
- `404 Not Found` - User doesn't exist

---

### 4️⃣ Update User
```http
PUT /users/:id
```

**Request Body:** (all fields optional)
```json
{
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+233987654321",
  "password": "newPassword123"
}
```

**Example:**
```bash
curl -X PUT -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+233987654321"
  }' \
  http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```

**Response:** `200 OK`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+233987654321",
  "role": "BUYER",
  "createdAt": "2026-01-28T00:00:00.000Z",
  "updatedAt": "2026-01-28T00:15:00.000Z"
}
```

**Errors:**
- `404 Not Found` - User doesn't exist
- `409 Conflict` - Email already in use

---

### 5️⃣ Change User Role
```http
PATCH /users/:id/role
```

**Request Body:**
```json
{
  "role": "DELIVERY"
}
```

**Valid Roles:**
- `ADMIN` - Administrator
- `BUYER` - Regular customer
- `DELIVERY` - Delivery person

**Example:**
```bash
# Promote user to delivery person
curl -X PATCH -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "DELIVERY"}' \
  http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000/role
```

**Response:** `200 OK`
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+233123456789",
  "role": "DELIVERY",
  "createdAt": "2026-01-28T00:00:00.000Z",
  "updatedAt": "2026-01-28T00:20:00.000Z"
}
```

**Errors:**
- `404 Not Found` - User doesn't exist
- `400 Bad Request` - Invalid role

---

### 6️⃣ Delete User
```http
DELETE /users/:id
```

**Example:**
```bash
curl -X DELETE -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```

**Response:** `200 OK`
```json
{
  "message": "User user@example.com has been deleted successfully"
}
```

**Errors:**
- `404 Not Found` - User doesn't exist
- `400 Bad Request` - Cannot delete admin users

---

## 🔐 Getting an Access Token

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

---

## 🚨 Common Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Cause:** Missing or invalid JWT token

---

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Cause:** User is not an admin

---

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User with ID {id} not found"
}
```
**Cause:** User doesn't exist

---

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already in use"
}
```
**Cause:** Email already exists in database

---

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Cannot delete admin users"
}
```
**Cause:** Attempting to delete an admin user

---

## 💡 Common Use Cases

### Promote a buyer to delivery person
```bash
# 1. Find the user
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/users?role=BUYER"

# 2. Promote to delivery
curl -X PATCH -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "DELIVERY"}' \
  "http://localhost:3000/users/USER_ID/role"
```

### Update user contact information
```bash
curl -X PUT -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+233123456789",
    "email": "newemail@example.com"
  }' \
  "http://localhost:3000/users/USER_ID"
```

### Get dashboard statistics
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/users/stats"
```

### Find all delivery persons
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/users?role=DELIVERY"
```

---

## 📚 Additional Resources

- **Full Documentation:** `backend/src/users/README.md`
- **Architecture Diagram:** `backend/USERS_ARCHITECTURE.md`
- **Implementation Summary:** `backend/USERS_MODULE_SUMMARY.md`
- **Postman Collection:** `backend/ecommerce-api-collection.json`
- **Test Script:** `backend/test-users-api.sh`
- **Swagger UI:** `http://localhost:3000/api` (when server is running)

---

## 🧪 Testing

### Run the test script
```bash
cd backend
./test-users-api.sh
```

### Import Postman collection
1. Open Postman
2. Import `ecommerce-api-collection.json`
3. Use the "Users" folder
4. Login first to get token (auto-saved to environment)

---

**Last Updated:** January 28, 2026  
**API Version:** 1.0  
**Base URL:** http://localhost:3000
