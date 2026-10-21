# IMovies — Movie Ticket Booking System

> **Project Category:** Full-Stack Commercial Cinema Booking Web Platform  
> **Developer:** Ansh Tiwari  
> **Stack:** MERN (MongoDB Atlas / Local / In-Memory Fallback, Express.js, React 19 / Vite 8, Node.js v24) with Socket.IO, Multer, and Razorpay Sandbox  

---

## 1. Project Overview

**IMovies** is a full-stack cinema ticket booking web platform designed to reproduce the digital customer and administrative experience of commercial multiplexes (such as BookMyShow and Cinepolis). The application enables cinema-goers to discover movies, browse schedules across theatres, select seats in real-time with live concurrency locking, apply bank promotional offers, complete simulated or live payments, view digital tickets with cryptographic QR verification, and maintain booking history.

The platform includes an **Administration Control Suite** providing cinema managers with full CRUD operations for movies, theatres, screens, seat tiers, show schedules (with conflict detection), customer bookings, and revenue reporting.

---

## 2. Feature Verification & Implementation Status

To provide an accurate assessment of the codebase, features are explicitly categorized into **Fully Implemented & Verified** versus **Simulated / Development Defaults**.

| Feature Category | Description | Status | Verification Detail |
|---|---|---|---|
| **Auditorium Seat Map** | Cinepolis Bansal Plaza geometry, 6 pricing tiers, couple recliner pods, wheelchair indicators, walkway aisles | ✅ Verified Implemented | Validated mathematically in `SeatMap.jsx` and `autoSeed.js` |
| **Real-Time Seat Locking** | Socket.IO event broadcasting (`seat_locked`, `seat_released`, `seats_booked`) with 5-minute atomic TTL lock | ✅ Verified Implemented | Tested under multi-user concurrency tests (`api.test.js`) |
| **Server-Side Pricing** | Server calculates subtotal, 18% GST, and convenience fees; rejects client-side price tampering | ✅ Verified Implemented | Verified in `bookingService.js` and automated tests |
| **Device Poster Upload** | Multer disk storage for JPG, PNG, WEBP, AVIF, GIF (up to 10MB) with drag-and-drop & live preview | ✅ Verified Implemented | Tested in `upload.js`, `AddMovie.jsx`, and `EditMovieModal.jsx` |
| **Administration Suite** | Management portals for Movies, Theatres, Screens, Shows, Bookings, Users, and Revenue | ✅ Verified Implemented | All admin controllers, routes, and modal components verified |
| **Show Conflict Detection** | Server rejects overlapping shows on the same screen (including runtime + turnaround buffer) | ✅ Verified Implemented | Enforced with 409 Conflict rejection in `showController.js` |
| **Digital Tickets & QR** | QR code generation with cryptographic token and public verification portal (`/verify-ticket`) | ✅ Verified Implemented | Verified in `ticketController.js` and `TicketVerification.jsx` |
| **Authentication & RBAC** | JWT authentication (7-day TTL), bcrypt password hashing, `USER` vs. `ADMIN` route guards | ✅ Verified Implemented | Enforced via `authenticate.js` and `authorizeAdmin.js` |
| **Payment Gateway** | Dual-mode payment processing (Sandbox Simulation vs. Live Razorpay) | ⚠️ Development Default | Sandbox mode verified; live Razorpay requires production API keys |
| **Database Persistence** | MongoDB Atlas or Local MongoDB with fallback to embedded `mongodb-memory-server` | ⚠️ Development Fallback | Fallback verified; production requires external MongoDB deployment |
| **Email Ticket Delivery** | Nodemailer SMTP booking receipt delivery | ⚠️ Development Fallback | Active when SMTP is configured; otherwise logs receipt to server console |

---

## 3. Auditorium Layout & Seat Geometry

The auditorium seat map faithfully models a commercial Indian multiplex layout (**Cinepolis Bansal Plaza, Bhopal**) across six distinct pricing tiers.

