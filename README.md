# OpenLearn-Hub Frontend

A modern, feature-rich educational platform built with React, TypeScript, and Vite. OpenLearn-Hub provides a comprehensive learning experience with community notes, course management, subscriptions, and AI-powered features.

## 🚀 Features

- **📚 Course Management** - Browse, create, and manage educational courses
- **📝 Community Notes** - Share and discover community-contributed notes
- **🎯 Learning Paths** - Structured learning journeys across subjects
- **🏆 Gamification** - Leaderboards, achievements, and XP system
- **👥 Subscriptions** - Follow creators and get updates
- **📊 Progress Tracking** - Track your learning journey
- **🤖 AI Integration** - Powered by Google Gemini API
- **📱 Responsive Design** - Works seamlessly on all devices

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Recharts** - Data Visualization

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/openlearn-hub-frontend.git

# Navigate to the project directory
cd openlearn-hub-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# For production, use your deployed backend URL
# VITE_API_URL=https://your-backend.vercel.app
```

## 🚀 Deployment on Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/openlearn-hub-frontend)

### Option 2: Manual Deployment

1. Push your code to GitHub
2. Import the repository in Vercel Dashboard
3. Configure environment variables:
   - `VITE_API_URL` - Your deployed backend URL
4. Deploy!

### Vercel Configuration

The `vercel.json` file is pre-configured with:
- SPA routing support
- Security headers
- Asset caching
- Clean URLs

## 📜 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── app/           # App entry and routing
├── components/    # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── pages/         # Page components
├── services/      # API and service functions
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🔗 Related

- [OpenLearn-Hub Backend](https://github.com/your-username/openlearn-hub-backend) - Backend API

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ for the love of learning
