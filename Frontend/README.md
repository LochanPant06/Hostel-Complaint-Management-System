# Hostel Complaint Management System - Frontend

Modern React-based frontend for the Hostel Complaint Management System with role-based dashboards, real-time complaint management, and advanced filtering.

## Features

- **User Authentication**: Register, login, logout with secure JWT tokens
- **Student Dashboard**: View personal complaints, submit new complaints, track status
- **Admin Dashboard**: View all complaints, assign to staff, update status, manage users
- **Role-Based Access**: Different UI for students, admins, wardens, and maintenance staff
- **Real-Time Updates**: Dynamic complaint status tracking
- **Search & Filter**: Advanced filtering by status, priority, category
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **State Management**: Zustand for simple and efficient state management

## Tech Stack

- **Frontend Framework**: React 19
- **Routing**: React Router v7
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components (Login, Dashboard, etc.)
├── layouts/            # Layout components (MainLayout, AuthLayout)
├── routes/             # Route components (ProtectedRoute)
├── services/           # API service functions
├── store/              # Zustand stores (authStore)
├── hooks/              # Custom React hooks (useAuth)
├── utils/              # Utility functions (helpers, apiClient)
├── assets/             # Static assets
├── App.jsx             # Main App component
├── main.jsx            # React entry point
└── index.css           # Tailwind CSS configuration
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Navigate to frontend directory**

   ```bash
   cd Frontend
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
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

## Running the Application

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## API Integration

### Authentication Flow

1. **Register**
   - User fills registration form
   - Data sent to `/auth/register`
   - Tokens stored in localStorage
   - User redirected to dashboard

2. **Login**
   - User enters credentials
   - Data sent to `/auth/login`
   - Tokens received and stored
   - User redirected based on role

3. **Token Refresh**
   - Automatic token refresh on expiry
   - Interceptor handles refresh token exchange
   - Seamless re-authentication

4. **Logout**
   - User clicks logout
   - Tokens cleared from storage
   - User redirected to login

### API Endpoints Used

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/refresh-token` - Refresh access token

#### Complaints

- `POST /complaints` - Create complaint
- `GET /complaints/my` - Get user's complaints
- `GET /complaints/all` - Get all complaints (admin)
- `GET /complaints/:id` - Get complaint details
- `PUT /complaints/:id` - Update complaint
- `DELETE /complaints/:id` - Delete complaint

#### Users

- `GET /users/me` - Get current user profile
- `GET /users` - Get all users (admin)
- `PATCH /users/profile` - Update profile

## Component Structure

### Pages

- **Login**: User authentication page
- **Register**: User registration page
- **StudentDashboard**: Student's complaint dashboard
- **AdminDashboard**: Admin's management dashboard
- **SubmitComplaint**: Form for submitting new complaints

### Components

- **Navbar**: Navigation bar with user menu
- **ComplaintCard**: Display complaint in list/grid
- **Dashboard**: Main dashboard container

## State Management with Zustand

### AuthStore

```javascript
import { useAuthStore } from "./store/authStore";

// Usage in components
const { user, login, logout, isAuthenticated } = useAuthStore();
```

**State**:

- `user`: Current authenticated user object
- `accessToken`: JWT access token
- `refreshToken`: Refresh token
- `isLoading`: Loading state
- `error`: Error messages

**Methods**:

- `login(email, password)` - Authenticate user
- `register(userData)` - Register new user
- `logout()` - Clear authentication
- `setUser(user)` - Set user object
- `setTokens(accessToken, refreshToken)` - Set tokens
- `isAuthenticated()` - Check authentication status

## Custom Hooks

### useAuth

```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

Provides easy access to authentication state and methods from AuthStore.

## Utility Functions

### API Client

Axios instance with automatic token injection and refresh logic:

```javascript
import apiClient from "./utils/apiClient";

// Requests automatically include auth token
apiClient.get("/complaints/my");
```

**Features**:

- Auto token injection from localStorage
- Automatic token refresh on 401 response
- Error handling and logging

### Helpers

```javascript
import {
  formatDate,
  getStatusColor,
  validateEmail,
  debounce,
} from "./utils/helpers";
```

Available utilities:

- `formatDate()` - Format dates
- `formatTime()` - Format times
- `getStatusColor()` - Get badge color for status
- `getPriorityColor()` - Get badge color for priority
- `validateEmail()` - Email validation
- `validatePassword()` - Password validation
- `truncateText()` - Truncate long text
- `debounce()` - Debounce function calls

## Environment Variables

Create `.env` file in Frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Routes

### Protected Routes

All dashboard and management routes are protected:

- Only authenticated users can access
- Role-based access control enforced
- Unauthorized users redirected to login

### Role-Based Routes

**Student Routes**:

- `/dashboard` - View personal complaints
- `/submit-complaint` - Submit new complaint

**Admin/Warden/Maintenance Routes**:

- `/admin` - Management dashboard

## Error Handling

### API Errors

```javascript
try {
  await complaintService.createComplaint(data);
} catch (error) {
  const message = error.response?.data?.message;
  // Handle error
}
```

### Authentication Errors

- 401: Automatic token refresh or redirect to login
- 403: Redirect to unauthorized page
- Other errors: Display error message to user

## Performance Optimization

- Code splitting with React Router
- Lazy loading components
- Debounced search/filter functions
- Memoized components where necessary
- Efficient state management with Zustand

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - One component per file
   - Use meaningful names

2. **State Management**
   - Use Zustand for global state
   - Lift state up when needed
   - Keep local state minimal

3. **API Calls**
   - Use service functions in `services/`
   - Handle errors gracefully
   - Show loading states

4. **Styling**
   - Use Tailwind utility classes
   - Custom classes in `index.css` with `@layer`
   - Avoid inline styles

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup for Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag dist folder to Netlify
```

## Contributing

1. Follow component structure
2. Use meaningful commit messages
3. Test authentication flows
4. Ensure responsive design
5. Handle all error cases

---

**Version**: 2.0.0  
**Last Updated**: 2024
