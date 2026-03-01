import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import api from '../lib/api';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    topic: '',
    level: 'beginner',
    subject: '',
    numQuestions: 5
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quiz');
  const [currentGradient, setCurrentGradient] = useState(0);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'Computer Science', 'History', 'Geography', 'Literature',
    'Economics', 'Psychology', 'Engineering', 'Medicine'
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  // Different gradient combinations
  const gradients = [
    'from-indigo-400 via-purple-500 to-pink-500',
    'from-purple-400 via-pink-500 to-rose-500',
    'from-blue-400 via-indigo-500 to-purple-500',
    'from-cyan-400 via-blue-500 to-indigo-500',
    'from-teal-400 via-cyan-500 to-blue-500',
    'from-emerald-400 via-teal-500 to-cyan-500',
    'from-violet-400 via-purple-500 to-fuchsia-500',
    'from-sky-400 via-blue-500 to-indigo-500'
  ];

  // Change gradient every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [gradients.length]);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (api.isAuthenticated()) {
          if (api.isDemoMode()) {
            // Handle demo mode
            const demoUser = api.getDemoUser();
            setUser(demoUser);
          } else {
            // Handle real authentication
            const response = await api.getCurrentUser();
            setUser(response.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        api.logout();
      }
    };

    checkAuth();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateQuiz = async () => {
    if (!formData.topic || !formData.subject) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (api.isDemoMode()) {
        // Demo mode - create realistic mock quiz data based on topic
        const mockQuizId = 'demo-quiz-' + Date.now();
        
        // Generate topic-specific questions
        const generateTopicQuestions = (topic, subject, numQuestions) => {
          const questions = [];
          
          for (let i = 1; i <= numQuestions; i++) {
            let question, options, correctAnswer;
            
            if (subject.toLowerCase().includes('biology') || topic.toLowerCase().includes('biology')) {
              const biologyQuestions = [
                {
                  question: `What is the basic unit of life?`,
                  options: ['Cell', 'Atom', 'Molecule', 'Organ'],
                  correctAnswer: 0
                },
                {
                  question: `Which organelle is known as the powerhouse of the cell?`,
                  options: ['Nucleus', 'Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum'],
                  correctAnswer: 1
                },
                {
                  question: `What process do plants use to make their own food?`,
                  options: ['Respiration', 'Photosynthesis', 'Digestion', 'Excretion'],
                  correctAnswer: 1
                },
                {
                  question: `Which of the following is NOT a part of the cell theory?`,
                  options: ['All living things are made of cells', 'Cells come from pre-existing cells', 'Cells are the basic unit of life', 'All cells have a nucleus'],
                  correctAnswer: 3
                },
                {
                  question: `What is the function of DNA?`,
                  options: ['Energy storage', 'Genetic information storage', 'Cell structure', 'Waste removal'],
                  correctAnswer: 1
                }
              ];
              const questionData = biologyQuestions[i - 1] || biologyQuestions[0];
              question = questionData.question;
              options = questionData.options;
              correctAnswer = questionData.correctAnswer;
            } else if (subject.toLowerCase().includes('computer') || topic.toLowerCase().includes('computer')) {
              const computerQuestions = [
                {
                  question: `What does CPU stand for?`,
                  options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Computer Processing Unit'],
                  correctAnswer: 0
                },
                {
                  question: `Which programming language is known as the language of the web?`,
                  options: ['Python', 'Java', 'JavaScript', 'C++'],
                  correctAnswer: 2
                },
                {
                  question: `What is the primary function of RAM?`,
                  options: ['Long-term storage', 'Temporary memory', 'Processing data', 'Display output'],
                  correctAnswer: 1
                },
                {
                  question: `Which protocol is used for secure web browsing?`,
                  options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
                  correctAnswer: 1
                },
                {
                  question: `What is an algorithm?`,
                  options: ['A computer program', 'A step-by-step procedure', 'A programming language', 'A hardware component'],
                  correctAnswer: 1
                }
              ];
              const questionData = computerQuestions[i - 1] || computerQuestions[0];
              question = questionData.question;
              options = questionData.options;
              correctAnswer = questionData.correctAnswer;
            } else if (subject.toLowerCase().includes('math') || topic.toLowerCase().includes('math')) {
              const mathQuestions = [
                {
                  question: `What is the value of π (pi) to two decimal places?`,
                  options: ['3.12', '3.14', '3.16', '3.18'],
                  correctAnswer: 1
                },
                {
                  question: `What is the square root of 16?`,
                  options: ['2', '4', '8', '16'],
                  correctAnswer: 1
                },
                {
                  question: `What is 2 + 2 × 3?`,
                  options: ['12', '8', '10', '6'],
                  correctAnswer: 1
                },
                {
                  question: `What is the area of a circle with radius 5?`,
                  options: ['25π', '50π', '75π', '100π'],
                  correctAnswer: 0
                },
                {
                  question: `What is the slope of a horizontal line?`,
                  options: ['0', '1', 'Undefined', 'Infinity'],
                  correctAnswer: 0
                }
              ];
              const questionData = mathQuestions[i - 1] || mathQuestions[0];
              question = questionData.question;
              options = questionData.options;
              correctAnswer = questionData.correctAnswer;
            } else {
              // Generic questions for other subjects
              question = `Question ${i}: What is the main concept in ${topic}?`;
              options = ['Option A', 'Option B', 'Option C', 'Option D'];
              correctAnswer = 0;
            }
            
            questions.push({
              id: i,
              question,
              options,
              correctAnswer
            });
          }
          
          return questions;
        };
        
        const mockQuiz = {
          id: mockQuizId,
          topic: formData.topic,
          subject: formData.subject,
          level: formData.level,
          questions: generateTopicQuestions(formData.topic, formData.subject, formData.numQuestions)
        };
        
        // Store mock quiz in localStorage
        localStorage.setItem('currentQuiz', JSON.stringify(mockQuiz));
        
        // Redirect to quiz page
        window.location.href = `/quiz?quizId=${mockQuizId}&topic=${encodeURIComponent(formData.topic)}&level=${formData.level}&subject=${encodeURIComponent(formData.subject)}&numQuestions=${formData.numQuestions}&demo=true`;
      } else {
        // Real mode - call API
        const response = await api.generateQuiz({
          topic: formData.topic,
          subject: formData.subject,
          level: formData.level,
          numQuestions: formData.numQuestions
        });
        
        // Redirect to quiz page with the generated quiz data
        window.location.href = `/quiz?quizId=${response.quiz.id}&topic=${encodeURIComponent(formData.topic)}&level=${formData.level}&subject=${encodeURIComponent(formData.subject)}&numQuestions=${formData.numQuestions}`;
      }
    } catch (error) {
      setError(error.message || 'Failed to generate quiz');
      setIsLoading(false);
    }
  };

  const handleGenerateStudyPlan = async () => {
    if (!formData.topic || !formData.subject) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (api.isDemoMode()) {
        // Demo mode - create realistic mock study plan data based on topic
        const mockPlanId = 'demo-plan-' + Date.now();
        
        // Generate topic-specific study tasks
        const generateTopicTasks = (topic, subject) => {
          if (subject.toLowerCase().includes('biology') || topic.toLowerCase().includes('biology')) {
            return [
              { id: 1, title: 'Introduction to Cell Biology', completed: false, duration: '30 min', description: 'Learn about the basic unit of life and cell structure' },
              { id: 2, title: 'Study Cell Organelles', completed: false, duration: '45 min', description: 'Understand the functions of mitochondria, nucleus, and other organelles' },
              { id: 3, title: 'Practice Cell Division', completed: false, duration: '40 min', description: 'Learn about mitosis and meiosis processes' },
              { id: 4, title: 'Review DNA and Genetics', completed: false, duration: '35 min', description: 'Study genetic material and inheritance patterns' },
              { id: 5, title: 'Take Biology Quiz', completed: false, duration: '20 min', description: 'Test your knowledge with practice questions' }
            ];
          } else if (subject.toLowerCase().includes('computer') || topic.toLowerCase().includes('computer')) {
            return [
              { id: 1, title: 'Introduction to Computer Science', completed: false, duration: '30 min', description: 'Learn basic computer concepts and terminology' },
              { id: 2, title: 'Study Programming Fundamentals', completed: false, duration: '45 min', description: 'Understand variables, loops, and functions' },
              { id: 3, title: 'Practice Algorithm Design', completed: false, duration: '40 min', description: 'Learn problem-solving techniques and algorithms' },
              { id: 4, title: 'Review Data Structures', completed: false, duration: '35 min', description: 'Study arrays, lists, and other data structures' },
              { id: 5, title: 'Take Programming Quiz', completed: false, duration: '20 min', description: 'Test your coding knowledge' }
            ];
          } else if (subject.toLowerCase().includes('math') || topic.toLowerCase().includes('math')) {
            return [
              { id: 1, title: 'Review Basic Mathematical Concepts', completed: false, duration: '30 min', description: 'Refresh your knowledge of fundamental math principles' },
              { id: 2, title: 'Practice Problem Solving', completed: false, duration: '45 min', description: 'Work through step-by-step mathematical problems' },
              { id: 3, title: 'Study Mathematical Formulas', completed: false, duration: '40 min', description: 'Learn and memorize important mathematical formulas' },
              { id: 4, title: 'Review Mathematical Applications', completed: false, duration: '35 min', description: 'Understand real-world applications of mathematics' },
              { id: 5, title: 'Take Math Assessment', completed: false, duration: '20 min', description: 'Test your mathematical skills' }
            ];
          } else {
            return [
              { id: 1, title: `Introduction to ${topic}`, completed: false, duration: '30 min', description: `Learn the basics of ${topic}` },
              { id: 2, title: `Study ${topic} Concepts`, completed: false, duration: '45 min', description: `Deep dive into key concepts of ${topic}` },
              { id: 3, title: `Practice ${topic} Applications`, completed: false, duration: '40 min', description: `Apply your knowledge of ${topic}` },
              { id: 4, title: `Review ${topic} Fundamentals`, completed: false, duration: '35 min', description: `Review and reinforce your understanding` },
              { id: 5, title: `Take ${topic} Quiz`, completed: false, duration: '20 min', description: `Test your knowledge of ${topic}` }
            ];
          }
        };
        
        const mockPlan = {
          id: mockPlanId,
          topic: formData.topic,
          subject: formData.subject,
          level: formData.level,
          tasks: generateTopicTasks(formData.topic, formData.subject)
        };
        
        // Store mock plan in localStorage
        localStorage.setItem('currentStudyPlan', JSON.stringify(mockPlan));
        
        // Redirect to study plan page
        window.location.href = `/study-plan?planId=${mockPlanId}&topic=${encodeURIComponent(formData.topic)}&level=${formData.level}&subject=${encodeURIComponent(formData.subject)}&demo=true`;
      } else {
        // Real mode - call API
        const response = await api.generateStudyPlan({
          topic: formData.topic,
          subject: formData.subject,
          level: formData.level
        });
        
        // Redirect to study plan page with the generated plan data
        window.location.href = `/study-plan?planId=${response.studyPlan.id}&topic=${encodeURIComponent(formData.topic)}&level=${formData.level}&subject=${encodeURIComponent(formData.subject)}`;
      }
    } catch (error) {
      setError(error.message || 'Failed to generate study plan');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} relative overflow-hidden transition-all duration-1000`}>
      <Head>
        <title>Dashboard - EduMentor AI</title>
        <meta name="description" content="Generate personalized quizzes and study plans" />
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold text-white">EduMentor AI</span>
            </div>
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  {api.isDemoMode() && (
                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-200 text-sm font-medium">
                      Demo Mode
                    </span>
                  )}
                  <Link href="/profile" className="text-white/80 hover:text-white transition-colors font-medium">
                    Profile
                  </Link>
                  <button 
                    onClick={() => api.logout()}
                    className="text-white/80 hover:text-white transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-white/80 hover:text-white transition-colors font-medium">
                    Sign In
                  </Link>
                  <Link href="/signup" className="text-white/80 hover:text-white transition-colors font-medium">
                    Sign Up
                  </Link>
                </>
              )}
              <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            AI-Powered Learning Dashboard
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome{user ? `, ${user.name}` : ''} to Your
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Learning Dashboard
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Generate personalized quizzes and study plans powered by AI
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/20">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              🧠 AI Quiz Generator
            </button>
            <button
              onClick={() => setActiveTab('study-plan')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === 'study-plan'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              📘 Study Plan Creator
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Topic Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-3">
                What topic would you like to learn about? *
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., Calculus, Machine Learning, World War II..."
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                required
              />
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Subject Area *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                required
              >
                <option value="" className="bg-gray-800">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject} className="bg-gray-800">{subject}</option>
                ))}
              </select>
            </div>

            {/* Level Selection */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Your Learning Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value} className="bg-gray-800">{level.label}</option>
                ))}
              </select>
            </div>

            {/* Number of Questions (for Quiz) */}
            {activeTab === 'quiz' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-3">
                  Number of Questions
                </label>
                <select
                  name="numQuestions"
                  value={formData.numQuestions}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                >
                  <option value={5} className="bg-gray-800">5 Questions</option>
                  <option value={10} className="bg-gray-800">10 Questions</option>
                  <option value={15} className="bg-gray-800">15 Questions</option>
                  <option value={20} className="bg-gray-800">20 Questions</option>
                </select>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="mt-10 text-center">
            <button
              onClick={activeTab === 'quiz' ? handleGenerateQuiz : handleGenerateStudyPlan}
              disabled={isLoading}
              className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold text-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-pink-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {activeTab === 'quiz' ? 'Generate Quiz' : 'Create Study Plan'}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🧠",
              title: "AI-Powered Questions",
              description: "Questions generated using Groq AI for accurate and relevant content",
              gradient: "from-pink-500 to-purple-600"
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              description: "Visual charts showing your performance and weak areas",
              gradient: "from-blue-500 to-cyan-600"
            },
            {
              icon: "📚",
              title: "Resource Recommendations",
              description: "Get curated YouTube videos and articles for better learning",
              gradient: "from-green-500 to-emerald-600"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Quiz Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Quick Quiz Topics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { topic: 'General Knowledge', icon: '🌍', color: 'from-blue-500 to-cyan-600' },
              { topic: 'Mathematics', icon: '📐', color: 'from-green-500 to-emerald-600' },
              { topic: 'Science', icon: '🔬', color: 'from-purple-500 to-pink-600' },
              { topic: 'History', icon: '📚', color: 'from-orange-500 to-red-600' }
            ].map((quickTopic, index) => (
              <button
                key={index}
                onClick={() => {
                  setFormData({
                    topic: quickTopic.topic,
                    level: 'beginner',
                    subject: quickTopic.topic,
                    numQuestions: 5
                  });
                  setActiveTab('quiz');
                  handleGenerateQuiz();
                }}
                className={`group bg-gradient-to-r ${quickTopic.color} rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className="text-3xl mb-3">{quickTopic.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{quickTopic.topic}</h3>
                <p className="text-white/80 text-sm">5 questions • Beginner level</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 