### Mathematical Breakdown
- **Row L (Recliner — ₹690):** 11 seats numbered `11` down to `1`, arranged in couple pods: `[11, 10]`, `[9, 8]`, `[7, 6]`, `[5, 4]`, `[3, 2]`, `[1]`.
- **Row K (Premium Plus — ₹230):** 15 seats numbered `15` down to `1`, partitioned across 3 blocks: Left `[15, 14]`, Center `[13–3]`, Right `[2, 1]`.
- **Row J (Premium XL — ₹230):** 13 seats numbered `13` down to `1`, partitioned across 3 blocks: Left `[13–10]`, Center `[9–3]`, Right `[2, 1]`. Designated wheelchair accessibility indicators ♿ are placed on seats `J-9` and `J-6`.
- **Rows I, H, G, F, E (Premium — ₹210):** 5 rows configured with up to 19 seats each (95 seats total in seed; 85 seats in 17-seat configuration). Left wing `[19–17]`, Center viewing zone `[16–7]` with electric blue sweet-spot border, Right wing `[6–1]`.
- **Rows D, C, B (Executive — ₹210):** 3 rows of 15 seats each (45 seats total). Main block `[15–3]`, Walkway Aisle, Right block `[2, 1]`.
- **Row A (Normal — ₹210):** 1 row of 15 seats (15 seats total) positioned nearest to the screen. Main block `[15–3]`, Walkway Aisle, Right block `[2, 1]`.

> **Seat Count Note:** In the default `autoSeed.js` configuration, 194 physical seats are seeded (Rows I–E at 19 seats). When Rows I–E are configured with 17 seats per row, the layout totals exactly 184 seats.

### Visual Indicators & Styling
- **Seat Numbering:** Descends from left to right (e.g., `19` down to `1`), mirroring standard multiplex conventions.
- **Auditorium Screen:** Shallow curved purple cinema screen indicator at the bottom with upper glow edge (`All eyes this way — Cinema Screen`).
- **Seat States:** Available (dark squircle `#1A1D24`), Selected (vivid purple `#6B5CF6` with glow), Booked (muted dark charcoal `#262930`), Locked/Reserved (amber `#D97706`), Sweet-spot center view (blue border `#2563EB`).
- **Viewport Controls:** Built-in Zoom In, Zoom Out, and Reset buttons for mobile accessibility.
- **Partner Offers Bar:** Interactive modal with instant promo codes (`AXISBOGO`, `VISA20`, `ICICI25`, `RUPAY50`, `PAYTM50`).

---

## 4. Technology Stack

```
=============================================================================
  Layer           Technology              Version      Purpose
=============================================================================
  Frontend        React                   v19.2.8      Component UI library
                  Vite                    v8.3.4       Bundler and dev server
                  React Router            v7.18.4      Client-side navigation
                  Bootstrap & Custom CSS  v5.3.8       Layout & cinema theme
                  Socket.IO Client        v4.8.4       Real-time seat sync
                  Axios                   v1.20.0      API HTTP client
                  React Toastify          v11.1.0      User notifications
                  qrcode.react            v4.2.0       QR code generation
-----------------------------------------------------------------------------
  Backend         Node.js                 v24.19.0     JavaScript runtime
                  Express.js              v4.21.2      RESTful API server (MVC)
                  Socket.IO Server        v4.8.1       Websocket event broker
                  Multer                  v2.4.0       Multipart poster uploads
                  bcryptjs                v2.4.3       Password hashing
                  jsonwebtoken            v9.0.2       JWT authentication
                  Helmet & Rate Limit     v8.0 / v7.5  Security headers & limits
-----------------------------------------------------------------------------
  Database        MongoDB / Mongoose      v8.9.5       ODM & data modeling
                  MongoMemoryServer       v10.1.3      Development/test fallback
-----------------------------------------------------------------------------
  Testing         Node.js Test Runner     Native       Integration test suite
                  Supertest               v7.0.0       HTTP assertions
=============================================================================
```

---

## 5. Directory Structure

