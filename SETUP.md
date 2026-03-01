# EduMentor AI Setup Guide

## Quick Start (Demo Mode)

The app now supports demo mode, so you can explore all features without setting up a database or API keys!

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and go to:** `http://localhost:3004`

3. **Try the signup process** - when you get the "Failed to fetch" error, click "Continue in Demo Mode" to explore the app with mock data.

## Full Setup (With Database & AI Features)

To use the app with real data persistence and AI-powered features, you'll need to set up environment variables.

### 1. Create Environment File

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
# For local MongoDB, use: mongodb://localhost:27017/edu-mentor-ai
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/edu-mentor-ai
DATABASE_URL=mongodb://localhost:27017/edu-mentor-ai

# JWT Secret (generate a random string for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Groq API Key (optional - for AI features)
# Get your free API key from: https://console.groq.com/
GROQ_API_KEY=your-groq-api-key-here

# App URL (optional - defaults to localhost:3004)
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `DATABASE_URL=mongodb://localhost:27017/edu-mentor-ai`

#### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Use: `DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/edu-mentor-ai`

### 3. AI Features Setup

1. Go to [Groq Console](https://console.groq.com/)
2. Create a free account
3. Get your API key
4. Add it to: `GROQ_API_KEY=your-key-here`

### 4. JWT Secret

Generate a random string for JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Features

### Demo Mode
- ✅ Explore all UI features
- ✅ Generate mock quizzes and study plans
- ✅ View dashboard and profile pages
- ❌ No data persistence
- ❌ No real AI-generated content

### Full Mode
- ✅ Real user authentication
- ✅ Data persistence in MongoDB
- ✅ AI-powered quiz generation
- ✅ AI-powered study plan creation
- ✅ Progress tracking
- ✅ User statistics

## Troubleshooting

### "Failed to fetch" Error
This means the backend API is not available. The app will automatically offer demo mode as an alternative.

### MongoDB Connection Issues
- Check if MongoDB is running (local) or accessible (Atlas)
- Verify your connection string
- Ensure network connectivity

### Groq API Issues
- Verify your API key is correct
- Check your Groq account has available credits
- Ensure the API key has proper permissions

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run create-demo-user` - Create a demo user (requires MongoDB)

### Project Structure
- `/pages` - Next.js pages and API routes
- `/lib` - Utility functions and models
- `/public` - Static assets
- `/styles` - CSS files 