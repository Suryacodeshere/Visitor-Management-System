# 🏢 Employee Visitor Management System

A modern, full-stack **MERN** web application designed to digitize reception desks and replace traditional paper logs. Features a **Public Visitor Self Check-In Kiosk** for arriving guests and a **Protected Admin Dashboard** for management and security personnel.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React_19_%2B_Vite-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![NodeJS](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## 🔗 Live Demos

- 🌐 **Frontend (Vercel)**: [https://visitor-management-frontend-eta.vercel.app](https://visitor-management-frontend-eta.vercel.app)
- ⚙️ **Backend API (Render)**: [https://visitor-management-backend-5otp.onrender.com](https://visitor-management-backend-5otp.onrender.com)

---

## ✨ Features

- 📋 **Public Visitor Self Check-In Kiosk (`/`)**: 
  - Arriving guests can register themselves on any front-desk tablet or browser without staff intervention.
  - Form validation for 10-digit mobile numbers, host employee, and visit purpose.
  - Instant digital confirmation card upon successful check-in.

- 🛡️ **Protected Admin Dashboard (`/admin`)**:
  - Secure login powered by **JWT (JSON Web Tokens)** and **bcryptjs** password hashing.
  - View full visitor log history sorted by latest entries.

- 📊 **Real-Time Analytics**:
  - Dashboard KPI card showing **Today's Total Visitors**.

- 🔍 **Debounced Live Search**:
  - Filter visitors by **Name** or **Mobile Number** in real-time with automatic 400ms debouncing to optimize API performance.

- 📥 **CSV Export**:
  - Export all visitor records into a `.csv` file with a single click.

- ✏️ **Full CRUD Management**:
  - Admins can view full details, update records, or delete past entries.

- 📱 **Fully Responsive UI**:
  - Built with Tailwind CSS v4, optimized for desktop displays, laptops, and tablet kiosk setups.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS v4 + PostCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Utilities**: `react-csv` for data export

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (via Mongoose ODM)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Security**: CORS middleware with domain whitelist

---

## 🔑 Default Admin Credentials

Upon launching the backend, a default administrator account is automatically seeded into MongoDB Atlas:

- **Username**: `admin`
- **Password**: `admin123`

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/visitors` | **Public** | Self-register a new visitor entry |
| **POST** | `/api/auth/login` | **Public** | Authenticate admin and receive JWT token |
| **GET** | `/api/visitors` | **Admin Only** | Fetch all visitors (supports `?search=` query) |
| **GET** | `/api/visitors/stats/today` | **Admin Only** | Fetch count of today's total visitors |
| **GET** | `/api/visitors/:id` | **Admin Only** | Fetch details of a specific visitor |
| **PUT** | `/api/visitors/:id` | **Admin Only** | Update visitor details |
| **DELETE**| `/api/visitors/:id` | **Admin Only** | Delete a visitor record |

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas cluster URI (or local MongoDB running on `27017`)

### 1. Clone the Repository
```bash
git clone https://github.com/Suryacodeshere/Visitor-Managrment-System.git
cd Visitor-Managrment-System
```

### 2. Configure Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/visitor_db
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:
```bash
npm run dev
```

### 3. Configure Frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