```
IMovies/
|-- client/                              # Frontend React application
|   |-- public/                          # Static assets and favicon
|   |-- src/
|   |   |-- components/
|   |   |   |-- admin/                   # Admin Modals (EditMovie, EditShow, EditTheatre, Details)
|   |   |   |-- booking/                 # DigitalTicket with QR code
|   |   |   |-- common/                  # LoadingSpinner, ConfirmModal
|   |   |   |-- layout/                  # Navbar, Footer
|   |   |   |-- movies/                  # MovieCard
|   |   |   |-- seats/                   # SeatMap (Cinepolis 184/194-seat auditorium)
|   |   |-- context/                     # AuthContext, BookingContext, ThemeContext
|   |   |-- pages/                       # Home, Movies, MovieDetails, SelectShow, SeatSelection,
|   |   |                                # Payment, BookingConfirmation, MyBookings, Favorites,
|   |   |                                # Profile, TicketVerification, NotFound
|   |   |-- pages/admin/                 # AdminDashboard, ManageMovies, AddMovie, ManageTheatres,
|   |   |                                # AddTheatre, ManageScreens, ManageShows, AddShow,
|   |   |                                # ManageBookings, ManageUsers, RevenueReports
|   |   |-- services/                    # Axios API client modules
|   |   |-- styles/                      # Global cinema theme CSS
|   |   |-- App.jsx                      # Route definitions
|   |   |-- main.jsx                     # Application entry point
|   |-- package.json
|   |-- vite.config.js
|
|-- server/                              # Backend Express application
|   |-- config/                          # database.js, payment.js
|   |-- controllers/                     # auth, movie, theatre, screen, show, seatLock,
|   |                                    # booking, payment, ticket, admin, user, favorite, review
|   |-- middleware/                      # authenticate, authorizeAdmin, upload, errorHandler, rateLimiter
|   |-- models/                          # User, Movie, Theatre, Screen, Show, SeatLock, Booking, Payment, etc.
|   |-- public/uploads/posters/          # Uploaded movie poster images
|   |-- routes/                          # REST API route handlers
|   |-- scripts/                         # autoSeed.js, createAdmin.js, updatePosters.js
|   |-- services/                        # seatLockService, bookingService, paymentService, socketService
|   |-- tests/                           # api.test.js (30 automated integration tests)
|   |-- server.js                        # Express server entry point
|   |-- package.json
|
|-- .mongodb_data/                       # Local disk-backed WiredTiger DB (development fallback)
|-- run-dev.js                           # Concurrent launcher for server + client
|-- package.json                         # Workspace scripts
|-- README.md                            # Project documentation
```

---

## 6. Getting Started & Setup

### Prerequisites
- **Node.js:** v18.0.0 or later (v24 recommended)
- **npm:** v9.0.0 or later
- **MongoDB:** MongoDB Atlas connection URI or local MongoDB installation (optional in development due to embedded fallback)

### Step 1: Open or Clone the Project
```bash
git clone <repository-url>
cd <project-folder>
```

### Step 2: Install Dependencies
You can install dependencies for both root, server, and client concurrently:
```bash
npm install
```
*(Or manually in each subdirectory: `cd server && npm install`, then `cd ../client && npm install`)*

### Step 3: Environment Configuration
Create `.env` files in both `server/` and `client/` by copying the provided examples:

```bash
# On Linux / macOS:
cp server/.env.example server/.env
cp client/.env.example client/.env

# On Windows PowerShell:
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

---

## 7. Environment Variables Reference

### Backend (`server/.env`)
```env
# Server & Network Configuration
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
API_BASE_URL=http://localhost:8000/api/v1

# Database Configuration
# Provide a MongoDB Atlas connection string or local mongod URI.
# In development, if unreachable, an embedded database fallback is automatically initialized.
MONGODB_URI=mongodb://127.0.0.1:27017/imovies

# Authentication Security (Replace with a cryptographically random string in production)
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_here

# Administrative Registration Authorization Secret
ADMIN_REGISTRATION_SECRET=change_this_to_a_secure_admin_secret_in_production

# Payment Processing (Options: "sandbox" for development simulation, "razorpay" for live gateway)
PAYMENT_PROVIDER=sandbox
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Email Notification Service (Optional; logs to console if omitted)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM="IMovies Concierge" <tickets@imovies.app>

