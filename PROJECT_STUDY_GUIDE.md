# Hostel Complaint Management System Study Guide

This guide is based on the actual repository code, not just the README files.

## 1. Project structure first

```text
hostel-complaint-system/
|- README.md
|- .gitignore
|- PROJECT_STUDY_GUIDE.md
|- Backend/
|  |- package.json
|  |- .env / .env.example
|  |- server.js                    # old backend entry, legacy
|  |- config/, middleware/, models/, routes/   # old CommonJS code, legacy
|  |- src/                         # active backend code
|  |  |- index.js                  # real backend entry
|  |  |- app.js                    # express app setup
|  |  |- config/                   # env, db, cloudinary
|  |  |- constants/                # enums and shared constants
|  |  |- controllers/              # request handlers
|  |  |- middlewares/              # auth, role, errors, validation, upload
|  |  |- models/                   # mongoose schemas
|  |  |- routes/                   # API endpoints
|  |  |- services/                 # business logic
|  |  |- utils/                    # helper classes/functions
|  |  |- validators/               # zod schemas
|  |  |- uploads/temp/.gitkeep
|  |- logs/                        # generated server logs
|- Frontend/
|  |- package.json
|  |- index.html
|  |- vite.config.js
|  |- tailwind.config.js
|  |- postcss.config.js
|  |- src/
|  |  |- main.jsx                  # React entry
|  |  |- App.jsx                   # app routes
|  |  |- index.css                 # Tailwind based styling system
|  |  |- components/               # reusable UI blocks
|  |  |- context/                  # old auth context, legacy
|  |  |- hooks/                    # auth hook
|  |  |- layouts/                  # AuthLayout and MainLayout
|  |  |- pages/                    # screens
|  |  |- routes/                   # old ProtectedRoute, unused
|  |  |- services/                 # API wrappers
|  |  |- store/                    # Zustand auth store
|  |  |- utils/                    # axios client and helper functions
|  |  |- assets/                   # leftover Vite asset
|  |- public/vite.svg
|  |- generated log files
```

## 2. What this project does

### Simple English

This project lets hostel students register, log in, submit complaints like plumbing or electricity issues, and track complaint status. Staff or admins can view complaints and update them.

### Technical

It is a MERN application:

- MongoDB stores users, complaints, and refresh tokens.
- Express exposes REST APIs under `/api/v1`.
- React provides the UI.
- Node.js runs the backend server.
- JWT access and refresh tokens handle authentication.

### How to say it in interview

"I built a full-stack MERN complaint management system for hostels. Students can register, submit and track complaints, while admins or staff can review and update complaint status. I separated the backend into routes, controllers, services, models, and middleware, and I used React with Zustand for the frontend auth state."

## 3. End-to-end flow

### 3.1 Request-response cycle

Simple English:
The user clicks something in the browser. The frontend sends an API request. The backend checks the request, talks to MongoDB, and sends back JSON. The frontend shows that data on screen.

Technical:
`Frontend/src/pages/*` calls functions from `Frontend/src/services/api.js`. Those functions use `Frontend/src/utils/apiClient.js`, which sends HTTP requests to `Backend/src/routes/*`. Express routes call controllers, controllers call services, services call Mongoose models, MongoDB returns data, then controllers wrap it in `ApiResponse` and send JSON back.

Interview:
"The request starts in a page component, goes through my Axios client, reaches an Express route, then flows to a controller and service layer. The service talks to MongoDB through Mongoose, and the response comes back as a standardized JSON object."

### 3.2 Frontend flow

Simple English:
React shows pages like login, register, dashboard, and complaint detail. It keeps auth information in a global auth store and keeps page data like complaint lists in local page state.

Technical:
`main.jsx` mounts `App.jsx`. `App.jsx` checks auth state using `useAuth()`. Based on `user.role`, it shows student routes or admin routes. Pages call `complaintService` or auth store methods. Shared UI comes from `components/`, while layouts wrap pages in consistent navigation.

Interview:
"On the frontend I used React Router for route-level navigation, Zustand for auth state, local component state for page-specific data, and an Axios instance with interceptors for token handling."

### 3.3 Backend flow

Simple English:
The backend receives a request, runs security and validation checks, then executes the main work and returns the result.

Technical:
`src/index.js` connects to MongoDB and starts Express from `src/app.js`. `app.js` sets up security middleware like Helmet, rate limiting, CORS, JSON parsing, cookie parsing, mongo sanitize, and XSS cleaning. Then route modules mount auth, complaint, and user APIs.

Interview:
"I structured the backend so that the entry file boots the app after the database connection succeeds. The app file configures middleware and mounts versioned API routes."

### 3.4 Middleware flow

Simple English:
Middleware is a checkpoint system. Before a request reaches the main logic, the app can log it, validate it, check login, check role, or handle errors.

Technical:

- Global middleware in `app.js`: `morgan`, `helmet`, rate limit, `cors`, `express.json`, `cookieParser`, `mongoSanitize`, `xssClean`
- Route middleware: `verifyJWT`, `authorizeRoles`, local `validateRequest`
- Final middleware: 404 handler and `errorHandler`

