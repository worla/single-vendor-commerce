# Users Module

## Overview
The Users module provides comprehensive user management functionality for administrators. It includes endpoints for listing, viewing, updating, deleting users, and managing user roles.

## Features
- ✅ List all users with optional role filtering
- ✅ Get detailed user information by ID
- ✅ Update user profile information
- ✅ Change user roles (promote to delivery person, admin, etc.)
- ✅ Delete users (with admin protection)
- ✅ Get user statistics (total users, buyers, delivery persons, admins)

## API Endpoints

### 1. Get All Users
**Endpoint:** `GET /users`  
**Auth:** Required (Admin only)  
**Query Parameters:**
- `role` (optional): Filter by role (ADMIN, BUYER, DELIVERY)

**Example:**
```bash
GET /users
GET /users?role=BUYER
```

**Response:**
```json
[
  {
    "id": "uuid",
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

### 2. Get User Statistics
**Endpoint:** `GET /users/stats`  
**Auth:** Required (Admin only)

**Response:**
```json
{
  "totalUsers": 150,
  "buyers": 120,
  "deliveryPersons": 25,
  "admins": 5
}
```

---

### 3. Get User by ID
**Endpoint:** `GET /users/:id`  
**Auth:** Required (Admin only)

**Example:**
```bash
GET /users/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
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

---

### 4. Update User
**Endpoint:** `PUT /users/:id`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+233987654321",
  "password": "newPassword123"
}
```

**Notes:**
- All fields are optional
- Email uniqueness is validated
- Password is automatically hashed if provided

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "jane.smith@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+233987654321",
  "role": "BUYER",
  "createdAt": "2026-01-28T00:00:00.000Z",
  "updatedAt": "2026-01-28T00:15:00.000Z"
}
```

---

### 5. Change User Role
**Endpoint:** `PATCH /users/:id/role`  
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "role": "DELIVERY"
}
```

**Valid Roles:**
- `ADMIN` - Administrator with full access
- `BUYER` - Regular customer
- `DELIVERY` - Delivery person

**Response:**
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

---

### 6. Delete User
**Endpoint:** `DELETE /users/:id`  
**Auth:** Required (Admin only)

**Example:**
```bash
DELETE /users/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "message": "User user@example.com has been deleted successfully"
}
```

**Notes:**
- Admin users cannot be deleted (safety feature)
- Returns 400 Bad Request if attempting to delete an admin

---

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User with ID {id} not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already in use"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Cannot delete admin users"
}
```

---

## Security Features

1. **Admin-Only Access**: All endpoints require admin authentication
2. **JWT Authentication**: Uses Bearer token authentication
3. **Password Hashing**: Passwords are automatically hashed with bcrypt
4. **Data Sanitization**: Sensitive fields (password, refreshToken) are excluded from responses
5. **Admin Protection**: Prevents deletion of admin users
6. **Email Validation**: Ensures email uniqueness when updating

---

## Testing with Postman

Import the `ecommerce-api-collection.json` file into Postman. The collection includes all Users endpoints with example requests.

### Setup:
1. Register an admin user or login with existing admin credentials
2. The access token will be automatically saved to the environment
3. All Users endpoints will use this token for authentication

### Example Flow:
1. **Login as Admin**
   ```
   POST /auth/login
   Body: { "email": "admin@example.com", "password": "admin123" }
   ```

2. **Get All Users**
   ```
   GET /users
   ```

3. **Filter Users by Role**
   ```
   GET /users?role=DELIVERY
   ```

4. **Promote User to Delivery Person**
   ```
   PATCH /users/{userId}/role
   Body: { "role": "DELIVERY" }
   ```

5. **Get User Statistics**
   ```
   GET /users/stats
   ```

---

## Module Structure

```
users/
├── dto/
│   ├── update-user.dto.ts      # DTO for updating user info
│   ├── update-role.dto.ts      # DTO for changing user role
│   └── user-response.dto.ts    # Response DTO (sanitized)
├── users.controller.ts         # REST API endpoints
├── users.service.ts            # Business logic
├── users.module.ts             # Module definition
└── README.md                   # This file
```

---

## Dependencies

- `@nestjs/common` - NestJS core functionality
- `@nestjs/swagger` - API documentation
- `@prisma/client` - Database ORM
- `bcrypt` - Password hashing
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation

---

## Future Enhancements

- [ ] User activity logs
- [ ] Bulk user operations
- [ ] User export (CSV/Excel)
- [ ] Advanced filtering and search
- [ ] User suspension/activation
- [ ] Password reset functionality
- [ ] Email notifications on role changes
