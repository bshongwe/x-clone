# X-Clone Mobile App 📱

A full-featured Twitter/X clone mobile application built with React Native and Expo. This app provides a complete social media experience with authentication, posts, comments, notifications, and real-time interactions.

## 🚀 Features

- **Authentication**
  - Email/Password sign-up and sign-in
  - Google OAuth integration
  - Apple Sign-In support
  - Secure session management with Clerk

- **Social Features**
  - Create, edit, and delete posts
  - Like and comment on posts
  - Real-time notifications
  - User profiles with bio and profile pictures
  - Follow/unfollow users
  - Direct messaging (UI ready)
  - Image uploads via Cloudinary

- **User Experience**
  - Tab-based navigation
  - Pull-to-refresh functionality
  - Optimistic UI updates
  - Smooth animations and transitions
  - Dark mode support (via NativeWind)

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev)
- **Language**: TypeScript
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Authentication**: [Clerk](https://clerk.com/)
- **API Client**: [Axios](https://axios-http.com/)
- **Image Handling**: [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- **Icons**: [Expo Vector Icons](https://docs.expo.dev/guides/icons/)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator
- Expo Go app (for physical device testing)

## 🏗️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bshongwe/x-clone.git
   cd x-clone/mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the mobile directory:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## 📱 Running the App

### Development Build
```bash
npx expo start
```

Then choose your platform:
- Press `i` for iOS Simulator (macOS only)
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your physical device

### Production Build

**iOS**
```bash
eas build --platform ios
```

**Android**
```bash
eas build --platform android
```

## 📁 Project Structure

```
mobile/
├── app/                    # Expo Router file-based routing
│   ├── (auth)/            # Authentication screens
│   │   ├── _layout.tsx    # Auth layout wrapper
│   │   └── index.tsx      # Sign-in/Sign-up screen
│   ├── (tabs)/            # Main app tabs
│   │   ├── _layout.tsx    # Tab navigator
│   │   ├── index.tsx      # Home feed
│   │   ├── search.tsx     # Search/explore
│   │   ├── notifications.tsx
│   │   ├── messages.tsx   # Direct messages
│   │   └── profile.tsx    # User profile
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── PostCard.tsx       # Individual post display
│   ├── PostComposer.tsx   # Create new post
│   ├── PostsList.tsx      # Posts feed
│   ├── CommentsModal.tsx  # Comments view
│   ├── EditProfileModal.tsx
│   ├── NotificationCard.tsx
│   └── SignOutButton.tsx
├── hooks/                 # Custom React hooks
│   ├── useCurrentUser.ts  # Get current user data
│   ├── usePosts.ts        # Posts CRUD operations
│   ├── useComments.ts     # Comments operations
│   ├── useNotifications.ts
│   ├── useProfile.ts      # User profile operations
│   ├── useCreatePost.ts   # Post creation
│   ├── useSocialAuth.ts   # OAuth integration
│   ├── useUserSync.ts     # Sync Clerk user to backend
│   └── useSignOut.ts      # Sign-out logic
├── types/                 # TypeScript type definitions
│   └── index.ts
├── utils/                 # Utility functions
│   ├── api.ts             # API client and endpoints
│   └── formatters.ts      # Date/time formatters
├── assets/                # Images, fonts, icons
└── data/                  # Mock data for development
```

## 🔑 Key Features Implementation

### Authentication Flow
- Uses Clerk for secure authentication
- Syncs authenticated users to backend via `useUserSync`
- Supports email/password and OAuth (Google, Apple)
- Auto-redirects based on authentication state

### Data Fetching & Caching
- TanStack Query for server state management
- Automatic background refetching
- Optimistic updates for better UX
- Smart cache invalidation

### Posts & Comments
- Create posts with text and images
- Real-time like/unlike with optimistic UI
- Nested comments support
- Edit and delete own posts

### Notifications
- Real-time notification updates
- Mark as read functionality
- Navigate to referenced posts/users

## 🎨 Styling

The app uses NativeWind (Tailwind CSS for React Native) with a custom color palette:

```typescript
// Custom Twitter/X color scheme
colors: {
  twitter: {
    blue: '#1DA1F2',
    darkBlue: '#1A8CD8',
    lightBlue: '#E8F5FE',
    black: '#14171A',
    darkGray: '#657786',
    lightGray: '#AAB8C2',
    extraLightGray: '#E1E8ED',
    extraExtraLightGray: '#F5F8FA',
    white: '#FFFFFF',
  }
}
```

## 🧪 Development Scripts

```bash
# Start development server
npm start

# Start with cache clear
npm start -- --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Type checking
npm run tsc

# Linting
npm run lint
```

## 🔧 Environment Configuration

### Development
- Local backend: `http://localhost:3000/api`
- Expo development server: `http://localhost:8081`

### Production
- Update `EXPO_PUBLIC_API_URL` to production backend URL
- Configure Clerk production environment
- Set up Cloudinary production credentials

## 📦 Dependencies

### Core
- `expo` - Expo SDK
- `react-native` - React Native framework
- `react` - React library
- `typescript` - Type safety

### Navigation & Routing
- `expo-router` - File-based routing
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native navigation

### State & Data
- `@tanstack/react-query` - Server state management
- `axios` - HTTP client

### Authentication
- `@clerk/clerk-expo` - Authentication SDK

### UI & Styling
- `nativewind` - Tailwind CSS for RN
- `react-native-reanimated` - Animations
- `expo-image-picker` - Image selection

### Utilities
- `date-fns` - Date formatting
- `expo-vector-icons` - Icon library

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### iOS Simulator not launching
```bash
# Reset iOS Simulator
xcrun simctl erase all
```

### Android Emulator issues
```bash
# Kill and restart ADB
adb kill-server
adb start-server
```

### Module resolution errors
```bash
# Clear all caches
rm -rf node_modules
npm cache clean --force
npm install
```

## 🚀 Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for production**
   ```bash
   # iOS
   eas build --platform ios --profile production

   # Android
   eas build --platform android --profile production
   ```

4. **Submit to stores**
   ```bash
   # App Store
   eas submit --platform ios

   # Google Play
   eas submit --platform android
   ```

## 📄 License

This project is part of the X-Clone platform. See the root README for license information.

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines in the root repository.

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check Expo documentation: https://docs.expo.dev
- Check React Native docs: https://reactnative.dev

## 🔗 Related Projects

- [Backend API](../backend) - Express.js REST API
- [Web Application](../web) - Next.js web client

---

Built with ❤️ using React Native and Expo