# Initial Seed Admin Account (used by npm run create-admin)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@imovies.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
VITE_PAYMENT_PROVIDER=sandbox
VITE_RAZORPAY_KEY_ID=
```

---

## 8. Database Architecture: Cloud, Local & Fallback

The backend (`server/config/database.js`) implements a resilient connection strategy:

1. **Standard Connection:** The server attempts to connect to `process.env.MONGODB_URI` with a 2.5-second timeout.
2. **MongoDB Atlas (Production):** Set `MONGODB_URI` to your cloud Atlas cluster string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/imovies?retryWrites=true&w=majority
   ```
3. **Embedded Fallback (`mongodb-memory-server`):**
   - In development mode (`NODE_ENV=development`), if the standard URI fails, the server automatically downloads and runs an embedded mongod process storing data on disk in `.mongodb_data/` using the WiredTiger storage engine.
   - In test mode (`NODE_ENV=test`), an isolated in-memory instance (`imovies_test`) is started without directory locks, preventing conflicts during parallel execution.
   - **Important Windows Caveat:** Running multiple Node processes simultaneously against `.mongodb_data/` triggers a file lock conflict (`DBPathInUse` on `mongod.lock`). For production deployments, an external MongoDB service or Atlas cluster is required.

---

## 9. Running the Application

### Option A: Unified Launcher (Recommended)
From the root directory:
```bash
node run-dev.js
# Or:
npm run dev
```
This concurrently starts:
- **Backend API:** `http://localhost:8000`
- **Frontend Client:** `http://localhost:5173`
- **Health Check:** `http://localhost:8000/api/v1/health`

### Option B: Separate Terminal Launch
**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 10. Seeded Development Accounts

The database includes pre-configured demo credentials for rapid local testing.

> [!WARNING]
> These credentials are seeded for development and evaluation only. In production environments, replace default credentials, set a secure `JWT_SECRET`, and disable demo auto-seeding.

| Account Type | Email Address | Password | Role / Permissions |
|---|---|---|---|
| **Administrator** | `admin@imovies.com` | `Admin@123456` | Full administrative access (`ADMIN`) |
| **Demo Customer 1** | `ansh@example.com` | `User@123456` | Standard customer account (`USER`) |
| **Demo Customer 2** | `gvvdkumar@gmail.com` | `User@123456` | Standard customer account (`USER`) |

---

## 11. Automated Testing & Verification

The backend includes an end-to-end integration test suite (`server/tests/api.test.js`) executed with Node's native test runner (`node:test`) and `supertest`.

### Command to Execute Tests
```bash
npm test --prefix server
```

### Verified Test Results
```text
▶ IMovies Full-Stack API Test Suite
  ✔ GET /api/v1/health - System health check returns 200
  ✔ POST /api/v1/auth/register - Register new customer account
  ✔ POST /api/v1/auth/register - Reject duplicate email registration
  ✔ POST /api/v1/auth/login - Reject invalid credentials
  ✔ POST /api/v1/auth/login - Successful customer login
  ✔ POST /api/v1/auth/login - Successful admin login
  ✔ GET /api/v1/admin/dashboard - Customer access is forbidden (403)
  ✔ GET /api/v1/admin/dashboard - Admin access succeeds (200)
  ✔ GET /api/v1/movies - Fetch movies catalogue with search
  ✔ GET /api/v1/shows - Fetch shows for movie
  ✔ GET /api/v1/shows/:showId/seats - Fetch real-time seat availability map
  ✔ POST /api/v1/shows/:showId/seat-locks - Acquire temporary seat reservation
  ✔ POST /api/v1/shows/:showId/seat-locks - Reject conflicting seat lock from another user
  ✔ POST /api/v1/bookings - Initiate pending booking with server price calculation
  ✔ POST /api/v1/payments/create-order - Create sandbox payment order
  ✔ POST /api/v1/payments/verify - Verify payment and confirm booking idempotently
  ✔ GET /api/v1/tickets/:bookingReference/verify - Public digital ticket verification
  ✔ GET /api/v1/bookings/me - User can see their confirmed booking in My Bookings
  ✔ POST /api/v1/movies - Customer cannot create movie (403 Forbidden)
  ✔ POST /api/v1/movies - Admin creates a new movie (201 Created)
  ✔ PUT /api/v1/movies/:id - Admin updates existing movie details
  ✔ POST /api/v1/theatres - Admin creates a new theatre with screen
  ✔ PUT /api/v1/theatres/:id - Admin updates theatre details
  ✔ GET /api/v1/screens - Fetch all screens with populated theatre
  ✔ PUT /api/v1/screens/:id - Admin updates screen details
  ✔ POST /api/v1/shows - Admin schedules a show
  ✔ POST /api/v1/shows - Reject conflicting overlapping show on same screen (409 Conflict)
  ✔ PUT /api/v1/shows/:id - Admin edits existing show
  ✔ DELETE /api/v1/shows/:id - Safe deletion of show without bookings
  ✔ DELETE /api/v1/movies/:id - Delete movie without bookings
✔ IMovies Full-Stack API Test Suite (30 tests passed, 0 failures)
```

