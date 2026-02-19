<h1 align="center">📱🌐 X Clone - Full Stack Social Media Platform 🚀</h1>

Welcome to the **X Clone**, a fully functional clone of the X (formerly Twitter) platform with **both Mobile (React Native) and Web (Next.js)** versions sharing the same backend API.

---

## 🎯 What Was Built

**Full-stack development** with multi-platform support.

✅ **Mobile App** built with React Native (iOS & Android)  
✅ **Web App** built with Next.js 15 (Desktop & Mobile Web)  
✅ **Shared Backend API** with Express.js & MongoDB  
✅ **Same authentication** works across all platforms  
✅ Real-time updates and modern UI/UX

---

## 🧑‍🍳 App Features Overview

- 🔐 **Authentication** via Clerk (Google / Apple ID supported)
- 🏠 **Home Screen** to post text & images (from gallery or camera)
- ❤️ **Like & Comment** system with smooth modal interactions
- 🔔 **Notifications Tab** for likes & comments
- 📬 **Messages Tab** with chat history & long-press delete
- 👤 **Profile Tab** with editable profile modal
- 🔎 **Search Tab** for trending content
- 🚪 **Sign Out** that returns to login screen

---

## 🧠 Learning curve

- 🛠️ Build a REST API with Express.js & MongoDB
- 🔐 Implement robust auth with **Clerk**
- ☁️ Upload & serve images via **Cloudinary**
- 🛡️ Add rate-limiting, bot detection & security with **Arcjet**
- 🧪 Use **Git & GitHub** in real-world team workflow (PRs & branches)
- 📦 Connect everything in a real deployment setup

---

## 📁 .env Setup

### ⚙️ Backend (`/backend`)

```bash
PORT=5001
NODE_ENV=development

CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>

MONGO_URI=<your_mongodb_connection_uri>

ARCJET_ENV=development
ARCJET_KEY=<your_arcjet_api_key>

CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

### ⚙️ Mobile (`/mobile`)

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>

EXPO_PUBLIC_API_URL=<your_backend_api_url>
```

### 🌐 Web (`/web`)

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
# For production: https://x-clone-rn.vercel.app/api

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## 🚀 Getting Started

### 1️⃣ Run the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5001`

### 2️⃣ Run the Mobile App

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go app on your phone or press `i` for iOS simulator / `a` for Android emulator.

### 3️⃣ Run the Web App

```bash
cd web
npm install
npm run dev
```

The web app will be available at `http://localhost:3000`

---

## 📂 Project Structure

```
x-clone/
├── backend/          # Express.js REST API
│   ├── src/
│   │   ├── config/   # Database, Cloudinary, Arcjet config
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
│
├── mobile/           # React Native (Expo) App
│   ├── app/          # File-based routing
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── package.json
│
└── web/              # Next.js Web App
    ├── src/
    │   ├── app/      # Next.js App Router
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   └── types/
    └── package.json
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Clerk
- **Image Upload**: Cloudinary
- **Security**: Arcjet (Rate limiting, bot detection, DDoS protection)

### Mobile App
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind for React Native)
- **State Management**: TanStack Query
- **Navigation**: Expo Router
- **Authentication**: Clerk

### Web App
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Authentication**: Clerk
- **Icons**: React Icons
