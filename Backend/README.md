# Hostel Complaint Management System - Backend

Production-grade MERN backend application for managing hostel complaints with role-based access control, comprehensive validation, and industry-standard security practices.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

## Features

### Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- HTTP-only secure cookies
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- User account management
- Automatic token refresh

### Complaint Management

- Create, read, update, delete complaints (soft delete)
- Multiple complaint statuses and priorities
- Category-based organization
- File attachment support
- Complaint assignment to maintenance staff
- Admin remarks and rejection reasons
- Pagination and filtering
- Advanced search capabilities

### Admin Dashboard

- System-wide statistics and analytics
- User management
- Complaint assignment and tracking
- Status monitoring
- User activation/deactivation

### Security

- Helmet.js for HTTP headers
- CORS protection with configurable origin
- NoSQL injection prevention with mongoose-sanitize
- XSS protection with xss-clean
- Rate limiting
- Input validation with Zod
- HTTP-only cookies

### Logging

- Request logging with Morgan
- Error logging with Winston-style logger
- File-based log persistence

## Architecture

### Project Structure

```
src/
├── config/
│   ├── db.js                 # Database connection
│   ├── env.js               # Environment configuration
│   └── cloudinary.js        # Cloudinary setup
├── controllers/
│   ├── auth.controller.js    # Authentication handlers
│   ├── complaint.controller.js
│   ├── user.controller.js
│   └── admin.controller.js
├── services/
│   ├── auth.service.js       # Authentication business logic
│   ├── complaint.service.js
│   └── user.service.js
├── routes/
│   ├── auth.routes.js
│   ├── complaint.routes.js
│   └── user.routes.js
├── middlewares/
│   ├── auth.middleware.js    # JWT verification
│   ├── error.middleware.js   # Error handling
│   ├── role.middleware.js    # RBAC
│   ├── upload.middleware.js  # File upload
│   └── validate.middleware.js
├── validators/
│   ├── auth.validator.js
│   └── complaint.validator.js
├── models/
│   ├── User.js
│   ├── Complaint.js
│   └── RefreshToken.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── logger.js
├── constants/
│   └── index.js
├── uploads/
│   └── temp/
├── app.js                    # Express app configuration
└── index.js                  # Entry point
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: Helmet, mongoose-sanitize, xss-clean, express-rate-limit
- **File Uploads**: Multer, Cloudinary
- **Logging**: Morgan
- **Password Hashing**: bcryptjs
- **Dev Tools**: Nodemon

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Steps

1. **Clone and navigate to backend**

   ```bash
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   MONGO_URI=mongodb://localhost:27017/hostel_complaint_system
   JWT_SECRET=your_secret_key_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   NODE_ENV=development
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register

```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student",
  "roomNumber": "101",
  "hostelBlock": "A"
}

Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Refresh Token

```
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Logout

```
POST /auth/logout
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Current User

```
GET /auth/me
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": { ... }
}
```

### Complaint Endpoints

#### Create Complaint

```
POST /complaints
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Broken tap in bathroom",
  "description": "The tap in the bathroom is leaking continuously",
  "category": "Plumbing",
  "priority": "High",
  "hostelBlock": "A",
  "roomNumber": "101"
}

