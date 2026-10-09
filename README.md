# 🌟 Festivo — Modern MERN Stack College Event Management Platform

> **EVENTS • CONNECT • CELEBRATE**

Festivo is a full-featured, modern, and production-ready **MERN Stack (MongoDB, Express.js, React, Node.js)** college event management web application. Designed specifically for university campuses, college fests, technical clubs, and student councils, Festivo enables students, organizers, and campus administrators to discover, connect, and celebrate campus life seamlessly.

---

## 🎨 1. Logo & Branding Design

Festivo implements the **selected third logo design**:
- **Typography:** Elegant handwritten script wordmark for "Festivo" with deep navy lettering (`#0f172a` / `#1e1b4b`).
- **Gradient Accents:** Blue-purple gradient stroke and highlights (`from-blue-600 via-indigo-600 to-purple-600`).
- **Celebratory Sparkle:** A radiant celestial sparkle positioned gracefully above the wordmark.
- **Tagline:** **`EVENTS • CONNECT • CELEBRATE`** with tracking-widest uppercase modern typography.
- **Favicon:** Custom matching SVG with the deep navy tile, blue-purple crest, and celebratory sparkle.
- **Aesthetic:** Clean white/light slate background, navy text, blue-purple gradients, glassmorphism cards, and micro-animations. Avoids generic green as the primary color.

---

## 🚀 2. Technology Stack