Interview:
"I used middleware heavily. First the app-level middleware handles security and parsing, then route-level middleware checks validation and authorization, and finally a central error middleware formats failures consistently."

### 3.5 Authentication flow

Simple English:
When a user logs in or registers, the backend creates two tokens. The frontend stores them and uses the access token for API calls. If the access token expires, the frontend asks for a new one using the refresh token.

Technical:

1. `POST /api/v1/auth/register` or `POST /api/v1/auth/login`
2. `auth.controller.js` calls `auth.service.js`
3. `User` model hashes passwords and generates JWTs
4. Refresh token is stored in MongoDB in `RefreshToken`
5. Backend also sends tokens as cookies
6. Frontend stores tokens in localStorage and Zustand
7. `apiClient` adds `Authorization: Bearer <token>`
8. On `401`, Axios interceptor calls `/auth/refresh-token`
9. Backend revokes old refresh token and issues a new pair

Interview:
"I used short-lived access tokens and longer-lived refresh tokens. The backend stores refresh tokens in MongoDB and rotates them during refresh. The frontend retries failed requests after getting a new access token through an interceptor."

Important note:
The code says it uses HTTP-only cookies, but it also sends tokens in JSON and stores them in localStorage. That weakens the security story and is something you should mention honestly if asked.

### 3.6 Database operations

Simple English:
MongoDB stores users and complaints as documents. Mongoose defines the shapes of those documents and gives methods like find, create, update, and aggregate.

Technical:

- `User` schema stores name, email, hashed password, role, room number, hostel block, active flag, and last login
- `Complaint` schema stores title, description, category, priority, status, creator, assignee, hostel info, remarks, attachments, and soft-delete flag
- `RefreshToken` schema stores token, user, expiry date, and revocation state
- Services use `findOne`, `create`, `findById`, `findByIdAndUpdate`, `countDocuments`, and `aggregate`

Interview:
"I used Mongoose models for all core entities. Services handle CRUD and also more structured operations like pagination, filtering, soft delete, and complaint statistics through aggregation."

### 3.7 Routing explanation

Simple English:
Routing decides which code runs for which URL.

Technical:

- Frontend routes live in `Frontend/src/App.jsx`
- Backend routes live in `Backend/src/routes/*.routes.js`
- Backend base path is `/api/v1`
- Frontend has role-based route branching

Interview:
"I used React Router on the client for page navigation and Express Router on the server for API grouping. I versioned the backend routes under `/api/v1`."

### 3.8 State management explanation

Simple English:
Some data is needed everywhere, like the logged-in user. That goes into global state. Other data is only needed on one page, like one form or one complaint list, so that stays local.

Technical:

- Global auth state: `Frontend/src/store/authStore.js` with Zustand
- Local page state: `useState` in login, register, dashboards, detail page, and submit page
- There is also an old `AuthContext.jsx`, but the current app does not use it

Interview:
"I kept auth in a lightweight Zustand store and used local component state for page-level concerns like filters, loading, and form input."

### 3.9 Error handling

Simple English:
If something goes wrong, the backend returns a consistent error object and the frontend shows the message.

Technical:

- Backend uses `ApiError`, `asyncHandler`, and `error.middleware.js`
- Validation errors from Zod are converted into a common `errors` array
- Frontend catches `error.response?.data?.message` or fallback messages

Interview:
"I centralized backend error handling so all failures return the same shape. On the frontend I display those messages and keep loading and error states separate."

### 3.10 Deployment concepts

Simple English:
The frontend can be built into static files and hosted separately. The backend runs as a Node server with environment variables and a MongoDB connection.

Technical:

- Frontend: `npm run build` creates a Vite production build
- Backend: start Node process with environment variables
- Configure `MONGO_URI`, JWT secrets, CORS origin, and frontend API base URL
- In development, Vite proxy forwards `/api` to `http://localhost:5000`

Interview:
"The frontend is deployable as static assets, while the backend is a Node service connected to MongoDB. Environment variables control the database, JWT secrets, Cloudinary settings, and allowed CORS origin."

## 4. Folder-by-folder explanation

| Folder | Why it exists | Role and connections |
|---|---|---|
| `Backend/` | Contains server-side code and backend config | Holds both active `src/` code and older legacy CommonJS files |
| `Backend/src/` | Main production-style backend structure | Controllers, services, routes, models, middleware, validators, config |
| `Backend/config/` | Old simple DB config | Used only by legacy `server.js` |
| `Backend/middleware/` | Old auth middleware | Used only by legacy routes |
| `Backend/models/` | Old Mongoose models | Used only by legacy routes |
| `Backend/routes/` | Old route files | Used only by legacy `server.js` |
| `Backend/logs/` | Daily JSON logs | Written by `src/utils/logger.js` |
| `Backend/src/uploads/temp/` | Temp upload storage | Created for Multer; currently not actively used in complaint routes |
| `Frontend/` | Contains React app | Vite, Tailwind, and source code |
| `Frontend/public/` | Static files served directly | Holds `vite.svg`, mostly template leftover |
| `Frontend/src/` | Main frontend code | Pages, components, store, utils, services |
| `Frontend/src/components/` | Reusable UI blocks | Used across dashboards and detail pages |
| `Frontend/src/pages/` | Screen-level components | Main user flows |
| `Frontend/src/layouts/` | Shared page wrappers | Adds navbar/sidebar/auth shell |
| `Frontend/src/store/` | Global state | Zustand auth store |
| `Frontend/src/services/` | API wrapper functions | Calls shared Axios client |
| `Frontend/src/utils/` | Common helpers | Includes Axios client and formatting helpers |
| `Frontend/src/context/` | Old auth context | Looks unused in current app |
| `Frontend/src/routes/` | Old route helper | `ProtectedRoute` exists but is not used by `App.jsx` |

