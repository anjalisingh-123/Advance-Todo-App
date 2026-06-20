# TaskFlow - Full-Stack Authenticated Todo Application

TaskFlow is a premium, full-stack Todo application built with React, Node.js, Express, and MongoDB. It features user authentication (JWT via HttpOnly cookies with a header-based fallback for cross-domain browser compatibility), protected routes, real-time search, interactive task reordering, dynamic completion statistics, and custom Toast notification flows, fully styled with responsive Light/Dark theme toggles and Framer Motion transitions.

---

## 📁 Project Structure

```text
TODOAPP/
├── todo-backend/                 # Node.js + Express backend server
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT extraction (cookie & Authorization header fallback)
│   ├── models/
│   │   ├── Task.js               # Task schema (user-indexed, timestamps)
│   │   └── User.js               # User schema (pre-save password hashing, case-insensitive email)
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routes (register, login, logout, GET /me info)
│   │   └── taskRoutes.js         # Protected task CRUD routes (sorted newest-first)
│   ├── server.js                 # App entry point (dynamic CORS setup)
│   ├── package.json              # Backend dependencies & scripts
│   └── .env                      # Connection variables (local only)
│
├── todo-frontend1/               # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Dynamic header with theme toggles, user badge & logout
│   │   │   ├── ProtectedRoute.jsx# Guards private routes from unauthenticated users
│   │   │   ├── SearchBar.jsx     # Live filtering search bar
│   │   │   ├── TaskCard.jsx      # Individual task card (emoji priorities, inline editor)
│   │   │   ├── TaskForm.jsx      # Title, priority, and date task creation form
│   │   │   ├── TaskList.jsx      # Drag-and-drop task listing with empty states
│   │   │   └── Toast.jsx         # Custom notifications context alerts
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global session state & startup login status checks
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main Todo dashboard UI
│   │   │   ├── Login.jsx         # Sign-in form (with loading & error indicators)
│   │   │   └── Register.jsx      # Signup form (matching password & strength validation)
│   │   ├── services/
│   │   │   └── api.js            # Configured Axios client (withCredentials: true)
│   │   ├── styles/               # CSS stylesheets
│   │   ├── App.jsx               # App routing switches and theme provider
│   │   └── main.jsx              # React app entry point
│   ├── vercel.json               # Vercel SPA routing redirects
│   └── package.json              # Frontend dependencies & scripts
│
├── .gitignore                    # Global gitignore configuration
└── README.md                     # Project documentation
```

---

## 🛠️ Features

* **JWT User Authentication:** Complete sign-up, login, and logout flows. Sessions are stored securely via HttpOnly cookie tokens with a secondary `Authorization: Bearer <token>` header fallback to support browsers blocking cross-site/third-party cookies (e.g. Safari, Brave, Chrome Incognito).
* **Guarded Routing:** Client-side routing redirects unauthenticated users to `/login` if they try to access the dashboard.
* **Database Performance Indexing:** Tasks are indexed by `user` in MongoDB to avoid costly collection scans, securing fast load times.
* **Structured Creation Form:** Enter titles, select task priority level (🟢 Low, 🟡 Medium, 🔴 High), and pick due dates using a date picker.
* **Drag-and-Drop Reordering:** Drag task cards natively to visually reorder list priorities. Card positions swap dynamically using Framer Motion layout transitions.
* **Real-time Search:** Filter tasks instantly by title.
* **Completion Progress Tracker:** Displays task completion metrics alongside an animated progress bar.
* **Dynamic Dark Theme:** Fluidly toggle dark mode with layout transitions. Theme preferences cached in `localStorage`.
* **Toast Notifications:** Entrance/exit notifications showing completion marks, warnings, or deletion cues.

---

## 💻 Local Installation & Setup

Ensure you have [Node.js](https://nodejs.org) and [MongoDB](https://www.mongodb.com) installed and running locally.

### 1. Set Up the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd todo-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `todo-backend` folder and add your connection configurations:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/todoapp
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will launch at `http://localhost:5000`.

### 2. Set Up the Frontend App
1. Open a new terminal window and navigate to the React app folder:
   ```bash
   cd todo-frontend1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `todo-frontend1` folder and add the API endpoint:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend application will launch at `http://localhost:5173`.

---

## 🚀 Deployment Guide

### Deploying the Backend on Render
1. Sign up on [Render.com](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Root Directory**: `todo-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under the **Environment Variables** tab, add:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: Your production JWT secret key.
   - `FRONTEND_URL`: `https://your-frontend.vercel.app` (your live frontend Vercel URL to whitelist CORS requests).
6. Click **Create Web Service** and copy the public URL generated once deployed (e.g. `https://your-backend.onrender.com`).

### Deploying the Frontend on Vercel
1. Sign up on [Vercel.com](https://vercel.com).
2. Import your GitHub repository, selecting `todo-frontend1` as the **Root Directory**.
3. Under the **Environment Variables** tab, add:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com` (The public URL provided by Render).
4. Click **Deploy**. Vercel will build and host your application.
