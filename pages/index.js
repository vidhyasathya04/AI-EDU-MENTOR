import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentGradient, setCurrentGradient] = useState(0);

  // Different gradient combinations
  const gradients = [
    'from-violet-500 via-purple-600 to-indigo-700',
    'from-rose-500 via-pink-600 to-purple-700',
    'from-cyan-500 via-blue-600 to-indigo-700',
    'from-emerald-500 via-teal-600 to-cyan-700',
    'from-orange-500 via-red-600 to-pink-700',
    'from-yellow-500 via-orange-600 to-red-700',
    'from-lime-500 via-green-600 to-emerald-700',
    'from-sky-500 via-blue-600 to-indigo-700'
  ];

  // Change gradient every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [gradients.length]);

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/signup';
    }, 1000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} relative overflow-hidden transition-all duration-1000`}>
      <Head>
        <title>EduMentor AI - Personalized Learning Coach</title>
        <meta name="description" content="AI-powered personalized learning platform that adapts to each student's needs" />
      </Head>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold text-white">EduMentor AI</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/signin" className="text-white/80 hover:text-white transition-colors font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-medium mb-8 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            AI-Powered Learning Platform
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Learning Coach
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience personalized education that adapts to your learning style. 
            Get AI-generated quizzes, study plans, and progress tracking all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-2xl hover:shadow-pink-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Get Started Free</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </>
                )}
              </div>
            </button>
            
            <Link href="/demo" className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Try Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-white/70">Topics Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/70">Quizzes Generated</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-white/70">Student Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose EduMentor AI?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🧠",
                title: "AI Quiz Generator",
                description: "Personalized MCQs generated using Groq AI for any topic",
                gradient: "from-pink-500 to-purple-600"
              },
              {
                icon: "📘",
                title: "Study Plan Creator",
                description: "Smart 5-day study plans tailored to your learning level",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                icon: "📊",
                title: "Progress Tracker",
                description: "Visual charts showing your weak areas and improvement",
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: "🔗",
                title: "Resource Recommender",
                description: "AI-curated YouTube videos and articles for better learning",
                gradient: "from-orange-500 to-red-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Learning?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already learning smarter with AI
              </p>
              <Link href="/dashboard" className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                <span>Start Learning Now</span>
                <span className="text-2xl">🚀</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/20 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-xl font-bold text-white">EduMentor AI</span>
            </div>
            <p className="text-white/60 mb-4 max-w-2xl mx-auto">
              Empowering students with AI-driven personalized learning experiences
            </p>
            <div className="text-white/40 text-sm">
              © 2024 EduMentor AI. Built for iGebra.ai Hackathon.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