## 5. Database schema explanation

### User

Simple English:
Stores who the user is and what role they have.

Technical:
Defined in `Backend/src/models/User.js`. Important fields: `name`, `email`, `password`, `role`, `roomNumber`, `hostelBlock`, `avatar`, `isActive`, `lastLogin`. It hashes password in a `pre("save")` hook and has methods `isPasswordCorrect`, `generateAccessToken`, and `generateRefreshToken`.

Interview:
"The User model holds identity and role data. I added a pre-save password hash, token generation methods, and email uniqueness and indexing for lookup performance."

### Complaint

Simple English:
Stores a complaint submitted by a student and tracks what happened to it.

Technical:
Defined in `Backend/src/models/Complaint.js`. Important fields: `title`, `description`, `category`, `priority`, `status`, `createdBy`, `assignedTo`, `hostelBlock`, `roomNumber`, `attachments`, `adminRemarks`, `rejectionReason`, `resolvedAt`, `isDeleted`. It uses indexes and a query middleware to hide soft-deleted data from normal `find` queries.

Interview:
"The Complaint model supports categorization, prioritization, assignment, and lifecycle tracking from pending to resolved or rejected."

### RefreshToken

Simple English:
Stores refresh tokens so users can stay logged in without logging in again every few minutes.

Technical:
Defined in `Backend/src/models/RefreshToken.js`. Fields: `token`, `user`, `expiresAt`, `isRevoked`. `expiresAt` uses a TTL index so MongoDB can automatically remove expired records.

Interview:
"I stored refresh tokens in a dedicated collection so I could revoke old tokens and support rotation, instead of trusting stateless JWTs only."

## 6. Packages and libraries used

### Backend packages

| Package | Why used |
|---|---|
| `express` | Web framework for APIs |
| `mongoose` | MongoDB ODM and schema layer |
| `jsonwebtoken` | Create and verify JWTs |
| `bcryptjs` | Hash and compare passwords |
| `cookie-parser` | Read cookies from requests |
| `cors` | Allow frontend-backend communication |
| `dotenv` | Load environment variables |
| `helmet` | Security headers |
| `express-rate-limit` | Basic abuse protection |
| `express-mongo-sanitize` | Removes Mongo injection patterns |
| `xss-clean` | Attempts to reduce script injection |
| `morgan` | HTTP request logging |
| `winston` | Structured logging to file and console |
| `zod` | Request validation |
| `multer` | File upload parsing |
| `cloudinary` | Cloud media hosting |
| `nodemon` | Auto restart during development |

### Frontend packages

| Package | Why used |
|---|---|
| `react` and `react-dom` | Build UI |
| `react-router-dom` | Client-side routing |
| `zustand` | Lightweight auth state management |
| `axios` | API client with interceptors |
| `lucide-react` | Icons |
| `vite` | Frontend dev server and build tool |
| `tailwindcss` | Utility-first styling |
| `postcss` and `autoprefixer` | CSS processing |
| `eslint` and plugins | Code quality checks |
| `@vitejs/plugin-react` | Vite React support |

## 7. File-by-file walkthrough

### 7.1 Root files

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `README.md` | Project-level documentation | Describes architecture, features, routes, schema, and setup for both apps | "I documented the system at repo level so setup and architecture are clear." |
| `.gitignore` | Prevents unwanted files from being committed | Ignores env files, logs, build output, node modules, and editor files | "I kept secrets and generated files out of version control." |

