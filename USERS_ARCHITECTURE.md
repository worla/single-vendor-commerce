# Users Module Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Request                          │
│                    (Admin with JWT Token)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      UsersController                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Guards:                                                  │  │
│  │  • JwtAuthGuard  → Validates JWT token                   │  │
│  │  • RolesGuard    → Checks for ADMIN role                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Endpoints:                                                     │
│  • GET    /users              → findAll()                      │
│  • GET    /users/stats        → getStats()                     │
│  • GET    /users/:id          → findOne()                      │
│  • PUT    /users/:id          → update()                       │
│  • PATCH  /users/:id/role     → updateRole()                   │
│  • DELETE /users/:id          → remove()                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        UsersService                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Business Logic:                                          │  │
│  │  • User validation                                        │  │
│  │  • Email uniqueness check                                 │  │
│  │  • Password hashing (bcrypt)                              │  │
│  │  • Data sanitization                                      │  │
│  │  • Admin protection                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PrismaService                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Database Operations:                                     │  │
│  │  • user.findMany()                                        │  │
│  │  • user.findUnique()                                      │  │
│  │  • user.update()                                          │  │
│  │  • user.delete()                                          │  │
│  │  • user.count()                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  users table:                                             │  │
│  │  • id (UUID, Primary Key)                                 │  │
│  │  • email (Unique)                                         │  │
│  │  • password (Hashed)                                      │  │
│  │  • firstName, lastName                                    │  │
│  │  • phone                                                  │  │
│  │  • role (ADMIN | BUYER | DELIVERY)                        │  │
│  │  • refreshToken                                           │  │
│  │  • createdAt, updatedAt                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Get All Users
```
Client → Controller → Service → Prisma → Database
                                   ↓
                            Sanitize Data
                                   ↓
Client ← Controller ← Service ← Response
```

### 2. Update User
```
Client → Controller → Service → Validate Email
                         ↓
                    Hash Password (if provided)
                         ↓
                    Prisma → Database
                         ↓
                    Sanitize Data
                         ↓
Client ← Controller ← Service ← Response
```

### 3. Change Role
```
Client → Controller → Service → Validate Role Enum
                         ↓
                    Prisma → Database
                         ↓
                    Sanitize Data
                         ↓
Client ← Controller ← Service ← Response
```

### 4. Delete User
```
Client → Controller → Service → Check if Admin
                         ↓
                    (Prevent if Admin)
                         ↓
                    Prisma → Database
                         ↓
Client ← Controller ← Service ← Success Message
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│         Layer 1: JWT Authentication         │
│  Validates token and extracts user info     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│      Layer 2: Role-Based Authorization      │
│  Ensures user has ADMIN role                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Layer 3: DTO Validation             │
│  Validates request body structure           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│       Layer 4: Business Logic Checks        │
│  • Email uniqueness                         │
│  • Admin protection                         │
│  • User existence                           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Layer 5: Data Sanitization          │
│  Remove sensitive fields from response      │
└─────────────────────────────────────────────┘
```

## Module Dependencies

```
UsersModule
    │
    ├─── PrismaModule (Database access)
    │
    ├─── AuthModule (Guards & Decorators)
    │    ├─── JwtAuthGuard
    │    ├─── RolesGuard
    │    └─── Roles Decorator
    │
    └─── Common Modules
         ├─── class-validator (DTO validation)
         ├─── class-transformer (DTO transformation)
         ├─── bcrypt (Password hashing)
         └─── @nestjs/swagger (API documentation)
```

## Error Handling Flow

```
Request
   │
   ├─── No Token? → 401 Unauthorized
   │
   ├─── Invalid Token? → 401 Unauthorized
   │
   ├─── Not Admin? → 403 Forbidden
   │
   ├─── Invalid DTO? → 400 Bad Request
   │
   ├─── User Not Found? → 404 Not Found
   │
   ├─── Email Exists? → 409 Conflict
   │
   ├─── Delete Admin? → 400 Bad Request
   │
   └─── Success → 200 OK / Response
```

## API Response Structure

### Success Response
```json
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
```

### Error Response
```json
{
  "statusCode": 404,
  "message": "User with ID {id} not found",
  "error": "Not Found"
}
```

## Statistics Endpoint Flow

```
GET /users/stats
       │
       ▼
┌──────────────────────┐
│  Parallel Queries:   │
│  • Total Users       │
│  • Buyers Count      │
│  • Delivery Count    │
│  • Admins Count      │
└──────────┬───────────┘
           │
           ▼
    Aggregate Results
           │
           ▼
    Return Statistics
```

## Integration Points

```
┌─────────────────────────────────────────────┐
│            Users Module                     │
└──────────────┬──────────────────────────────┘
               │
               ├─── Auth Module (Authentication)
               │
               ├─── Orders Module (User orders)
               │
               ├─── Cart Module (User carts)
               │
               └─── Future: Notifications, Activity Logs
```
