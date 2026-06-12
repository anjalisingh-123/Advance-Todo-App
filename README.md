# TaskFlow - Full-Stack Todo Application

TaskFlow is a premium, full-stack Todo application built with React, Node.js, Express, and MongoDB. It features real-time search, interactive task reordering via drag-and-drop, dynamic completion statistics, and custom Toast notification flows, fully styled with responsive Light/Dark theme toggles and Framer Motion transitions.

---

## 📁 Project Structure

```text
TODOAPP/
├── todo-backend/                 # Node.js + Express backend server
│   ├── models/                   # Mongoose schemas (Task model)
│   ├── routes/                   # Express router logic
│   ├── server.js                 # App server initialization
│   ├── package.json              # Backend dependencies & npm scripts
│   └── .env                      # Connection variables (local only)
│
├── todo-frontend1/
│   └── todo-App/                 # React + Vite frontend application
│       ├── src/
│       │   ├── components/       # Reusable components (TaskCard, Navbar, SearchBar, Toast)
│       │   ├── styles/           # Styling sheets (scoped CSS variables)
│       │   ├── App.jsx           # App state router
│       │   └── main.jsx          # React app entry
│       ├── vercel.json           # Vercel SPA routing redirects
│       └── package.json          # Frontend dependencies & npm scripts
│
├── .gitignore                    # Global gitignore configuration
└── README.md                     # Project documentation
```

---

## 🛠️ Features

* **Structured Creation Form:** Enter titles, select task priority level (🟢 Low, 🟡 Medium, 🔴 High), and pick due dates using a date picker.
* **Drag-and-Drop Reordering:** Drag task cards natively to visually reorder list priorities. Card positions swap dynamically using Framer Motion layout transitions.
* **Real-time Search:** Filter tasks instantly as you type.
* **Completion Progress Tracker:** Displays task completion counts alongside an animated progress bar.
* **Dynamic Dark Theme:** Fluidly toggle dark mode with layout transitions. Theme preferences cached in `localStorage` and default to browser settings.
* **Toast Notifications:** Entrance/exit notifications showing completion marks, warnings, or deletion cues.
* **Contextual Empty States:** Graphical cues directing you to create your first task (with a CTA focus link) or adjust search keywords.

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
3. Create a `.env` file inside the `todo-backend` folder and add your connection string and port:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/todoapp
   PORT=5000
   ```
4. Start the backend development server:
   ```bash
   npm run start
   ```
   The backend will launch at `http://localhost:5000`.

### 2. Set Up the Frontend App
1. Open a new terminal window and navigate to the React app folder:
   ```bash
   cd todo-frontend1/todo-App
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend application will launch at `http://localhost:5173`.

---

## 🚀 Deployment Guide

### Deploying the Backend on Railway
1. Sign up on [railway.app](https://railway.app).
2. Provision a **MongoDB** database instance.
3. Import your GitHub repository, selecting `todo-backend` as the **Root Directory**.
4. Add the following variables under the **Variables** tab:
   - `MONGO_URI`: Connect to your provisioned database (use `${{MongoDB.MONGODB_URL}}` or your Atlas connection string).
   - `PORT`: `5000` (Railway binds port dynamically, but keep this as default).
5. Deploy and copy the public URL generated (e.g. `https://your-backend.up.railway.app`).

### Deploying the Frontend on Vercel
1. Sign up on [Vercel.com](https://vercel.com).
2. Import your GitHub repository, selecting `todo-frontend1/todo-App` as the **Root Directory**.
3. Under the **Environment Variables** tab, add the backend URL:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.up.railway.app`
4. Click **Deploy**. Vercel will build and host your application.