### 7.2 Active backend files in `Backend/src/`

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `Backend/src/index.js` | Real backend entry point | Imports `app`, `connectDB`, `env`, `logger`; connects DB before `app.listen`; handles `unhandledRejection` and `uncaughtException` | "My server only starts after MongoDB connects successfully, and I log fatal process-level errors." |
| `Backend/src/app.js` | Builds the Express application | Adds logging, security middleware, parsers, CORS, health route, API mounts, 404 handler, and final error middleware | "This is the central app composition file where I mount middleware and routes." |
| `Backend/src/config/env.js` | Loads and validates config | Uses `dotenv/config`, parses numeric env vars, validates required secrets and DB URI | "I validate critical env vars at startup so misconfiguration fails fast." |
| `Backend/src/config/db.js` | Connects to MongoDB | Uses Mongoose with `DB_NAME`; logs success or exits on failure | "I isolated database connection logic into a config module." |
| `Backend/src/config/cloudinary.js` | Optional Cloudinary setup | Configures Cloudinary if env vars exist; otherwise warns that uploads are disabled | "I prepared optional cloud media support, though it is not fully wired into complaint APIs yet." |
| `Backend/src/constants/index.js` | Shared enums and constants | Defines DB name, complaint status/priority/category, user roles, HTTP status, token expiry | "I centralized enums and constants to avoid hard-coded values everywhere." |
| `Backend/src/utils/ApiError.js` | Standard backend error object | Custom error class with `statusCode`, `message`, `errors`, `success=false` | "All business and validation errors use a shared error type." |
| `Backend/src/utils/ApiResponse.js` | Standard success response object | Wraps `statusCode`, `data`, `message`, `success` | "I return a consistent response shape to simplify frontend handling." |
| `Backend/src/utils/asyncHandler.js` | Avoids repetitive try/catch | Wraps async route handlers and forwards errors to Express middleware | "This reduces boilerplate in controllers." |
| `Backend/src/utils/logger.js` | Central logging | Creates `logs/` folder, writes daily log files, logs JSON to file and colored output to console | "I added structured logging for debugging and operational visibility." |
| `Backend/src/middlewares/auth.middleware.js` | Protects private APIs | Reads token from cookie or `Authorization` header, verifies JWT, loads user, blocks inactive users | "This middleware authenticates the request and attaches `req.user`." |
| `Backend/src/middlewares/role.middleware.js` | Role-based authorization | `authorizeRoles(...roles)` checks `req.user.role` before allowing access | "This is my RBAC layer." |
| `Backend/src/middlewares/error.middleware.js` | Central error handler | Converts unexpected errors into `ApiError`, logs them, returns consistent JSON | "All backend errors flow through one formatter." |
| `Backend/src/middlewares/validate.middleware.js` | Reusable Zod validation middleware | Parses `body`, `query`, `params`, stores `req.validated`, converts Zod issues to API errors | "This is the reusable validation middleware, although some route files duplicate it locally." |
| `Backend/src/middlewares/upload.middleware.js` | Planned file upload support | Configures Multer temp storage, allowed mime types, file size limit, and temp directory | "I prepared upload middleware for attachments, but the complaint routes do not use it yet." |
| `Backend/src/validators/auth.validator.js` | Auth request validation | Defines `registerSchema`, `loginSchema`, `refreshTokenSchema`, plus unused forgot/reset password schemas | "I validate auth payloads with Zod before controller logic runs." |
| `Backend/src/validators/complaint.validator.js` | Complaint request validation | Validates create, update, get-by-id, and list query params | "I validate complaint payloads and pagination/filter params at route level." |
| `Backend/src/models/User.js` | User schema and auth methods | Password hashing pre-save hook, JWT generation methods, password comparison, `toJSON` password removal | "The model handles password hashing and token generation close to the data layer." |
| `Backend/src/models/Complaint.js` | Complaint schema | Stores complaint fields, status lifecycle, soft delete, indexes, and auto-excludes deleted records from find queries | "This model captures the complaint lifecycle and query performance indexes." |
| `Backend/src/models/RefreshToken.js` | Refresh token persistence | Stores token string, user reference, expiry, revocation flag, TTL cleanup | "Refresh tokens are persisted so I can revoke and rotate them." |
| `Backend/src/services/auth.service.js` | Auth business logic | `register`, `login`, `logout`, `refreshToken`; creates users/tokens and refresh token DB records | "The service layer keeps token and user business logic out of controllers." |
| `Backend/src/services/complaint.service.js` | Complaint business logic | `createComplaint`, `getComplaintById`, `getUserComplaints`, `getAllComplaints`, `updateComplaint`, `deleteComplaint`, `getComplaintStats` | "The complaint service handles pagination, filtering, population, soft delete, and aggregation." |
| `Backend/src/services/user.service.js` | User business logic | `getUserById`, `getUserByEmail`, `getAllUsers`, `updateUser`, `deactivateUser`, `activateUser` | "The user service encapsulates profile and account operations." |
| `Backend/src/controllers/auth.controller.js` | Auth HTTP handlers | Calls auth service, sets cookies, returns `ApiResponse`; endpoints: register, login, logout, refresh, current user | "Controllers translate service results into HTTP responses." |
| `Backend/src/controllers/complaint.controller.js` | Complaint HTTP handlers | Creates, fetches, updates, soft deletes, and gets stats through complaint service | "The complaint controller is thin and delegates to the service layer." |
| `Backend/src/controllers/user.controller.js` | User HTTP handlers | Gets current user, user by ID, all users, updates profile, deactivates own account | "This controller handles user-facing account endpoints." |
| `Backend/src/controllers/admin.controller.js` | Planned admin-only handlers | Contains assign, status update, system stats, activate/deactivate other users, but no route imports currently use it | "This file shows planned admin features, but it is not wired into active routes yet." |
| `Backend/src/routes/auth.routes.js` | Auth API endpoints | Mounts register, login, refresh-token, logout, me; uses local validation helper, `verifyJWT`, and auth controller | "This route group exposes all auth APIs under `/api/v1/auth`." |
| `Backend/src/routes/complaint.routes.js` | Complaint API endpoints | Mounts create, my complaints, all complaints, stats, get by ID, update, delete; applies auth and role middleware | "This route group enforces complaint permissions and validation." |
| `Backend/src/routes/user.routes.js` | User API endpoints | Mounts `/me`, `/`, `/:id`, `/profile`, `/deactivate`; uses auth and some role protection | "This route group handles user profile and admin user listing." |
| `Backend/src/uploads/temp/.gitkeep` | Keeps empty upload folder in git | Ensures temp upload directory exists in repository even when empty | "I used `.gitkeep` so the upload temp folder survives in version control." |

