# Hostel Complaint Management System - MERN Stack

A production-grade, scalable MERN (MongoDB, Express, React, Node.js) application for managing hostel complaints with role-based access control, real-time updates, and modern architecture patterns.

## 🌟 Project Overview

This is a complete refactoring of a hostel complaint management system into an industry-standard production-ready application following the architectural patterns of professional MERN projects like Chai Backend.

### Key Improvements

- ✅ Scalable folder structure with separation of concerns
- ✅ Industry-standard JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC) with 4 roles
- ✅ Comprehensive validation using Zod
- ✅ Centralized error handling and standardized API responses
- ✅ Service layer pattern for business logic
- ✅ Security best practices (Helmet, Rate limiting, CORS, XSS protection)
- ✅ Advanced logging system
- ✅ Modern frontend with Zustand state management
- ✅ Protected routes and role-based UI
- ✅ Responsive design with Tailwind CSS

## 📁 Project Structure

```
hostel-complaint-system/
├── Backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Custom middlewares
│   │   ├── validators/        # Zod validation schemas
│   │   ├── models/            # MongoDB schemas
│   │   ├── utils/             # Utility functions
│   │   ├── constants/         # App constants
│   │   ├── app.js             # Express app configuration
│   │   └── index.js           # Entry point
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── Frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── layouts/           # Layout wrappers
│   │   ├── routes/            # Route components
│   │   ├── services/          # API services
│   │   ├── store/             # Zustand stores
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   ├── assets/            # Static assets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
│
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd Backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev
```

**Backend runs on**: `http://localhost:5000`

### Frontend Setup

```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

## 🔐 Authentication & Authorization

### Roles

1. **Student**: Can create complaints, view own complaints
2. **Admin**: Full system access, user management
3. **Warden**: Can view and assign complaints
4. **Maintenance**: Can update complaint status

### Authentication Flow

- User registration/login
- JWT access token (15 minutes)
- Refresh token stored in HTTP-only cookies (7 days)
- Automatic token refresh on expiry
- Secure logout with token revocation

## 📋 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
GET    /auth/me
```

### Complaint Endpoints

```
POST   /complaints                  # Create complaint (Students)
GET    /complaints/my               # Get my complaints (Students)
GET    /complaints/all              # Get all complaints (Admin/Warden)
GET    /complaints/:id              # Get complaint details
PUT    /complaints/:id              # Update complaint (Admin/Warden/Maintenance)
DELETE /complaints/:id              # Delete complaint (Admin)
GET    /complaints/stats            # Get statistics
```

### User Endpoints

```
GET    /users/me                    # Get current user
GET    /users                       # Get all users (Admin)
GET    /users/:id                   # Get user by ID
PATCH  /users/profile               # Update profile
DELETE /users/deactivate            # Deactivate account
```

## 🎨 Frontend Features

### Pages

- **Login**: Secure authentication
- **Register**: New user registration
- **Student Dashboard**: View complaints, statistics
- **Admin Dashboard**: Manage complaints and users
- **Submit Complaint**: Create new complaint form

### State Management

- Zustand for global authentication state
- Automatic token persistence
- Seamless token refresh

### API Integration

- Axios with interceptors
- Automatic request/response handling
- Error standardization

## 🔧 Tech Stack

### Backend

| Technology | Purpose          |
| ---------- | ---------------- |
| Express.js | Web framework    |
| MongoDB    | Database         |
| Mongoose   | ODM              |
| JWT        | Authentication   |
| Bcryptjs   | Password hashing |
| Zod        | Validation       |
| Helmet     | Security headers |
| Morgan     | Logging          |
| Multer     | File uploads     |
| Cloudinary | Image hosting    |

### Frontend

| Technology   | Purpose          |
| ------------ | ---------------- |
| React 19     | UI library       |
| Vite         | Build tool       |
| React Router | Navigation       |
| Zustand      | State management |
| Axios        | HTTP client      |
| Tailwind CSS | Styling          |
| ESLint       | Code quality     |

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hostel_complaint_system
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_NAME=optional
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 🔒 Security Features