Response: 201
{
  "success": true,
  "message": "Complaint created successfully",
  "data": { ... }
}
```

#### Get My Complaints

```
GET /complaints/my?page=1&limit=10&status=Pending
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "message": "Complaints fetched successfully",
  "data": {
    "complaints": [ ... ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

#### Get All Complaints (Admin/Warden)

```
GET /complaints/all?status=Pending&priority=High
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "data": {
    "complaints": [ ... ],
    "pagination": { ... }
  }
}
```

#### Get Complaint by ID

```
GET /complaints/:id
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "data": { ... }
}
```

#### Update Complaint (Admin/Warden/Maintenance)

```
PUT /complaints/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "In Progress",
  "assignedTo": "user_id",
  "adminRemarks": "Will be fixed tomorrow"
}

Response: 200
{
  "success": true,
  "message": "Complaint updated successfully",
  "data": { ... }
}
```

#### Delete Complaint (Admin)

```
DELETE /complaints/:id
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "message": "Complaint deleted successfully"
}
```

#### Get Complaint Statistics

```
GET /complaints/stats
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "data": {
    "total": 25,
    "pending": 10,
    "assigned": 5,
    "inProgress": 6,
    "resolved": 3,
    "rejected": 1
  }
}
```

### User Endpoints

#### Get Current User

```
GET /users/me
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "data": { ... }
}
```

#### Get All Users (Admin)

```
GET /users?page=1&limit=10&role=student
Authorization: Bearer <accessToken>

Response: 200
{
  "success": true,
  "data": {
    "users": [ ... ],
    "pagination": { ... }
  }
}
```

#### Update Profile

```
PATCH /users/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "roomNumber": "102"
}

Response: 200
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

## Project Structure Details

### Models

**User**

- Name, Email (unique), Password (hashed)
- Role: student, admin, warden, maintenance
- Room Number, Hostel Block
- Avatar URL
- Active status, Last login timestamp
- Methods: generateAccessToken(), generateRefreshToken(), isPasswordCorrect()

**Complaint**

- Title, Description
- Category: Plumbing, Electricity, Cleaning, Furniture, Other
- Priority: Low, Medium, High
- Status: Pending, Assigned, In Progress, Resolved, Rejected
- Created By, Assigned To (references User)
- Hostel Block, Room Number
- Attachments (array of URLs)
- Admin Remarks, Rejection Reason
- Soft delete support
- Timestamps and indexes for performance

**RefreshToken**

- Token (unique)
- User reference
- Expiration date (auto-delete with TTL index)
- Revocation status

## Security Features

1. **JWT Authentication**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Tokens stored in HTTP-only cookies

2. **Password Security**
   - Bcryptjs hashing with salt rounds
   - Minimum 6 characters with uppercase and numbers

3. **CORS**
   - Configurable origin
   - Credentials enabled
   - Specific HTTP methods allowed

4. **Rate Limiting**
   - 100 requests per 15 minutes
   - Configurable per environment

5. **Input Validation**
   - Zod schema validation
   - Email, URL, and type validation
   - File size and type restrictions

6. **NoSQL Injection Prevention**
   - mongoose-sanitize removes $ and . operators

7. **XSS Protection**
   - xss-clean removes dangerous characters

8. **Security Headers**
   - Helmet.js protection

## Validation

All endpoints include comprehensive validation:

- **Auth**: Email format, password strength, required fields
- **Complaints**: Title length, description length, category enum, ID format
- **Users**: Email uniqueness, role validity, field presence

Validation happens at:

1. Route middleware (Zod schemas)
2. Model level (Mongoose validators)
3. Service level (business logic validation)

## Error Handling

Centralized error handling with consistent response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Database Schema

### Indexes

- User: email (unique), role, isActive, createdAt
- Complaint: createdBy, assignedTo + status, category + status, isDeleted
- RefreshToken: user (for queries), expiresAt (TTL index)

### Relationships

- Complaint.createdBy → User.\_id
- Complaint.assignedTo → User.\_id
- RefreshToken.user → User.\_id

## Deployment Guide

### Environment Setup

1. Set NODE_ENV=production
2. Configure strong JWT secrets
3. Update CORS_ORIGIN to production URL
4. Set up MongoDB Atlas or production MongoDB instance
5. Configure Cloudinary credentials
6. Use environment-specific database

### Performance Considerations

- Database indexes on frequently queried fields
- Pagination support for list endpoints
- Query optimization with select()
- Lean queries for read-only operations

## Contributing

1. Follow existing code style and structure
2. Add validation for new endpoints
3. Write comprehensive error handling
4. Document API changes
5. Test with different user roles

---

**Version**: 2.0.0  
**Last Updated**: 2024