### 7.3 Legacy backend files in `Backend/` root

These files look like an older version of the project. They use CommonJS (`require`) while the active backend uses ES modules (`import`) and starts from `Backend/src/index.js`.

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `Backend/server.js` | Old backend entry file | Starts Express on port 5000, mounts old auth and complaint routes, uses old DB config | "This is my earlier backend entry before I refactored into the current `src/` architecture." |
| `Backend/config/db.js` | Old DB connector | Simple `mongoose.connect(process.env.MONGO_URI)` and console logging | "This belongs to the first simpler backend version." |
| `Backend/middleware/authMiddleware.js` | Old auth middleware | `protect` verifies JWT from header; `adminOnly` checks admin role | "This is a smaller predecessor of my current auth and RBAC middleware." |
| `Backend/models/User.js` | Old user model | Simpler schema, only `student/admin`, uses `roomNo` naming, no model methods | "This is the legacy user schema before I expanded roles and auth methods." |
| `Backend/models/Complaint.js` | Old complaint model | Simpler complaint schema with `student`, `category`, `status`, `adminRemark` | "This was the first version of the complaint data model." |
| `Backend/routes/authRoutes.js` | Old auth routes | Handles register and login, hashes password directly in route, signs one JWT | "Originally auth logic lived in route files before I split it into controllers and services." |
| `Backend/routes/complaintRoutes.js` | Old complaint routes | Create complaint, get my complaints, get all complaints, update status; uses old middleware | "This is the earlier complaint API before the production-style refactor." |

### 7.4 Backend support files outside `src/`

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `Backend/package.json` | Backend dependency and script manifest | Uses `type: module`; scripts start `src/index.js`; defines backend packages | "This confirms the active backend entry is `src/index.js`." |
| `Backend/package-lock.json` | Exact backend dependency lockfile | Auto-generated by npm to pin package versions | "I commit the lockfile so installs are repeatable." |
| `Backend/README.md` | Backend-specific documentation | Explains backend architecture, APIs, schema, and security | "I documented backend responsibilities separately for maintainability." |
| `Backend/.gitignore` | Backend-specific ignore rules | Ignores env, uploads, logs, build, coverage, editor files | "I prevent backend-generated files and secrets from being committed." |
| `Backend/.env.example` | Safe template for env variables | Shows expected keys like `MONGO_URI`, JWT secrets, CORS origin, rate limits | "This helps someone else configure the backend quickly." |
| `Backend/.env` | Real local environment file | Actual runtime secrets and local configuration; values should stay private | "This is my local secret config file and should never be shared." |
| `Backend/backend.dev.log` | Captured dev stdout | Shows nodemon startup and healthy backend boot | "This is generated runtime output, not application logic." |
| `Backend/backend.dev.err.log` | Captured dev stderr | Currently empty based on recent run | "This is only for debugging backend startup errors." |
| `Backend/logs/2026-05-11.log` | Daily structured log file | Shows early Mongo connection failures and later successful health checks | "My logger keeps day-based JSON logs for operational debugging." |
| `Backend/logs/2026-05-12.log` | Daily structured log file | Shows successful Atlas connection, user registration, and complaint dashboard API hits | "These logs prove the request flow and are helpful for debugging production-like behavior." |

### 7.5 Frontend core files

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `Frontend/src/main.jsx` | React entry point | Mounts `<App />` in `#root` and imports global CSS | "This bootstraps the frontend application." |
| `Frontend/src/App.jsx` | Main frontend route switch | Uses `useAuth()` to decide public vs authenticated routes; branches student vs non-student dashboard routes | "This file drives top-level navigation and role-based page access." |
| `Frontend/src/index.css` | Shared styling system | Imports Google font, Tailwind layers, shared utility classes like `button-primary`, `card`, `input-base` | "I centralized repeated design tokens and component-like utility classes in one stylesheet." |
| `Frontend/src/store/authStore.js` | Global auth state | Zustand store with persisted `user`, `accessToken`, `refreshToken`, and methods `login`, `register`, `logout`, `isAuthenticated` | "This is the global auth store used across the app." |
| `Frontend/src/hooks/useAuth.js` | Small auth convenience hook | Reads values and actions from Zustand and exposes a simpler object | "I wrapped the store in a custom hook so components stay cleaner." |
| `Frontend/src/services/api.js` | API wrapper layer | Exposes `authService`, `complaintService`, and `userService` built on top of `apiClient` | "I used service wrappers so pages do not build raw URLs everywhere." |
| `Frontend/src/utils/apiClient.js` | Shared Axios client | Sets base URL, includes cookies, injects access token, refreshes token on `401` | "This file centralizes HTTP behavior and automatic token refresh." |
| `Frontend/src/utils/helpers.js` | View helper functions | Date formatting, text truncation, and status/priority badge style mapping | "I pulled formatting logic out of UI components to keep them simple." |

