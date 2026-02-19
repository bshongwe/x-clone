# 🌐 X Clone - Web Version

This is the **Next.js web application** for the X Clone platform. It shares the same backend API with the mobile version.

## 🚀 Features

- ✅ **Modern Next.js 15** with App Router
- 🔐 **Clerk Authentication** (Google, Email, etc.)
- 💅 **Tailwind CSS** for styling
- 🔄 **React Query** for data fetching
- 📱 **Responsive Design** - works on all devices
- 🎨 **Twitter-like UI** with familiar interactions
- ⚡ **Fast & Optimized** with Next.js optimizations

## 📦 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Date Formatting**: date-fns

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `web` directory:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
# For production: https://x-clone-rn.vercel.app/api

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/            # Main authenticated routes
│   │   │   ├── home/          # Home feed
│   │   │   ├── notifications/ # Notifications page
│   │   │   └── profile/       # User profiles
│   │   ├── sign-in/           # Sign in page
│   │   ├── sign-up/           # Sign up page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── layout/            # Layout components
│   │   ├── posts/             # Post-related components
│   │   ├── profile/           # Profile components
│   │   └── notifications/     # Notification components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and API
│   ├── providers/             # React providers
│   └── types/                 # TypeScript types
├── public/                    # Static assets
└── package.json
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔄 API Integration

The web version uses the same backend API as the mobile app. All API calls are defined in `src/lib/api.ts`:

- **User API**: Sync, profile, follow/unfollow
- **Post API**: Create, read, update, delete posts
- **Comment API**: Create and read comments
- **Notification API**: Get and manage notifications

## 🎨 Styling

The app uses Tailwind CSS with custom Twitter-themed colors defined in `tailwind.config.ts`:

```typescript
twitter: {
  blue: "#1DA1F2",
  darkBlue: "#1A91DA",
  black: "#14171A",
  darkGray: "#657786",
  lightGray: "#AAB8C2",
  extraLightGray: "#E1E8ED",
  extraExtraLightGray: "#F5F8FA",
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `web`
4. Add environment variables
5. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📝 Environment Variables

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

## 🤝 Contributing

This web version shares the backend with the mobile app, so any backend changes should be coordinated across both platforms.

## 📄 License

Same as the parent project.