### Production Client Build
```bash
npm run build --prefix client
```
Verified build: Vite transforms and compiles the React application into `client/dist/` in under 1 second with 0 bundling errors.

---

## 12. REST API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication (`/api/v1/auth`)
- `POST /register` — Register a customer account
- `POST /login` — Authenticate and retrieve JWT token
- `GET /me` — Retrieve authenticated user profile (protected)

### Movies (`/api/v1/movies`)
- `GET /` — Browse movie catalogue with filters (`genre`, `language`, `status`, `search`, `sort`)
- `GET /:id` — Retrieve detailed movie information, cast, and average rating
- `POST /` — Create movie record with poster file upload (Admin only)
- `PUT /:id` — Update movie metadata and status (Admin only)
- `DELETE /:id` — Delete movie (protected against active bookings) (Admin only)

### Theatres & Screens (`/api/v1/theatres`, `/api/v1/screens`)
- `GET /theatres` — List cinema venues and cities
- `POST /theatres` — Create theatre venue (Admin only)
- `PUT /theatres/:id` — Update theatre information and active status (Admin only)
- `GET /screens` — Fetch auditorium screens with seat categories
- `POST /screens` — Create screen with custom seat layout (Admin only)
- `PUT /screens/:id` — Update screen layout and pricing (Admin only)

### Shows & Seat Availability (`/api/v1/shows`)
- `GET /shows` — Query schedules by movie, theatre, date, and status
- `GET /shows/:id` — Retrieve show details
- `GET /shows/:id/seats` — Real-time seat availability map with category pricing
- `POST /shows` — Schedule show with collision detection (Admin only)
- `PUT /shows/:id` — Edit show schedule and pricing (Admin only)
- `DELETE /shows/:id` — Cancel or delete show (Admin only)

### Concurrency Seat Locks (`/api/v1/seat-locks`)
- `POST /shows/:showId/seat-locks` — Atomically acquire 5-minute temporary reservation
- `DELETE /shows/:showId/seat-locks` — Release held seats

### Bookings & Payments (`/api/v1/bookings`, `/api/v1/payments`)
- `POST /bookings` — Create pending booking with server-calculated price
- `GET /bookings/me` — Customer booking history (protected)
- `POST /payments/create-order` — Create payment order (Sandbox / Razorpay)
- `POST /payments/verify` — Verify signature and confirm booking idempotently
- `POST /payments/webhook` — Razorpay webhook event handler

### Ticket Admission (`/api/v1/tickets`)
- `GET /tickets/:bookingReference/verify` — Public ticket validation endpoint

### Administration (`/api/v1/admin`)
- `GET /admin/dashboard` — Telemetry, active shows, and revenue summary
- `GET /admin/bookings` — All customer transaction records
- `GET /admin/users` — User management and role status toggles
- `GET /admin/revenue` — Aggregate financial and occupancy reports

---

## 13. Author & Attribution

- **Developer & Maintainer:** Ansh Tiwari  
- **Project:** IMovies — Movie Ticket Booking System  