### 7.6 Frontend layout, route, and context files

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `Frontend/src/layouts/index.jsx` | Shared page shells | `MainLayout` provides navbar and sidebar; `AuthLayout` wraps login/register pages | "Layouts keep repeated structure out of page files." |
| `Frontend/src/routes/ProtectedRoute.jsx` | Old route guard helper | Redirects unauthenticated users or wrong roles, but current `App.jsx` does not use it | "This is an unused route helper left over from an earlier routing approach." |
| `Frontend/src/context/AuthContext.jsx` | Old auth context | Stores `user` and `token` with React Context and localStorage, but current app uses Zustand instead | "This is legacy auth state code that should be removed or replaced for consistency." |

### 7.7 Frontend page files

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `Frontend/src/pages/Login.jsx` | Login screen | Local form state, calls `useAuth().login`, redirects to dashboard/admin based on role | "This page performs authentication and role-based redirect after login." |
| `Frontend/src/pages/Register.jsx` | Registration screen | Collects user data, conditionally collects room/block for students, calls `register`, redirects by role | "This page handles onboarding for new users." |
| `Frontend/src/pages/StudentDashboard.jsx` | Student main dashboard | Calls `complaintService.getMyComplaints` and `getStats`, shows filters, stats, pagination, and complaint table | "Students use this page to track their own complaints and statuses." |
| `Frontend/src/pages/AdminDashboard.jsx` | Admin/staff dashboard | Calls `getAllComplaints` and global stats, supports status/category/search filters, uses debounce-like timeout | "This page is the complaint management queue for non-student roles." |
| `Frontend/src/pages/SubmitComplaint.jsx` | New complaint form | Uses current user's room/block, submits complaint, shows success state | "Students create complaints here, and the form enriches the payload with profile data." |
| `Frontend/src/pages/ComplaintDetail.jsx` | Complaint detail and update page | Fetches one complaint, builds timeline, shows detail and attachments, allows status/note updates for staff roles | "This is the detailed workflow page for tracking and managing an individual complaint." |

### 7.8 Frontend component files

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `Frontend/src/components/Navbar.jsx` | Top navigation | Shows title, current user, role, nav items, and logout button | "This gives the app a consistent header and session controls." |
| `Frontend/src/components/Sidebar.jsx` | Side navigation | Maps nav items into desktop sidebar links | "This keeps navigation reusable and role-aware." |
| `Frontend/src/components/ComplaintTable.jsx` | Desktop/mobile complaint list | Renders table on large screens, cards on mobile, and pagination controls | "This component abstracts complaint listing in a responsive way." |
| `Frontend/src/components/ComplaintCard.jsx` | Mobile complaint row | Compact card version of complaint item | "This supports mobile-friendly complaint viewing." |
| `Frontend/src/components/ComplaintBadges.jsx` | Status/priority badges | Uses helper style mappers to render colored labels | "This isolates visual status logic into reusable components." |
| `Frontend/src/components/DashboardStat.jsx` | Statistics card | Displays a metric label, value, and tone text | "This is a reusable dashboard summary card." |
| `Frontend/src/components/EmptyState.jsx` | Empty-state placeholder | Shows icon, title, description, optional action | "This creates a better UX when no data is available." |
| `Frontend/src/components/Skeleton.jsx` | Loading placeholders | Provides `SkeletonBlock`, `StatSkeleton`, and `TableSkeleton` | "These components improve perceived performance during loading." |

### 7.9 Frontend config and support files

