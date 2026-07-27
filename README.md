# 📖 Track & Thrive (T&T) — Bullet Journal Habit Tracker

A modern, minimalist digital bullet-journal monthly spread application for personal discipline, daily habit tracking, and progress analytics.

🌐 **Live Demo**: [daily-journal-teal.vercel.app](https://daily-journal-teal.vercel.app)

Inspired by real physical bullet journals, **Track & Thrive** combines authentic handwriting typography and grid paper aesthetics with modern web application features like MongoDB Atlas multi-user isolation, date-locked discipline rules, and interactive area progress graphs.

---

## ✨ Features

- **📖 2-Page Bullet Journal Spread**:
  - Continuous 31-day table spread with custom handwriting typography (`Kalam`).
  - **3-State Cell Cycle**: Click any cell to cycle `✓ (Done)` → `✕ (Missed)` → `½ (Partial)` → Clear.
  - **Inline Habit Renaming**: Click any habit title to edit inline and press `Enter` to save.
  - **Custom Deletion Modal**: Hover over a habit name cell to reveal the `✕` delete button with handwritten confirmation alert.

- **🔒 Discipline Date Lock**:
  - Ticking and modifying habit cells is restricted strictly to **Today** and **Yesterday (Day Before)**.
  - Future and past days are visually locked with a `cursor-not-allowed` indicator to enforce daily discipline.

- **📈 Dynamic Area Progress Graph**:
  - Automatically calculates daily completion percentages (`0%` to `100%`) from grid tracker data.
  - Smooth orange-to-gold area curve with glowing linear gradient fill matching dark UI aesthetics.
  - Interactive tooltip card displaying exact date and completion tier (e.g. `DATE: JUL 27 | COMPLETION RATE: 60% (Good)`).

- **🔑 Multi-User Authentication & Data Isolation**:
  - Simple Username + Password registration and sign-in (no email required).
  - Every habit and entry is securely isolated in MongoDB Atlas per user ID.

- **🖼️ Cached Profile Avatars**:
  - Profile pictures are cached locally in `localStorage` for zero database overhead.
  - Click your profile badge in the top right to upload or update your picture anytime.

- **⚙️ Account Settings Modal**:
  - Unified modal to update profile picture, change account password in MongoDB, or log out.

- **🎛️ Sleek Navbar**:
  - Dark pill-shaped container (`#242424`) with rounded-lg square month navigation buttons and integrated profile avatar.

- **🎨 Softened 60% Opacity Grid Lines**:
  - Faint, non-intrusive paper grid rules for a pleasant dark journal visual aesthetic.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Custom CSS Design System
- **Fonts**: Google Fonts (`Kalam`, `Inter`)
- **Charts**: Recharts (`ResponsiveContainer`, `AreaChart`, `Area`, `Tooltip`)

### **Backend**
- **Runtime**: Node.js + Express 5
- **Database**: MongoDB Atlas + Mongoose 8
- **Authentication**: Custom Bearer Token Header Authentication

---

## 🚀 Getting Started

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB instance)

---

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker
```

---

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/T%26T
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/T%26T
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:3001
```

---

### **3. Frontend Setup**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5174
```

---



## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
