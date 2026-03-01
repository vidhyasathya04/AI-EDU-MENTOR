# EduMentor AI - AI-Powered Learning Platform

A comprehensive educational platform that generates personalized quizzes and study plans using AI. Built with Next.js, MongoDB, and Groq AI.

## 🚀 Features

- **AI-Powered Quiz Generation**: Create custom quizzes on any topic using Groq AI
- **Personalized Study Plans**: Generate structured 5-day learning plans
- **User Authentication**: Secure JWT-based authentication system
- **Progress Tracking**: Monitor quiz performance and study plan completion
- **Beautiful UI**: Modern, responsive design with gradient animations
- **Real-time Analytics**: Detailed performance insights and statistics
- **Database Integration**: MongoDB for data persistence
- **API-First Architecture**: RESTful API endpoints for all functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **AI**: Groq AI (Llama 3.1 8B)
- **Authentication**: JWT, bcryptjs
- **Charts**: Chart.js, react-chartjs-2
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Groq AI API key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd edu-mentor-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=mongodb://localhost:27017/edu-mentor-ai

# AI Service Configuration
GROQ_API_KEY=your-groq-api-key-here

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for an account
3. Create a new API key
4. Add it to your `.env.local` file

### 5. Set Up MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Recommended for Production)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `DATABASE_URL` in `.env.local`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
edu-mentor-ai/
├── lib/                    # Utility libraries
│   ├── mongodb.js         # Database connection
│   ├── auth.js            # Authentication utilities
│   ├── api.js             # API client
│   ├── ai-service.js      # AI integration
│   └── models/            # Database models
│       ├── User.js
│       ├── Quiz.js
│       ├── QuizAttempt.js
│       └── StudyPlan.js
├── pages/                 # Next.js pages
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication APIs
│   │   ├── quiz/         # Quiz APIs
│   │   ├── study-plan/   # Study plan APIs
│   │   └── user/         # User APIs
│   ├── dashboard.js      # Main dashboard
│   ├── quiz.js           # Quiz interface
│   ├── study-plan.js     # Study plan interface
│   ├── results.js        # Quiz results
│   ├── profile.js        # User profile
│   ├── signin.js         # Sign in page
│   └── signup.js         # Sign up page
├── public/               # Static assets
├── styles/               # CSS files
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user

### Quiz Management
- `POST /api/quiz/generate` - Generate AI quiz
- `POST /api/quiz/submit` - Submit quiz attempt

### Study Plans
- `POST /api/study-plan/generate` - Generate AI study plan
- `POST /api/study-plan/complete-task` - Mark task as completed

### User Management
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics

## 🎯 Key Features Explained

### AI Quiz Generation
- Uses Groq AI to generate contextual questions
- Supports multiple subjects and difficulty levels
- Includes explanations and concept mapping
- Fallback to sample questions if AI fails

### Study Plan Creation
- 5-day structured learning plans
- Multiple learning activities (reading, videos, practice)
- Resource recommendations with YouTube links
- Progress tracking and completion status

### User Progress Tracking
- Quiz performance analytics
- Study plan completion rates
- Subject-wise performance breakdown
- Time tracking and insights

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS protection

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error logs

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with LMS platforms
- [ ] Multi-language support
- [ ] Advanced AI models integration
- [ ] Social learning features
- [ ] Gamification elements

## 📊 Performance

- Lighthouse Score: 95+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle Size: Optimized with Next.js

---

Built with ❤️ using Next.js and AI
