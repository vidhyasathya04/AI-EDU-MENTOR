import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Results() {
  const router = useRouter();
  const [currentGradient, setCurrentGradient] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState([]);

  // Different gradient combinations
  const gradients = [
    'from-blue-400 via-purple-500 to-pink-500',
    'from-pink-400 via-rose-500 to-purple-500',
    'from-emerald-400 via-teal-500 to-cyan-500',
    'from-orange-400 via-red-500 to-pink-500',
    'from-indigo-400 via-purple-500 to-pink-500',
    'from-cyan-400 via-blue-500 to-indigo-500',
    'from-violet-400 via-purple-500 to-fuchsia-500',
    'from-sky-400 via-blue-500 to-indigo-500'
  ];

  // Change gradient every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [gradients.length]);

  // Get results from URL params
  useEffect(() => {
    if (router.isReady) {
      setScore(parseInt(router.query.score) || 0);
      setTotal(parseInt(router.query.total) || 0);
      setPercentage(parseInt(router.query.percentage) || 0);
      setTopic(router.query.topic || 'General Knowledge');
      setSubject(router.query.subject || 'Mixed');
      
      // Get review data from URL params
      if (router.query.reviewData) {
        try {
          const reviewData = JSON.parse(router.query.reviewData);
          setReviewData(reviewData);
        } catch (error) {
          console.error('Error parsing review data:', error);
          // Fallback to generating sample data
          generateReviewData();
        }
      } else {
        // Generate review data based on score if no review data provided
        generateReviewData();
      }
    }
  }, [router.isReady, router.query]);

  // Calculate weak categories for use in multiple places
  const weakCategories = reviewData ? reviewData.map(item => item.category) : [];
  const uniqueWeakCategories = [...new Set(weakCategories)];

  const generateReviewData = () => {
    // Sample quiz data with explanations (in real app, this would come from the quiz session)
    const sampleQuizData = [
      {
        question: "What is the capital of France?",
        userAnswer: "London",
        correctAnswer: "Paris",
        concept: "Geography - European Capitals",
        explanation: "Paris is the capital and largest city of France. It has been the capital since 987 CE and is known as the 'City of Light'.",
        difficulty: "Beginner",
        category: "Geography"
      },
      {
        question: "Which planet is known as the Red Planet?",
        userAnswer: "Venus",
        correctAnswer: "Mars",
        concept: "Astronomy - Solar System Planets",
        explanation: "Mars is called the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface.",
        difficulty: "Beginner",
        category: "Science"
      },
      {
        question: "What is the chemical symbol for gold?",
        userAnswer: "Ag",
        correctAnswer: "Au",
        concept: "Chemistry - Chemical Symbols",
        explanation: "Au comes from the Latin word 'aurum' which means gold. Ag is the symbol for silver (argentum).",
        difficulty: "Intermediate",
        category: "Chemistry"
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        userAnswer: "Charles Dickens",
        correctAnswer: "William Shakespeare",
        concept: "Literature - Shakespearean Works",
        explanation: "William Shakespeare wrote 'Romeo and Juliet' between 1591-1595. It's one of his most famous tragedies.",
        difficulty: "Beginner",
        category: "Literature"
      },
      {
        question: "What is the largest ocean on Earth?",
        userAnswer: "Atlantic Ocean",
        correctAnswer: "Pacific Ocean",
        concept: "Geography - World Oceans",
        explanation: "The Pacific Ocean covers about 30% of Earth's surface and is the largest and deepest ocean on our planet.",
        difficulty: "Beginner",
        category: "Geography"
      }
    ];

    // Filter wrong answers based on score
    const wrongAnswers = sampleQuizData.slice(0, total - score);
    setReviewData(wrongAnswers);
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! You're a master!", emoji: "🏆", color: "from-yellow-400 to-orange-500" };
    if (percentage >= 80) return { message: "Excellent work! Keep it up!", emoji: "🌟", color: "from-green-400 to-emerald-500" };
    if (percentage >= 70) return { message: "Good job! You're improving!", emoji: "👍", color: "from-blue-400 to-cyan-500" };
    if (percentage >= 60) return { message: "Not bad! Keep practicing!", emoji: "💪", color: "from-purple-400 to-pink-500" };
    return { message: "Keep learning! You'll get better!", emoji: "📚", color: "from-red-400 to-pink-500" };
  };

  const getAIRecommendations = () => {
    const recommendations = [];
    
    // Analyze performance patterns
    const isLowPerformance = percentage < 60;
    const isMediumPerformance = percentage >= 60 && percentage < 80;
    const isHighPerformance = percentage >= 80;
    
    // Use the component-level uniqueWeakCategories variable
    const mostCommonWeakCategory = uniqueWeakCategories.length > 0 ? 
      uniqueWeakCategories.reduce((a, b) => 
        weakCategories.filter(v => v === a).length >= weakCategories.filter(v => v === b).length ? a : b
      ) : null;
    
    // Subject-specific recommendations
    if (subject.toLowerCase().includes('chemistry')) {
      if (isLowPerformance) {
        recommendations.push({
          type: "Chemistry Fundamentals",
          title: "Master Chemical Basics",
          description: "Focus on atomic structure, chemical symbols, and basic bonding concepts. Start with the periodic table fundamentals.",
          icon: "⚗️",
          priority: "High",
          action: "Practice basic chemistry concepts",
          resources: ["Periodic Table", "Chemical Bonding", "Atomic Structure"]
        });
      }
      
      if (mostCommonWeakCategory === 'Chemistry') {
        recommendations.push({
          type: "Chemistry Practice",
          title: "Chemical Reactions & Equations",
          description: "Practice balancing chemical equations and understanding reaction mechanisms. Focus on stoichiometry.",
          icon: "🧪",
          priority: "High",
          action: "Study chemical equations",
          resources: ["Stoichiometry", "Reaction Types", "Balancing Equations"]
        });
      }
    }
    
    if (subject.toLowerCase().includes('physics')) {
      if (isLowPerformance) {
        recommendations.push({
          type: "Physics Fundamentals",
          title: "Understand Core Concepts",
          description: "Focus on Newton's laws, energy conservation, and basic mechanics. Build a strong foundation in classical physics.",
          icon: "⚡",
          priority: "High",
          action: "Study Newton's laws and mechanics",
          resources: ["Newton's Laws", "Energy Conservation", "Mechanics"]
        });
      }
      
      if (mostCommonWeakCategory === 'Physics') {
        recommendations.push({
          type: "Physics Practice",
          title: "Problem-Solving Skills",
          description: "Practice applying physics formulas to real-world problems. Focus on dimensional analysis and unit conversions.",
          icon: "🔬",
          priority: "High",
          action: "Practice physics problems",
          resources: ["Problem Solving", "Formula Application", "Unit Conversions"]
        });
      }
    }
    
    if (subject.toLowerCase().includes('biology')) {
      if (isLowPerformance) {
        recommendations.push({
          type: "Biology Fundamentals",
          title: "Cell Biology Basics",
          description: "Start with cell structure, organelles, and basic biological processes. Understand the building blocks of life.",
          icon: "🧬",
          priority: "High",
          action: "Study cell biology",
          resources: ["Cell Structure", "Organelles", "Biological Processes"]
        });
      }
      
      if (mostCommonWeakCategory === 'Biology') {
        recommendations.push({
          type: "Biology Practice",
          title: "Systems & Processes",
          description: "Focus on human anatomy, genetics, and ecological systems. Understand how different biological systems interact.",
          icon: "🫀",
          priority: "High",
          action: "Study biological systems",
          resources: ["Human Anatomy", "Genetics", "Ecology"]
        });
      }
    }
    
    if (subject.toLowerCase().includes('mathematics')) {
      if (isLowPerformance) {
        recommendations.push({
          type: "Math Fundamentals",
          title: "Build Mathematical Foundation",
          description: "Focus on basic arithmetic, algebra fundamentals, and problem-solving strategies. Practice mental math.",
          icon: "📐",
          priority: "High",
          action: "Practice basic math skills",
          resources: ["Arithmetic", "Algebra Basics", "Problem Solving"]
        });
      }
      
      if (mostCommonWeakCategory === 'Mathematics') {
        recommendations.push({
          type: "Math Practice",
          title: "Advanced Problem Solving",
          description: "Practice complex mathematical problems, proofs, and applications. Focus on logical reasoning.",
          icon: "🧮",
          priority: "High",
          action: "Practice advanced math",
          resources: ["Calculus", "Geometry", "Statistics"]
        });
      }
    }
    
    if (subject.toLowerCase().includes('computer science')) {
      if (isLowPerformance) {
        recommendations.push({
          type: "CS Fundamentals",
          title: "Programming Basics",
          description: "Start with basic programming concepts, algorithms, and data structures. Practice coding regularly.",
          icon: "💻",
          priority: "High",
          action: "Learn programming basics",
          resources: ["Programming Concepts", "Algorithms", "Data Structures"]
        });
      }
      
      if (mostCommonWeakCategory === 'Computer Science') {
        recommendations.push({
          type: "CS Practice",
          title: "Advanced Programming",
          description: "Focus on software design patterns, system architecture, and advanced algorithms.",
          icon: "🔧",
          priority: "High",
          action: "Practice advanced programming",
          resources: ["Design Patterns", "System Architecture", "Advanced Algorithms"]
        });
      }
    }
    
    // Performance-based general recommendations
    if (isLowPerformance) {
      recommendations.push({
        type: "Study Strategy",
        title: "Structured Learning Approach",
        description: "Break down complex topics into smaller, manageable chunks. Use spaced repetition and active recall techniques.",
        icon: "📚",
        priority: "High",
        action: "Implement structured study plan",
        resources: ["Spaced Repetition", "Active Recall", "Note-taking Methods"]
      });
      
      recommendations.push({
        type: "Time Management",
        title: "Optimize Study Sessions",
        description: "Study in focused 25-minute sessions with 5-minute breaks. Avoid cramming and maintain consistent study schedule.",
        icon: "⏰",
        priority: "High",
        action: "Use Pomodoro technique",
        resources: ["Pomodoro Technique", "Study Scheduling", "Focus Methods"]
      });
    }
    
    if (isMediumPerformance) {
      recommendations.push({
        type: "Practice Strategy",
        title: "Targeted Practice",
        description: "Focus on your weak areas identified in this quiz. Take more practice tests on similar topics.",
        icon: "🎯",
        priority: "Medium",
        action: "Practice weak areas",
        resources: ["Practice Tests", "Weak Area Focus", "Review Sessions"]
      });
      
      recommendations.push({
        type: "Learning Enhancement",
        title: "Active Learning Methods",
        description: "Use mind maps, flashcards, and teach-back methods to reinforce your understanding.",
        icon: "🧠",
        priority: "Medium",
        action: "Use active learning techniques",
        resources: ["Mind Mapping", "Flashcards", "Teach-back Method"]
      });
    }
    
    if (isHighPerformance) {
      recommendations.push({
        type: "Advanced Learning",
        title: "Challenge Yourself",
        description: "Move to more advanced topics and complex problems. Consider teaching others to deepen your understanding.",
        icon: "🚀",
        priority: "Medium",
        action: "Explore advanced topics",
        resources: ["Advanced Topics", "Complex Problems", "Peer Teaching"]
      });
      
      recommendations.push({
        type: "Knowledge Application",
        title: "Real-World Application",
        description: "Apply your knowledge to real-world scenarios and projects. Connect theory with practical applications.",
        icon: "🌍",
        priority: "Medium",
        action: "Apply knowledge practically",
        resources: ["Real Projects", "Case Studies", "Practical Applications"]
      });
    }
    
    // Always include these recommendations
    recommendations.push({
      type: "Review Strategy",
      title: "Regular Review Sessions",
      description: "Schedule regular review sessions to reinforce learning and prevent forgetting. Use the spaced repetition technique.",
      icon: "📖",
      priority: "Medium",
      action: "Schedule regular reviews",
      resources: ["Review Schedule", "Spaced Repetition", "Retention Techniques"]
    });
    
    recommendations.push({
      type: "Resource Utilization",
      title: "Diversify Learning Resources",
      description: "Use multiple learning resources including videos, books, practice tests, and interactive simulations.",
      icon: "📱",
      priority: "Medium",
      action: "Use diverse resources",
      resources: ["Video Tutorials", "Interactive Simulations", "Practice Tests"]
    });
    
    // Add specific recommendations based on wrong answers
    if (reviewData.length > 0) {
      const difficultyLevels = reviewData.map(item => item.difficulty);
      const hasAdvancedQuestions = difficultyLevels.includes('Advanced');
      const hasIntermediateQuestions = difficultyLevels.includes('Intermediate');
      
      if (hasAdvancedQuestions && isLowPerformance) {
        recommendations.push({
          type: "Difficulty Adjustment",
          title: "Start with Basics",
          description: "You're attempting advanced questions but struggling. Focus on mastering intermediate concepts first.",
          icon: "📈",
          priority: "High",
          action: "Practice intermediate level",
          resources: ["Intermediate Topics", "Foundation Building", "Progressive Learning"]
        });
      }
      
      if (hasIntermediateQuestions && isLowPerformance) {
        recommendations.push({
          type: "Foundation Building",
          title: "Strengthen Fundamentals",
          description: "Focus on basic concepts before moving to intermediate topics. Build a solid foundation.",
          icon: "🏗️",
          priority: "High",
          action: "Master basic concepts",
          resources: ["Basic Concepts", "Foundation Topics", "Core Principles"]
        });
      }
    }
    
    return recommendations.slice(0, 6); // Limit to 6 recommendations for better UI
  };

  const performance = getPerformanceMessage();
  const aiRecommendations = getAIRecommendations();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} relative overflow-hidden transition-all duration-1000`}>
      <Head>
        <title>Quiz Results - EduMentor AI</title>
        <meta name="description" content="Your quiz results and performance analytics" />
      </Head>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full opacity-5 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold text-white">EduMentor AI</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/quiz" className="text-white/80 hover:text-white transition-colors font-medium">
                Take Quiz
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Quiz Results
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Your Results
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Are In!
            </span>
          </h1>
          <p className="text-xl text-white/70">
            {topic} • {subject}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="text-center">
            <div className={`w-32 h-32 bg-gradient-to-r ${performance.color} rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-2xl`}>
              {performance.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{performance.message}</h2>
            <p className="text-white/70 mb-8">You scored {score} out of {total} questions correctly</p>
            
            {/* Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-2000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{percentage}%</div>
                  <div className="text-white/70 text-sm">Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">{score}/{total}</div>
            <div className="text-white/70">Correct Answers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">{total - score}</div>
            <div className="text-white/70">Incorrect Answers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">{Math.round((score / total) * 100)}%</div>
            <div className="text-white/70">Accuracy Rate</div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">📈 Learning Progress</h3>
            <div className="text-sm text-white/60">Your improvement journey</div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Progress Chart */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Performance Trend</h4>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-end justify-between h-32 mb-4">
                  {/* Mock progress bars - in real app, this would be dynamic */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg mb-2" style={{height: '60%'}}></div>
                    <div className="text-xs text-white/60">Quiz 1</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg mb-2" style={{height: '75%'}}></div>
                    <div className="text-xs text-white/60">Quiz 2</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg mb-2" style={{height: '65%'}}></div>
                    <div className="text-xs text-white/60">Quiz 3</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-lg mb-2" style={{height: `${percentage}%`}}></div>
                    <div className="text-xs text-white/60">Current</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{percentage}%</div>
                  <div className="text-white/60 text-sm">Current Score</div>
                </div>
              </div>
            </div>
            
            {/* Learning Insights */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">AI Insights</h4>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">🎯</span>
                    <span className="text-white font-medium">Strengths</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    {percentage >= 70 ? 
                      "You're showing strong understanding of core concepts. Keep building on this foundation!" :
                      "Focus on mastering basic concepts first, then gradually increase difficulty."
                    }
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">💡</span>
                    <span className="text-white font-medium">Areas to Improve</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    {uniqueWeakCategories && uniqueWeakCategories.length > 0 ? 
                      `Focus on: ${uniqueWeakCategories.slice(0, 2).join(', ')}` :
                      "Continue practicing to maintain your current level of understanding."
                    }
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">🚀</span>
                    <span className="text-white font-medium">Next Steps</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    {percentage >= 80 ? 
                      "Ready for advanced topics! Challenge yourself with complex problems." :
                      "Take more practice quizzes and review the concepts you struggled with."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        {reviewData.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Review Wrong Answers</h3>
              <button
                onClick={() => setShowReview(!showReview)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
              >
                {showReview ? 'Hide Review' : 'Show Review'}
              </button>
            </div>
            
            {showReview && (
              <div className="space-y-6">
                {reviewData.map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">{item.question}</h4>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                            <div className="text-sm text-red-300 mb-1">Your Answer</div>
                            <div className="text-white font-medium">{item.userAnswer}</div>
                          </div>
                          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                            <div className="text-sm text-green-300 mb-1">Correct Answer</div>
                            <div className="text-white font-medium">{item.correctAnswer}</div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {item.difficulty}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-white/70 mb-1">Concept</div>
                        <div className="text-white font-medium">{item.concept}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70 mb-1">Explanation</div>
                        <div className="text-white/90 leading-relaxed">{item.explanation}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70 mb-1">Category</div>
                        <div className="text-white font-medium">{item.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Recommendations */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">🤖 AI-Powered Recommendations</h3>
            <div className="text-sm text-white/60">Based on your performance analysis</div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {aiRecommendations.map((rec, index) => (
              <div
                key={index}
                onClick={() => {
                  // In a real app, this would open detailed recommendation view
                  const searchQuery = encodeURIComponent(`${rec.title} ${subject} learning resources`);
                  window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                }}
                className={`bg-gradient-to-r ${rec.priority === 'High' ? 'from-red-500/20 to-pink-500/20 border-red-500/30' : 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'} rounded-2xl p-6 border hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{rec.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm text-white/70 font-medium">{rec.type}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        rec.priority === 'High' ? 'bg-red-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{rec.title}</h4>
                    <p className="text-white/80 leading-relaxed mb-4">{rec.description}</p>
                    
                    {/* Action Item */}
                    {rec.action && (
                      <div className="mb-4">
                        <div className="text-sm text-white/60 mb-2 font-medium">🎯 Recommended Action:</div>
                        <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                          <span className="text-white font-medium">{rec.action}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Resources */}
                    {rec.resources && rec.resources.length > 0 && (
                      <div>
                        <div className="text-sm text-white/60 mb-2 font-medium">📚 Suggested Resources:</div>
                        <div className="flex flex-wrap gap-2">
                          {rec.resources.map((resource, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                // In a real app, this would open specific learning resources
                                const searchQuery = encodeURIComponent(`${resource} ${subject} tutorial`);
                                window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
                              }}
                              className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/90 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                              {resource}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const quizUrl = `/quiz?topic=${encodeURIComponent(rec.title)}&level=beginner&subject=${encodeURIComponent(subject)}&random=${Date.now()}`;
                            window.location.href = quizUrl;
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-xs font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                        >
                          Practice Now
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real app, this would save to study plan
                            alert(`Added "${rec.title}" to your study plan!`);
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105"
                        >
                          Add to Study Plan
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real app, this would open detailed learning path
                            const searchQuery = encodeURIComponent(`${rec.title} ${subject} learning path`);
                            window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {aiRecommendations.filter(r => r.priority === 'High').length}
                </div>
                <div className="text-white/60 text-sm">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {aiRecommendations.filter(r => r.priority === 'Medium').length}
                </div>
                <div className="text-white/60 text-sm">Medium Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {aiRecommendations.length}
                </div>
                <div className="text-white/60 text-sm">Total Recommendations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href={`/quiz?topic=${encodeURIComponent(topic)}&level=beginner&subject=${encodeURIComponent(subject)}&random=${Date.now()}`} className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            Take Another Quiz 🚀
          </Link>
          <Link href="/dashboard" className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-300">
            Back to Dashboard
          </Link>
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105">
            Share Results 📤
          </button>
        </div>
      </main>
    </div>
  );
} 