| File | Why this file exists | Role, connections, key logic | Interview version |
|---|---|---|---|
| `Frontend/package.json` | Frontend dependency and scripts manifest | Defines Vite scripts and frontend dependencies | "This is the entry point for frontend tooling and package management." |
| `Frontend/package-lock.json` | Exact frontend dependency lockfile | Auto-generated npm lockfile for reproducible installs | "I commit the lockfile to keep dependency versions stable." |
| `Frontend/README.md` | Frontend-specific documentation | Explains features, pages, routes, services, and state management | "I documented the frontend separately for clarity." |
| `Frontend/index.html` | Single-page app HTML shell | Provides root DOM node and loads `src/main.jsx`; title still says `frontend` | "This is the HTML shell Vite serves for the React app." |
| `Frontend/vite.config.js` | Vite configuration | Adds React plugin and proxies `/api` to backend on port 5000 in development | "The proxy avoids frontend CORS pain during local development." |
| `Frontend/tailwind.config.js` | Tailwind theme config | Defines content paths, custom colors, font family, radii, animation | "I customized Tailwind tokens to keep styling consistent." |
| `Frontend/postcss.config.js` | CSS processing config | Runs Tailwind and Autoprefixer | "This enables Tailwind compilation and browser prefixing." |
| `Frontend/eslint.config.js` | Linting rules | Applies JS, React Hooks, and React Refresh lint rules | "I used ESLint to keep code quality consistent." |
| `Frontend/.gitignore` | Frontend ignore rules | Ignores logs, build output, editor files, local artifacts | "This prevents noisy frontend-generated files from going into git." |
| `Frontend/.env.example` | Safe frontend env template | Documents `VITE_API_BASE_URL` | "This makes frontend configuration portable." |
| `Frontend/public/vite.svg` | Default static Vite asset | Template leftover, not part of complaint domain | "This is a harmless Vite starter artifact." |
| `Frontend/src/assets/react.svg` | Default React asset | Not used by current complaint UI | "This is another starter asset that can be removed later." |
| `Frontend/frontend.dev.log` | Captured frontend dev stdout | Shows successful Vite startup on port 5173 | "This is generated tooling output." |
| `Frontend/frontend.dev.err.log` | Captured frontend dev stderr | Currently empty based on recent run | "This is only for frontend debugging." |
| `Frontend/frontend.short.dev.log` | Older short dev stdout capture | Shows a previous `vite` run command | "This is a generated artifact from a different dev launch." |
| `Frontend/frontend.short.dev.err.log` | Older short dev stderr capture | Shows a past Vite config resolution error on a short-path launch | "This log is useful for debugging local tooling issues, not product logic." |

## 8. Important code observations

These are useful for interviews because they show you understand your own code honestly.

1. The active backend is `Backend/src/`, not the older `Backend/server.js` structure.
2. The frontend uses Zustand for auth, but an older `AuthContext.jsx` still exists and is unused.
3. `ProtectedRoute.jsx` exists but `App.jsx` does manual route gating instead.
4. `admin.controller.js` exists but is not connected to any active route.
5. Upload and Cloudinary support are prepared but not actually used by complaint routes.
6. The backend supports roles `student`, `admin`, `warden`, `maintenance`, but the register UI only exposes `student` and `admin`.
7. Logs confirm the app was run locally and the register/dashboard flow worked on May 12, 2026.

## 9. Beginner mistakes in the code and how to improve them

1. Public registration can create admin users.
Improvement: In `auth.validator.js`, `Register.jsx`, and `auth.service.js`, do not let users self-select privileged roles. Default public signup to `student` and create admin/warden/maintenance only through a protected admin flow.

2. Tokens are stored both in cookies and localStorage.
Improvement: Pick one auth strategy. If you want the stronger security story, keep tokens in HTTP-only cookies and stop exposing/storing refresh tokens in localStorage.

3. Some security checks are missing on data access.
Improvement: In complaint detail and user-by-id endpoints, verify ownership or admin/staff role before returning data. Right now any authenticated user who knows an ID could potentially view data they should not.

4. Deactivated users can still log in.
Improvement: Add `isActive` check inside `auth.service.login()` before generating tokens.

5. Validation middleware is duplicated.
Improvement: Reuse `Backend/src/middlewares/validate.middleware.js` instead of redefining `validateRequest` in multiple route files.

6. There is dead or legacy code in the repo.
Improvement: Remove or archive `Backend/server.js`, old `routes/`, old `models/`, `AuthContext.jsx`, `ProtectedRoute.jsx`, and unused assets after confirming they are no longer needed.

7. Upload support is incomplete.
Improvement: Wire `upload.middleware.js` into complaint creation/update routes, upload files to Cloudinary, and store attachment metadata in complaints.

8. Search text in admin dashboard is misleading.
Improvement: The UI says search by student name, but backend search only checks complaint title/description. Either change the placeholder or implement student-name search with aggregation.

9. Inconsistent naming exists between old and new code.
Improvement: Legacy code uses `roomNo`, active code uses `roomNumber`. Keep one naming convention everywhere.

10. `.env` appears to contain duplicated sections.
Improvement: Clean the file so each variable is defined once, which reduces confusion during debugging.

11. There are no automated tests in the repository.
Improvement: Add unit tests for services and integration tests for auth and complaint APIs.

12. `index.html` still has a generic title.
Improvement: Rename it to something like `Hostel Complaint System`.

## 10. Complete project explanation you can say in interview

"This project is a MERN-based hostel complaint management system. I built a React frontend where users can register, log in, submit complaints, and track their status. On the backend I built an Express API with a layered structure: routes handle endpoints, controllers handle HTTP requests and responses, services contain business logic, and Mongoose models handle database interaction. Authentication is based on JWT access tokens and refresh tokens, and I added role-based access control for student, admin, warden, and maintenance roles. I also added validation with Zod, centralized error handling, structured logging, soft delete for complaints, and dashboard statistics using MongoDB aggregation." 

## 11. Short 1-minute explanation

