# ContentHub - Project Structure

## Overview
Pure React + TypeScript application built with Vite for a content platform with video, images, blogs, and real-time chat.

## Folder Structure

```
content-platform/
├── public/                      # Static assets
│   └── vite.svg
├── src/
│   ├── components/              # Reusable components
│   │   ├── ui/                  # UI components (shadcn/ui style)
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── scroll-area.tsx
│   │   └── AppLayout.tsx        # Main layout with navigation
│   ├── lib/
│   │   └── utils.ts             # Utility functions (cn helper)
│   ├── pages/                   # Page components (routes)
│   │   ├── About.tsx            # About page
│   │   ├── BlogUpload.tsx       # Blog creation with preview
│   │   ├── Chat.tsx             # Discord/WhatsApp style chat
│   │   ├── CreateContent.tsx    # Content type selection
│   │   ├── Dashboard.tsx        # Main dashboard with stats
│   │   ├── ImageUpload.tsx      # Multiple image upload
│   │   ├── LandingPage.tsx      # Public landing page
│   │   ├── Register.tsx         # Registration with avatar
│   │   ├── SignIn.tsx           # Sign in with Google OAuth
│   │   └── VideoUpload.tsx      # Video upload with preview
│   ├── App.tsx                  # Main app with routing
│   ├── index.css                # Global styles + Tailwind
│   └── main.tsx                 # React entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
├── tsconfig.node.json           # TypeScript config for Node
└── vite.config.ts               # Vite configuration

```

## Key Technologies

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM 6** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library

## Routes

- `/` - Landing page (public)
- `/signin` - Sign in page
- `/register` - Registration page
- `/dashboard` - Main dashboard (currently accessible)
- `/create` - Content type selection
- `/create/video` - Video upload page
- `/create/image` - Image upload page
- `/create/blog` - Blog editor page
- `/chat` - Real-time chat interface
- `/about` - About page

## Features

### Authentication
- Sign in with email/password
- Registration with username, fullname, email, password, and avatar
- Google OAuth integration (UI ready)
- Routes are currently accessible (add protection later)

### Dashboard
- Stats overview (views, content counts)
- Quick action buttons
- Recent activity feed
- Analytics metrics

### Content Creation
- **Video Upload**: File preview, title, description
- **Image Upload**: Multiple file support, grid preview
- **Blog Editor**: Rich text area, live preview, tags

### Chat
- Discord/WhatsApp style interface
- User list with online status
- Real-time messaging UI
- Search users functionality
- Message history display

### UI/UX
- Professional, industry-standard design
- Responsive layout (mobile-first)
- Dark mode ready (color tokens)
- Smooth animations and transitions
- Accessible components

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Notes

- This is frontend-only - no backend/database integration
- Mock authentication state (onSignIn/onRegister callbacks)
- Routes currently accessible without protection
- You can add route protection middleware later
- Ready for backend API integration
