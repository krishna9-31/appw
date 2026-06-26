# Bus Booking Web Application

MERN stack bus booking app using MERN Stack.


## 📋 Table of Contents
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE (Frontend)                   │
│  React + Vite + Bootstrap | Netlify                         │
│  - Landing Page                                              │
│  - Bus Search & Listing                                     │
│  - Seat Selection Grid                                      │
│  - User Authentication (Login/Signup)                       │
│  - Booking Management                                        │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   SERVER SIDE (Backend)                      │
│  Node.js + Express | Render.com                             │
│  - User Authentication (JWT)                                │
│  - Bus Search & Filtering                                   │
│  - Booking Management                                        │
│  - Seat Availability Tracking                               │
│  - Data Validation & Error Handling                         │
└─────────────────────────────────────────────────────────────┘
                            ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│               DATABASE (MongoDB Atlas)                       │
│  - Users Collection                                          │
│  - Buses Collection (8,900+ records)                        │
│  - Bookings Collection                                       │
│  - Reservations Collection                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI Library |
| | Vite | Build Tool & Dev Server |
| | React Router | Client Navigation |
| | Bootstrap 5 | Styling |
| | Axios | HTTP Client |
| **Backend** | Node.js | Runtime |
| | Express.js | Web Framework |
| | Mongoose | MongoDB ODM |
| | JWT | Authentication |
| | Bcryptjs | Password Encryption |
| **Database** | MongoDB Atlas | Cloud Database |
| **Deployment** | Netlify | Frontend Hosting |
| | Render.com | Backend Hosting |

---

## 📁 Project Structure

```
appweave/
├── frontend/                    # React Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── pages/              # Page Components
│   │   ├── services/           # API & Auth Services
│   │   ├── constants/          # Static Data
│   │   ├── App.jsx             # Main App Component
│   │   └── main.jsx            # Entry Point
│   ├── .env                    # Environment Config
│   ├── netlify.toml            # Netlify Config
│   ├── vite.config.js          # Vite Configuration
│   ├── package.json            # Dependencies
│   └── README.md               # Frontend Documentation
│
├── backend/                     # Node.js Server
│   ├── config/                 # Database Connection
│   ├── controllers/            # Business Logic
│   ├── models/                 # MongoDB Schemas
│   ├── routes/                 # API Routes
│   ├── middleware/             # Auth, Errors
│   ├── utils/                  # Helper Functions
│   ├── .env                    # Environment Config
│   ├── seed.js                 # Data Seeding Script
│   ├── server.js               # Main Server File
│   ├── package.json            # Dependencies
│   └── README.md               # Backend Documentation
│
└── README.md                    # This File
```

---

## 💻 Tech Requirements

- **Node.js:** v18 or higher
- **npm:** v9 or higher (or yarn)
- **MongoDB:** Atlas account (free tier available)
- **Git:** For version control

---

## 🚀 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/krishna9-31/busybay112.git
cd busybay112
```

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with:
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_secret_key_here

# Seed database (8,900 buses)
node seed.js

# Start server
npm start
```

**Backend runs on:** `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with:
VITE_API_BASE_URL=http://localhost:5000

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## ▶️ Running the Application

### Local Development (Both Services)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Then open:** http://localhost:5173

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Output: dist/ folder
```

**Backend:**
```bash
cd backend
# Just push to Render (auto-deploys)
```

---

## 🌐 Deployment

### Frontend (Netlify)

1. Push code to GitHub
2. Connect repo to Netlify
3. Set build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variable: `VITE_API_BASE_URL=your_backend_url`
5. Auto-deploys on git push

### Backend (Render.com)

1. Connect GitHub repo to Render
2. Create Web Service
3. Set start command: `npm start`
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
5. Auto-deploys on git push

---

## 📚 Documentation

- **[Backend README](./backend/README.md)** - API endpoints, schemas, backend setup
- **[Frontend README](./frontend/README.md)** - Components, pages, frontend features

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/buses` | Search buses |
| GET | `/api/buses/:busId` | Get bus details |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking |
| DELETE | `/api/bookings/:id` | Cancel booking |
| GET | `/api/seed` | Seed database |

**Full API documentation in [Backend README](./backend/README.md)**

---

## 🎯 Key Features

✅ **User Authentication**
- Signup with email validation
- Login with JWT tokens
- Protected routes

✅ **Bus Search & Filtering**
- Search by city, date
- Filter by seat type, AC
- Pagination support
- 8,900+ pre-loaded buses

✅ **Seat Management**
- Interactive seat grid
- Real-time availability
- Multiple seat selection
- Upper/lower berth for sleepers

✅ **Booking System**
- Complete booking workflow
- Booking confirmation
- Cancel bookings
- Session-based reservations

✅ **Responsive Design**
- Mobile-friendly
- Tablet optimized
- Desktop view

---

## 🚨 Troubleshooting

### Issue: "Failed to fetch" in frontend

**Solution:**
1. Check backend is running: `http://localhost:5000/`
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check CORS is enabled in backend

### Issue: "No buses found"

**Solution:**
1. Verify MongoDB connection in `.env`
2. Run seed script: `node seed.js`
3. Check database has collections

### Issue: "Invalid credentials" on login

**Solution:**
1. Verify user is registered first
2. Check password is correct
3. Ensure MongoDB is connected

---

## 👥 Team

- **Developer:** Krishna - [GitHub](https://github.com/krishna9-31)

---

## 📄 License

MIT License - Feel free to use this project for learning and commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📞 Support

- **Frontend Issues:** Check [Frontend README](./frontend/README.md)
- **Backend Issues:** Check [Backend README](./backend/README.md)
- **General Questions:** Open a GitHub issue

---

## 🔗 Links

- **GitHub Repository:** https://github.com/krishna9-31/busybay112
- **Frontend Live:** https://69c43555f53f3e53e455d6be--boisterous-monstera-4cadc6.netlify.app/
- **Backend API:** https://busybay1-backend.onrender.com/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas

---

**Happy Booking! 🚌✈️**
id`
- `DELETE /api/reservations/:id`