"It is a hostel complaint management system built with MongoDB, Express, React, and Node. Students can create complaints and track them, while staff can review and update them. The backend is organized into routes, controllers, services, middleware, and models. I used JWT authentication, role-based authorization, Zod validation, Zustand for frontend auth state, and Axios interceptors for token refresh."

## 12. Technical explanation for interviewer

"The frontend is a Vite React app with role-based routing in `App.jsx`, a Zustand auth store, and an Axios client that injects bearer tokens and refreshes them on `401`. The backend is an Express app initialized in `src/index.js`, with security middleware in `src/app.js`, versioned routes under `/api/v1`, Zod-based validation, and a service layer between controllers and Mongoose models. `User`, `Complaint`, and `RefreshToken` are modeled in MongoDB. Complaint list APIs support filtering, pagination, and statistics via `aggregate`. Errors are normalized with `ApiError` and `ApiResponse`, and logging is handled through Morgan plus a custom Winston logger."

## 13. Possible interview questions with strong answers

1. Why did you use a service layer?
Answer: "I used a service layer so controllers stay thin and focused on HTTP concerns. That makes business logic reusable, easier to test, and easier to maintain as the app grows."

2. How does login work in your project?
Answer: "The frontend sends email and password to `/auth/login`. The backend checks the user, compares the hashed password, generates access and refresh tokens, stores the refresh token in MongoDB, and returns user data plus tokens."

3. Why did you use refresh tokens?
Answer: "Access tokens are short-lived for security. Refresh tokens allow users to stay signed in without logging in repeatedly, and storing them in the database lets me revoke them."

4. How is authorization different from authentication here?
Answer: "Authentication verifies who the user is using JWT. Authorization decides what that authenticated user is allowed to do based on role, like student versus admin."

5. How are complaints fetched for students versus admins?
Answer: "Students call `/complaints/my`, which filters by `createdBy = req.user._id`. Admin or staff users call `/complaints/all`, which returns system-wide complaints with pagination and filters."

6. How did you handle validation?
Answer: "I used Zod schemas to validate body, params, and query objects before requests reach the controller. That prevents bad input from reaching the service or database layer."

7. How do you handle soft delete?
Answer: "Instead of removing complaints physically, I mark `isDeleted: true`. The complaint schema hides deleted records from normal find queries, which preserves history and is safer than hard delete."

8. How does token refresh work on the frontend?
Answer: "The Axios response interceptor checks for `401`. If the request was not already retried, it sends the refresh token to `/auth/refresh-token`, stores the new tokens, and retries the original request."

9. What state management did you use and why?
Answer: "I used Zustand for authentication because it is simple, lightweight, and good for a small-to-medium app. I kept page-specific data in local component state."

10. What security features did you add?
Answer: "I added password hashing, JWT verification, role checks, Helmet, CORS, rate limiting, Mongo sanitization, XSS cleaning, and standardized validation."

11. What MongoDB features are you using?
Answer: "I use schema validation, references between collections, indexes, population for related user data, and aggregation for complaint statistics."

12. If you had more time, what would you improve?
Answer: "I would clean legacy code, strengthen auth by removing localStorage token exposure, add tests, complete attachment uploads, and tighten access control checks on detail endpoints."

## 14. Real-world problems solved by this project

1. Replaces informal complaint handling with a structured workflow.
2. Gives students visibility into complaint status.
3. Gives admins a single dashboard to manage complaint backlog.
4. Stores complaint history for accountability.
5. Supports prioritization and categorization of maintenance work.

## 15. Challenges you can mention

1. Designing authentication with token refresh and logout.
2. Splitting the backend into routes, controllers, services, and models.
3. Handling pagination, filters, and stats cleanly.
4. Keeping frontend routing different for student and admin roles.
5. Making error messages and loading states user-friendly.

## 16. Future improvements you can mention

1. Add email or WhatsApp notifications when complaint status changes.
2. Add file/image attachment upload fully through Multer and Cloudinary.
3. Add a proper admin user-management screen.
4. Add assignee selection for maintenance staff.
5. Add tests with Jest and Supertest or Vitest.
6. Add audit logs for who changed complaint status.
7. Add real-time updates with WebSockets.
8. Add deployment CI/CD pipeline.

## 17. Important concepts used in this project

1. MERN architecture
2. REST API design
3. JWT authentication
4. Refresh token rotation
5. RBAC (role-based access control)
6. Middleware pattern
7. MVC-ish separation with service layer
8. Mongoose schema design
9. Soft delete
10. Pagination and filtering
11. Aggregation in MongoDB
12. Centralized error handling
13. Frontend global state with Zustand
14. Axios interceptors
15. Responsive UI with Tailwind

## 18. Best honest summary of the codebase

This is a strong beginner-to-intermediate full-stack project. The biggest strengths are:

- clear MERN architecture
- service layer in the backend
- auth with refresh tokens
- role-based flow
- standard API responses
- decent dashboard UI

The biggest weaknesses are:

- legacy code still left in the repo
- some planned features are not fully wired in
- public admin registration is unsafe
- token storage strategy is inconsistent
- a few access-control rules are too loose

If you explain both strengths and weaknesses clearly in interview, it will make you sound more mature and credible.