✅ HTTP-only cookies for tokens  
✅ CORS with configurable origin  
✅ Rate limiting (100 req/15 min)  
✅ NoSQL injection prevention  
✅ XSS protection  
✅ Helmet.js security headers  
✅ Password hashing with bcryptjs  
✅ Token refresh rotation  
✅ Soft delete for data integrity  
✅ Input validation with Zod

## 📊 Database Schema

### User Schema

- ID, Name, Email (unique)
- Password (hashed)
- Role (student/admin/warden/maintenance)
- Room Number, Hostel Block
- Avatar URL
- Active Status
- Last Login timestamp
- Timestamps (created, updated)

### Complaint Schema

- Title, Description
- Category (Plumbing/Electricity/Cleaning/Furniture/Other)
- Priority (Low/Medium/High)
- Status (Pending/Assigned/In Progress/Resolved/Rejected)
- Created By, Assigned To
- Hostel Block, Room Number
- Attachments (file URLs)
- Admin Remarks, Rejection Reason
- Timestamps
- Soft delete support

### RefreshToken Schema

- Token
- User reference
- Expiration date (TTL index)
- Revocation status

## 🚀 Deployment

### Backend Deployment (Vercel, Railway, Render)

```bash
# Build
npm install

# Environment variables configured in deployment platform
# Port auto-configured
```

### Frontend Deployment (Vercel, Netlify)

```bash
npm install
npm run build
# Deploy dist/ folder
```

## 📚 Documentation

- [Backend Documentation](Backend/README.md)
- [Frontend Documentation](Frontend/README.md)

## 🤝 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

## 🎯 Features Implemented

### Core Features

- ✅ User authentication (register/login/logout)
- ✅ JWT with refresh token rotation
- ✅ Complaint creation and management
- ✅ Role-based access control
- ✅ Admin dashboard
- ✅ Student dashboard
- ✅ Complaint tracking
- ✅ User management

### Advanced Features

- ✅ Pagination on list endpoints
- ✅ Advanced filtering and search
- ✅ Complaint statistics
- ✅ File upload support
- ✅ Soft delete for data integrity
- ✅ Comprehensive logging
- ✅ Rate limiting
- ✅ Input validation

### Security Features

- ✅ Password hashing
- ✅ JWT tokens
- ✅ CORS protection
- ✅ XSS prevention
- ✅ NoSQL injection prevention
- ✅ Rate limiting
- ✅ Security headers

## 📈 Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for list endpoints
- Lean queries for read-only operations
- Debounced search in frontend
- Code splitting in React Router
- Efficient state management

## 🔄 Development Workflow

1. **Backend Development**

   ```bash
   cd Backend
   npm run dev
   ```

2. **Frontend Development**

   ```bash
   cd Frontend
   npm run dev
   ```

3. **Both Simultaneously**
   - Use two terminals
   - Or use a tool like `concurrently`

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB connection
- Verify .env variables
- Check port availability
- Review error logs

### Frontend can't connect to backend

- Verify VITE_API_BASE_URL in .env
- Check backend is running
- Check CORS configuration
- Verify network connectivity

### Authentication issues

- Clear localStorage
- Check token expiration
- Verify JWT secrets
- Check browser console for errors

## 📝 Code Style & Best Practices

- **ES Modules**: Consistent use throughout
- **Error Handling**: Centralized with ApiError
- **Validation**: Zod schemas on all endpoints
- **Logging**: Structured logging with context
- **Comments**: Only where necessary
- **Naming**: Clear, descriptive names
- **DRY**: No code duplication
- **SOLID**: Single responsibility principle

## 🤝 Contributing

1. Follow existing code structure
2. Add validation for new endpoints
3. Write error handling
4. Test with different roles
5. Update documentation

## 📜 License

ISC

## 📞 Support

For issues or questions:

1. Check the documentation
2. Review error messages carefully
3. Check database connection
4. Verify environment variables
5. Check browser console

---

**Version**: 2.0.0  
**Status**: Production Ready  
**Last Updated**: 2024
