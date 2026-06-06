# Groove 🎵

Groove is a React + Vite social media web app with a clean dashboard-style UI, user authentication, and a responsive mobile-first layout.

## 🚀 Features

- Responsive social media interface
- User authentication using Clerk
- Client-side routing with React Router
- Reusable components for stories, feed, chat, profile, and navigation
- Tailwind CSS styling with Lucide icons
- Fast local development with Vite
 - Story viewer with modal and timed/story navigation
 - Profile modal for quick user previews and actions
 - Notifications and toasts (react-hot-toast)
 - Real-time-style messaging UI and recent messages panel
 - Loading states and skeleton components for better UX
 - Post creation, reactions, and contextual menu actions

## 🧩 Pages Included

- `Feed` - Main feed with posts and stories
- `Discover` - Explore new content and users
- `ChatBox` / `Messages` - Messaging interface
- `Connections` - User connections and follow suggestions
- `CreatePost` - Create new posts
- `Profile` - User profile view
- `Login` - Authentication entry point

Extras and UI components included:

- StoriesBar / StoryModal / StoryViewer
- ProfileModal / UserProfileInfo
- PostCard and CreatePost flow
- RecentMessages and ChatBox UI
- Loading, Feedback and utility components

## 🛠️ Tech Stack

- React 19
- Vite
- Tailwind CSS
- Clerk (`@clerk/react`)
- React Router DOM
- Lucide React Icons
- Moment.js
- ESLint
 - React Hot Toast (`react-hot-toast`) for notifications
 - `@tailwindcss/vite` plugin for Tailwind + Vite integration

## 📦 Setup

1. Clone the repository:

   ```bash
git clone <your-repo-url>
```

2. Change into the client folder:

   ```bash
cd client
```

3. Install dependencies:

   ```bash
npm install
```

4. Create a `.env` file and add your Clerk publishable key:

   ```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

5. Start the development server:

   ```bash
npm run dev
```

## ⚙️ Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the production bundle
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint across the project

Tip: use `npm run dev` during UI work and `npm run build` when preparing a production bundle.

## 📁 Project Structure

- `src/components` - Reusable UI components
- `src/pages` - Route-driven page views
- `src/assets` - Static assets and helper data
- `src/main.jsx` - App entry point
- `src/index.css` - Global styles

Key component groups:

- `src/components` — Reusable UI pieces (stories, profile modal, post cards, messages, etc.)
- `src/pages` — Route-driven page views

## 💡 Notes

- Add your Clerk publishable key to `.env` before running the app.
- If there is a backend service, make sure its endpoints are configured separately.

## 📄 License

This project is for learning and personal development.