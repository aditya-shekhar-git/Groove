# Groove 🎵

Groove is a modern social media web application built with React and Vite. It offers a clean, responsive interface for discovering new content, connecting with users, and sharing updates.

## 🚀 Features

- Responsive social media layout
- User authentication via Clerk
- Client-side routing with React Router
- Reusable UI components and sidebar navigation
- Fast development workflow with Vite
- Tailwind CSS styling and Lucide icons

## 🛠️ Tech Stack

- React
- Vite
- Tailwind CSS
- Clerk Authentication
- React Router
- Lucide React Icons

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

4. Start the development server:

```bash
npm run dev
```

## ⚙️ Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the production bundle
- `npm run preview` - Preview the production build locally

## 🔐 Environment Variables

Create a `.env` file in the `client` folder and add your Clerk publishable key:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

## 📁 Project Structure

- `src/components` - Reusable UI components
- `src/pages` - Page-level views for routing
- `src/assets` - Static assets and helper data
- `src/index.css` - Global styles
- `src/main.jsx` - Application entry point

## 💡 Notes

- Ensure the backend and authentication services are configured if the app uses a separate API server.
- Update the Clerk key in `.env` before running the app.

## 📄 License

This project is for learning and personal development.