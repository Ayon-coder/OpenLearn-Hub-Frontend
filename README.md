<div align="center">

# 📚 OpenLearn Hub - Frontend

### **The Intelligent Learning Platform Interface**

A modern, high-performance educational platform built with React 19 and TypeScript

[Features](#-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [Deployment](#-deployment)

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📖 Overview

The **OpenLearn Hub Frontend** is a cutting-edge educational web application designed to provide seamless learning experiences for students and educators. Built with **React 19** and **TypeScript**, it features a responsive design with glassmorphism aesthetics, real-time interactivity, and a comprehensive suite of tools for content sharing, AI-powered learning assistance, and community collaboration.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-Role System**: Support for Students, Teachers, and Admins with role-based access control
- **Secure Registration**: Account verification workflow with admin approval
- **Admin Dashboard**: Dedicated admin interface for user management and approvals

### 📚 Learning Hub
- **Subject Explorer**: Browse subjects, topics, and subtopics in a hierarchical structure
- **Community Notes**: Share and discover study materials from the community
- **Trending Content**: Discover popular and highly-rated learning resources
- **Course Notes**: Access structured course materials with rich content

### 🤖 AI-Powered Features
- **AI Assistant**: Integrated chatbot powered by Gemini/Groq for instant doubt resolution
- **Mentor Mode**: Interactive conversations with AI for personalized learning guidance
- **Concept Mirror**: AI-powered concept analysis and feedback system

### 📁 My Drive
- **Personal Storage**: Organize and manage uploaded resources efficiently
- **File Management**: Upload, organize, and share educational content
- **Download History**: Track and access previously downloaded materials

### 🎯 Interactive Tools
- **Quiz Creator**: Create and manage interactive quizzes for assessments
- **Note Upload**: Contribution system for sharing study materials
- **Subscriptions**: Follow favorite creators and get updates on new content

### 👥 User Features
- **User Dashboard**: Personalized dashboard with quick actions and statistics
- **Profile Management**: Comprehensive profile settings and customization
- **Contribution Tracking**: Monitor your contributions to the community
- **Leaderboard**: Recognition for top contributors

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Sleek, modern interface with glass-effect components
- **Dark Mode Ready**: Beautiful dark theme optimized for comfortable viewing
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile
- **Data Visualization**: Interactive charts with Recharts for analytics

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|:---|:---|:---|
| **React** | 19.x | UI Library with latest features |
| **TypeScript** | 5.x | Static typing and enhanced DX |
| **Vite** | 6.x | Fast build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **React Router** | 7.x | Client-side routing |
| **Lucide React** | Latest | Beautiful icon library |
| **Recharts** | 3.x | Data visualization components |
| **React Markdown** | 10.x | Markdown rendering |
| **React Syntax Highlighter** | 16.x | Code syntax highlighting |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # App configuration and main entry
│   │   └── App.tsx             # Main application with routing
│   ├── components/             # Reusable UI components
│   │   ├── ai-assistant/       # AI chatbot components
│   │   ├── chat/               # Chat interface components
│   │   ├── content/            # Content display components
│   │   ├── drive/              # File management components
│   │   ├── editor/             # Text/content editors
│   │   ├── forms/              # Form components
│   │   ├── interaction/        # Interactive elements
│   │   ├── layout/             # Layout components (Header, Sidebar)
│   │   ├── modals/             # Modal dialogs
│   │   ├── quiz/               # Quiz components
│   │   └── ui/                 # Base UI components
│   ├── constants/              # App constants and configurations
│   ├── data/                   # Static data and mock content
│   ├── pages/                  # Page components
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── ai/                 # AI assistant pages
│   │   ├── auth/               # Login, Signup, Verification
│   │   ├── content/            # Content viewing/upload pages
│   │   ├── drive/              # My Drive pages
│   │   ├── hub/                # Learning hub explorer
│   │   ├── quiz/               # Quiz creation pages
│   │   └── user/               # User dashboard and profile
│   ├── services/               # API and business logic services
│   │   ├── admin/              # Admin API services
│   │   ├── ai/                 # AI integration services
│   │   ├── auth/               # Authentication services
│   │   ├── content/            # Content management services
│   │   ├── download/           # Download handling
│   │   ├── drive/              # Drive services
│   │   ├── quiz/               # Quiz services
│   │   ├── storage/            # Local storage services
│   │   └── user/               # User management services
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── vercel.json                 # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/tech-akash010/OpenLearn-Hub.git
cd OpenLearn-Hub/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# AI Assistant Backend URL (Python Flask)
VITE_AI_URL=http://localhost:5050
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

---

## 🌐 Available Routes

| Route | Description | Auth Required |
|:---|:---|:---|
| `/` | User Dashboard | No |
| `/login` | Login Page | No |
| `/signup` | Registration Page | No |
| `/hub` | Learning Hub Explorer | No |
| `/browse` | Browse by Path | No |
| `/trending` | Trending Notes | No |
| `/note/:noteId` | Shared Note View | No |
| `/ai-assistant` | AI Assistant Chat | Yes |
| `/my-drive` | Personal Drive | Yes |
| `/profile` | User Profile | Yes |
| `/quiz/create` | Quiz Creator | Yes |
| `/notes/upload` | Upload Notes | Yes |
| `/subscriptions` | Subscriptions | Yes |
| `/contribute` | Contribution Page | Yes |
| `/admin/login` | Admin Login | No |
| `/admin/dashboard` | Admin Dashboard | Admin Only |

---

## 🔗 Backend Integration

This frontend connects to two backend services:

1. **Node.js Backend** (Port 5000)
   - User authentication and management
   - Admin operations
   - Firebase Firestore integration
   
2. **Python AI Backend** (Port 5050)
   - AI Assistant (Mentor Mode)
   - Concept Analysis
   - Gemini/Groq integration


---

## 📦 Deployment

### Vercel (Recommended)

The project includes a `vercel.json` configuration for easy deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting service

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 Related Links

- **Backend Repository**: https://github.com/Ayon-coder/OpenLearn-Hub-Backend.git
- **Live Demo**: https://openlearn-hub-v8.vercel.app