- **Frontend:**
  - [React.js 19](https://react.dev/) with [Vite](https://vitejs.dev/) for high-speed HMR and optimized builds
  - [Tailwind CSS v4](https://tailwindcss.com/) with custom font utilities and micro-animations
  - [React Router DOM v7](https://reactrouter.com/) for single-page routing and role-protected routes
  - [Axios](https://axios-http.com/) with automatic JWT interceptors
  - [Lucide React](https://lucide.dev/) for clean modern icons
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) for celebratory registration moments
- **Backend:**
  - [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) RESTful API
  - [Mongoose](https://mongoosejs.com/) for MongoDB object modeling, validations, and compound indexes
  - [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://www.npmjs.com/package/bcryptjs) for secure password hashing and stateless authentication
  - [CORS](https://www.npmjs.com/package/cors) & [Morgan](https://www.npmjs.com/package/morgan) request logging
- **Database Architecture:**
  - Primary: [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)
  - Resilient In-Memory Mode: Built-in auto-fallback mode that enables instant evaluation if local MongoDB is not yet running, while supporting full live MongoDB connectivity via `MONGO_URI`!

---

## 👥 3. User Roles & Role-Based Access Control (RBAC)

Festivo enforces secure role-based access for three distinct personas:

### 👑 Admin
- Platform-wide statistics: total users, total events, total registrations, category distribution, and live activity feeds.
- Full CRUD access over all campus events.
- Complete user management: change user roles (student, organizer, admin), toggle active/disabled status, delete accounts.
- View all registrations and student attendees across the university.

### 🎯 Organizer
- Create and publish new events with categories, schedules, venues, seat limits, and deadlines.
- Edit their own event details and capacity settings.
- Real-time participant management: view attendee rosters and export attendee lists as **`.CSV`**.
- Monitor registration counts, seat capacities, and fill rate percentages.

### 🎓 Student / Attendee
- Register and log in with JWT authentication.
- Search and filter campus events by category (Technical, Hackathons, Cultural, Sports, Workshops, Fests), status, and date.
- Real-time seat reservation with duplicate prevention, deadline checks, and seat capacity limits.
- **Digital Admission Pass:** Access personal QR ticket passes with barcode mockups and print options.
- Cancel registrations to release seats back to other students.

---

## 📄 4. All 16 Pages Implemented

| # | Page | Route | Description |
|---|---|---|---|
| 1 | **Landing Page** | `/` | Hero section "Discover. Connect. Celebrate.", category cards, platform stats, featured events carousel, how-it-works, footer. |
| 2 | **Login Page** | `/login` | Secure login with **1-Click Demo Fillers** for Student, Organizer, and Admin. |
| 3 | **Student Registration** | `/register` | Registration form with role selector (Student or Organizer), department, roll number, and validation. |
| 4 | **Explore Events** | `/events` | Search bar, category pill tabs, status filter, sort dropdown, and event cards. |
| 5 | **Event Details** | `/events/:id` | Full description, seat tracker, countdown, organizer contact, registration booking modal, ticket pass preview. |
| 6 | **Student Dashboard** | `/dashboard/student` | Personalized welcome banner, active registrations, recent events, recommended categories. |
| 7 | **My Registrations** | `/my-registrations` | Digital ticket wallet with status filters (Active/Cancelled), pass viewer, and cancel seat option. |
| 8 | **Organizer Dashboard** | `/dashboard/organizer` | Organizer statistics, roster of hosted events, seat fill rates, quick link to create event. |
| 9 | **Create Event** | `/events/create` | Comprehensive form with preset banner images, deadlines, requirements, and tags. |
| 10 | **Edit Event** | `/events/edit/:id` | Edit event details, reschedule dates, adjust capacity limits, or change status. |
| 11 | **Manage Participants** | `/events/:id/participants` | Attendee roster, search participants, and **Export to CSV**. |
| 12 | **Admin Dashboard** | `/dashboard/admin` | Platform KPIs, category breakdown charts, recent registrations, and activity stream. |
| 13 | **Manage Events** | `/admin/events` | University-wide event table with search, category filter, edit, and delete controls. |
| 14 | **Manage Users** | `/admin/users` | User directory with role changer dropdown, activation toggle, and deletion. |
| 15 | **User Profile** | `/profile` | Edit user profile details (department, phone, avatar, bio) and change password. |
| 16 | **404 Not Found** | `*` | Custom 404 page with navigation links back to Home and Explore Events. |

---

## 🔑 5. Pre-Seeded Demo Accounts (Ready to Test)

The system includes pre-seeded demo accounts. Click any of the **autofill buttons** on the Login page or use the credentials below:

| Role | Email | Password | Access Highlights |
|---|---|---|---|
| **Student** | `student@festivo.edu` | `Student@123` | Student Dashboard, Register for events, My Tickets, Cancel registration |
| **Organizer** | `organizer@festivo.edu` | `Organizer@123` | Organizer Hub, Create Event, Edit Event, Manage Participants, Export CSV |
| **Admin** | `admin@festivo.edu` | `Admin@123` | Admin Portal, Manage Events, Manage Users, System Stats |

---

## 🛠️ 6. Installation & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
- [npm](https://www.npmjs.com/)

### Step 1: Install Dependencies
Open two terminals or navigate to each folder:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables
A `.env.example` file is included in `backend/`:

```bash
cd backend
cp .env.example .env
```

Contents of `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/festivo
JWT_SECRET=festivo_super_secret_jwt_key_2026_college_events
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Run the Application

**Terminal 1 (Backend API):**
```bash
cd backend
npm start
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

Now open **http://localhost:5173** in your web browser!

---

## 🗄️ 7. MongoDB Configuration & Dual-Mode Behavior

Festivo comes with full Mongoose schemas (`User`, `Event`, `Registration`) and handles database connectivity gracefully:

1. **If MongoDB is Available (Local or Atlas):**
   - In `backend/.env`, set `MONGO_URI` to your connection string:
     ```env
     # Local MongoDB:
     MONGO_URI=mongodb://127.0.0.1:27017/festivo

     # MongoDB Atlas Cloud:
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/festivo?retryWrites=true&w=majority
     ```
   - Run the seeder to populate realistic college events:
     ```bash
     cd backend
     npm run seed
     ```
   - Mongoose connects and operates normally.

2. **If MongoDB is Not Running Locally (Zero-Config Demo Mode):**
   - The backend detects that MongoDB is offline and activates **Resilient In-Memory Mock Mode**.
   - The app continues running with full functionality: all 16 pages, password hashing, JWT authentication, event registrations, duplicate checks, seat limits, and CRUD operations work out of the box!
   - You can check database status anytime at `/api/status` or click the status indicator in the top navbar.

---

## 📡 8. REST API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch current user session | Authenticated |
| `PUT` | `/api/auth/profile` | Update profile information | Authenticated |
| `PUT` | `/api/auth/change-password` | Change account password | Authenticated |

### 📅 Events (`/api/events`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/events` | List all events (filters: search, category, status, sort) | Public |
| `GET` | `/api/events/:id` | Get event details by ID | Public / Optional Auth |
| `POST` | `/api/events` | Create a new event | Organizer, Admin |
| `PUT` | `/api/events/:id` | Update event details | Event Organizer, Admin |
| `DELETE`| `/api/events/:id` | Delete event and related registrations | Event Organizer, Admin |
| `GET` | `/api/events/my-events` | Get events created by logged-in organizer | Organizer, Admin |

### 🎟️ Registrations (`/api/registrations`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/registrations/register` | Register for an event (seat check, deadline check, duplicate prevention) | Authenticated (Students) |
| `PUT` | `/api/registrations/cancel/:id` | Cancel registration and release seat | Owner, Admin |
| `GET` | `/api/registrations/my-registrations` | Get all registrations for logged-in user | Authenticated |
| `GET` | `/api/registrations/event/:eventId/participants` | View participant roster for an event | Event Organizer, Admin |
| `GET` | `/api/registrations/status/:eventId` | Check registration status for an event | Authenticated |

### 🛡️ Admin Management (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Platform metrics, event breakdown, recent activity | Admin |
| `GET` | `/api/admin/users` | List all users | Admin |
| `PUT` | `/api/admin/users/:id` | Modify user role or account status | Admin |
| `DELETE`| `/api/admin/users/:id` | Delete user account | Admin |
| `GET` | `/api/admin/registrations` | View all registrations globally | Admin |

### 🩺 System Status (`/api/status`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/status` | Server health, MongoDB status, connection guide | Public |

---

## 🏆 Project Highlights for Faculty Evaluation

1. **Consistent Logo & Branding:** Beautiful cursive typography with navy lettering, gradient accents, celebratory sparkle, and the tagline "EVENTS • CONNECT • CELEBRATE".
2. **True Full-Stack Implementation:** Fully connected frontend and backend with Axios, React Router, Express, and Mongoose.
3. **Robust Business Logic:** Hard prevents duplicate booking, enforces deadlines, prevents overbooking past maximum capacity, and tracks live remaining seats.
4. **All 16 Required Pages:** Every single requested page is completely developed with responsive design, empty states, loading indicators, and toasts.
5. **Demonstration-Ready:** Includes 1-click login buttons for Student, Organizer, and Admin, letting faculty and hackathon judges experience every role immediately.
