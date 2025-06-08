# Migration Guide: Spring Boot to Next.js

## Overview

This guide documents the complete migration from Spring Boot backend to Next.js full-stack application for the Gear Shop project.

## Architecture Changes

### Before (Spring Boot + Next.js Frontend)

```
gear-shop-api/      (Spring Boot Backend)
├── src/main/java/
│   └── com/dna/gearshop/
│       ├── controllers/
│       ├── models/
│       ├── services/
│       ├── repositories/
│       └── security/
└── application.properties

gear-shop/          (Next.js Frontend)
├── src/
│   ├── components/
│   ├── pages/
│   └── hooks/
```

### After (Next.js Full-Stack)

```
gear-shop/          (Next.js Full-Stack)
├── src/
│   ├── app/api/    (API Routes - Replaces Spring Boot)
│   ├── lib/        (Database & Utilities)
│   ├── types/      (TypeScript Interfaces)
│   ├── contexts/   (React Contexts)
│   ├── components/
│   └── middleware.ts
```

## Core Components Migrated

### 1. Database Layer

**Spring Boot (Before):**

- JPA/Hibernate with MySQL
- Repository pattern
- Entity annotations

**Next.js (After):**

- `src/lib/database.ts` - MySQL2 connection pool
- `src/lib/password.ts` - BCrypt utilities
- Direct SQL queries with prepared statements

```typescript
// Database singleton with connection pooling
export const db = Database.getInstance();
await db.query("SELECT * FROM users WHERE email = ?", [email]);
```

### 2. Authentication & JWT

**Spring Boot (Before):**

- Spring Security
- JWT filters
- BCrypt password encoding

**Next.js (After):**

- `src/lib/jwt.ts` - JWT utilities
- `src/middleware.ts` - Authentication middleware
- `src/contexts/AuthContext.tsx` - React auth state

```typescript
// JWT token generation and verification
const tokenPair = jwtService.generateTokenPair(username, roles);
const payload = jwtService.verifyToken(token);
```

### 3. API Endpoints

| Spring Boot Controller          | Next.js API Route             | Functionality       |
| ------------------------------- | ----------------------------- | ------------------- |
| `AuthController.login()`        | `/api/auth/login/route.ts`    | User authentication |
| `AuthController.signup()`       | `/api/auth/register/route.ts` | User registration   |
| `AuthController.refreshToken()` | `/api/auth/refresh/route.ts`  | Token refresh       |
| `AuthController.getProfile()`   | `/api/auth/me/route.ts`       | User profile        |
| Custom brands endpoint          | `/api/brands/logos/route.ts`  | Brand logos from DB |

### 4. Data Models & Types

**Spring Boot (Before):**

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ...
}
```

**Next.js (After):**

```typescript
// src/types/auth.ts
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  // ...
}
```

## Migration Steps Completed

### 1. Dependencies Added

```json
{
  "dependencies": {
    "mysql2": "^3.11.4",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.7",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### 2. Environment Configuration

```bash
# .env.example
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=gear_shop

JWT_SECRET=ducaan20202038djfndfjcuhfbbhsddaihocthuyloi2025doaantotnghiep
JWT_EXPIRATION=604800000
JWT_REFRESH_EXPIRATION=604800000
```

### 3. Database Connection

- Singleton pattern for connection management
- Connection pooling for performance
- Prepared statements for security
- Helper functions for common queries

### 4. Authentication Flow

- JWT token-based authentication
- Refresh token mechanism
- Middleware for route protection
- React context for state management

### 5. API Route Structure

- RESTful endpoints matching Spring Boot controllers
- Consistent error handling
- TypeScript interfaces for type safety
- Proper HTTP status codes

## Database Schema

The existing MySQL database remains unchanged:

```sql
-- Users table (from Spring Boot)
users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name NVARCHAR(255),
  email NVARCHAR(100) UNIQUE,
  password_hash NVARCHAR(255),
  phone_number NVARCHAR(20),
  address NVARCHAR(500),
  role VARCHAR(100),
  created_at DATETIME
)

-- Brands table (with base64 logos)
brands (
  brand_id INT PRIMARY KEY AUTO_INCREMENT,
  brand_name NVARCHAR(255),
  brand_code VARCHAR(50),
  logo_code LONGTEXT,
  website NVARCHAR(255)
)
```

## Key Features Maintained

1. **User Authentication**

   - Login/Register functionality
   - JWT token management
   - Password hashing with BCrypt
   - Role-based access control

2. **Brand Management**

   - Base64 logo storage
   - Database-driven brand display
   - Real-time brand fetching

3. **Security**
   - Request validation
   - SQL injection prevention
   - CORS configuration
   - Protected routes

## Testing the Migration

### 1. Install Dependencies

```bash
cd gear-shop
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your database credentials
```

### 3. Verify Database Connection

- Ensure MySQL is running
- Database `gear_shop` exists
- Tables are properly populated

### 4. Start Application

```bash
npm run dev
```

### 5. Test API Endpoints

```bash
# Test brand logos
curl http://localhost:3000/api/brands/logos

# Test user registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"Test123!"}'

# Test user login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"Test123!"}'
```

## Performance Improvements

1. **Connection Pooling**: MySQL2 connection pool vs single connections
2. **Caching**: API responses cached with appropriate headers
3. **Middleware**: Efficient route protection at edge level
4. **Type Safety**: Full TypeScript coverage prevents runtime errors

## Security Enhancements

1. **Prepared Statements**: All SQL queries use parameterized statements
2. **Input Validation**: Request validation at API level
3. **Token Security**: Secure JWT implementation with refresh tokens
4. **CORS**: Proper cross-origin resource sharing configuration

## Next Steps

1. **Test thoroughly**: Verify all functionality works as expected
2. **Deploy**: Update deployment configuration for single app
3. **Monitor**: Set up logging and monitoring for the new architecture
4. **Optimize**: Profile and optimize database queries and API performance

## Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check MySQL service is running
   - Verify credentials in .env.local
   - Ensure database exists

2. **JWT Token Issues**

   - Check JWT_SECRET is set correctly
   - Verify token expiration settings
   - Clear browser localStorage if needed

3. **Type Errors**
   - Ensure all imports are correct
   - Check TypeScript configuration
   - Verify interface definitions match data

## Cleanup

After successful migration, you can:

1. Archive the `gear-shop-api/` folder
2. Update deployment scripts
3. Remove Java/Spring Boot dependencies
4. Update documentation

The migration is now complete! The application runs entirely on Next.js with full-stack capabilities.
