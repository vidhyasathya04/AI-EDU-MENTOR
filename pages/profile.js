import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PDFDownloadLink } from '@react-pdf/renderer';
import StudyReportPDF from '../components/StudyReportPDF';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [currentGradient, setCurrentGradient] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  // Vibrant gradient combinations
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

  // Change gradient every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [gradients.length]);

  // Load user data from API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Check if user is authenticated
        if (!api.isAuthenticated()) {
          router.push('/signin');
          return;
        }

        // Check if user is in demo mode
        if (api.isDemoMode()) {
          // Use demo user data
          const demoUser = api.getDemoUser();
          if (demoUser) {
            setUserData(demoUser);
            // Create mock stats for demo mode
            setUserStats({
              stats: {
                totalQuizzes: 12,
                totalScore: 850,
                averageScore: 78,
                completedStudyPlans: 3,
                totalStudyPlans: 5,
                totalStudyTime: 480 // minutes
              },
              subjectPerformance: {
                'Biology': { percentage: 85, quizzes: 4 },
                'Mathematics': { percentage: 72, quizzes: 3 },
                'Computer Science': { percentage: 88, quizzes: 5 }
              },
              recentActivity: [
                { type: 'quiz', title: 'Cell Biology Quiz', score: 90, date: '2024-01-15' },
                { type: 'study-plan', title: 'Introduction to Genetics', progress: 75, date: '2024-01-14' },
                { type: 'quiz', title: 'Basic Algebra', score: 70, date: '2024-01-13' },
                { type: 'study-plan', title: 'Programming Fundamentals', progress: 100, date: '2024-01-12' },
                { type: 'quiz', title: 'Computer Networks', score: 85, date: '2024-01-11' }
              ]
            });
          } else {
            router.push('/signin');
          }
        } else {
          // Fetch real user profile and stats
          const [userResponse, statsResponse] = await Promise.all([
            api.getCurrentUser(),
            api.getUserStats()
          ]);

          setUserData(userResponse.user);
          setUserStats(statsResponse);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        
        // If it's a network/backend error, try demo mode
        if (error.message.includes('Failed to fetch') || error.message.includes('Network') || error.message.includes('Internal server error')) {
          setError('Backend is not available. Showing demo data.');
          
          // Create demo user data as fallback
          const demoUser = {
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@example.com',
            isDemo: true
          };
          
          setUserData(demoUser);
          setUserStats({
            stats: {
              totalQuizzes: 8,
              totalScore: 720,
              averageScore: 75,
              completedStudyPlans: 2,
              totalStudyPlans: 4,
              totalStudyTime: 360
            },
            subjectPerformance: {
              'Biology': { percentage: 80, quizzes: 3 },
              'Mathematics': { percentage: 70, quizzes: 2 },
              'Computer Science': { percentage: 85, quizzes: 3 }
            },
            recentActivity: [
              { type: 'quiz', title: 'Demo Biology Quiz', score: 80, date: '2024-01-15' },
              { type: 'study-plan', title: 'Demo Study Plan', progress: 60, date: '2024-01-14' }
            ]
          });
        } else {
          setError('Failed to load user data. Please try again.');
          
          // If authentication fails, redirect to login
          if (error.message.includes('401') || error.message.includes('Authentication')) {
            api.logout();
            router.push('/signin');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Chart data for performance based on real stats
  const chartData = {
    labels: userStats?.subjectPerformance ? Object.keys(userStats.subjectPerformance) : [],
    datasets: [
      {
        label: 'Quiz Scores (%)',
        data: userStats?.subjectPerformance ? Object.values(userStats.subjectPerformance).map(subject => subject.percentage) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  const handleDownloadRoadmap = () => {
    if (!userData || !userStats) return;

    // Generate roadmap based on real user data
    const strongAreas = userStats.subjectPerformance ? 
      Object.entries(userStats.subjectPerformance)
        .filter(([_, data]) => data.percentage >= 80)
        .map(([subject, _]) => subject) : [];

    const weakAreas = userStats.subjectPerformance ? 
      Object.entries(userStats.subjectPerformance)
        .filter(([_, data]) => data.percentage < 70)
        .map(([subject, _]) => subject) : [];

    const roadmap = `
EDUMENTOR AI - PERSONALIZED LEARNING ROADMAP

Student: ${userData.name}
Email: ${userData.email}
Generated: ${new Date().toLocaleDateString()}

CURRENT PERFORMANCE:
- Average Score: ${userStats.stats.averageScore}%
- Total Quizzes: ${userStats.stats.totalQuizzes}
- Study Plans Completed: ${userStats.stats.completedStudyPlans}
- Total Study Plans: ${userStats.stats.totalStudyPlans}

STRONG AREAS:
${strongAreas.length > 0 ? strongAreas.map(area => `- ${area}`).join('\n') : '- No strong areas identified yet'}

WEAK AREAS TO FOCUS ON:
${weakAreas.length > 0 ? weakAreas.map(area => `- ${area}`).join('\n') : '- No weak areas identified yet'}

RECENT ACTIVITY:
${userStats.recentActivity ? userStats.recentActivity.slice(0, 5).map(activity => 
  `- ${activity.type === 'quiz' ? 'Quiz' : 'Study Plan'}: ${activity.title} (${activity.type === 'quiz' ? activity.score + '%' : activity.progress + '%'})`
).join('\n') : '- No recent activity'}

RECOMMENDED LEARNING PATH:
1. Week 1-2: Focus on weak areas
2. Week 3-4: Practice and review
3. Week 5-6: Advanced topics
4. Week 7-8: Mastery and projects

DAILY STUDY SCHEDULE:
- 30 minutes: Review weak areas
- 45 minutes: Practice problems
- 30 minutes: Take quizzes
- 15 minutes: Review progress

GOALS:
- Achieve 85%+ average score
- Complete 20+ quizzes
- Finish 10 study plans
- Master 3 new topics

Good luck with your learning journey!
    `;

    const blob = new Blob([roadmap], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduMentorAI-Roadmap-${userData.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    api.logout();
    router.push('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !userData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} flex items-center justify-center`}>
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-md">
            <p className="text-red-200 mb-4">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors mr-2"
              >
                Back to Dashboard
              </button>
              <button 
                onClick={() => router.push('/signin')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Demo Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No user data
  if (!userData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-white text-lg mb-4">No user data found</p>
          <button 
            onClick={() => router.push('/signin')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} relative overflow-hidden transition-all duration-1000`}>
      <Head>
        <title>Profile - EduMentor AI</title>
        <meta name="description" content="Your learning profile and statistics" />
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
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-2xl font-bold text-white">EduMentor AI</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {api.isDemoMode() && (
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-200 text-sm font-medium">
                  Demo Mode
                </span>
              )}
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium">
                Home
              </Link>
              <button 
                onClick={handleLogout}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Welcome back!
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Hello, {userData.name}! 👋
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Here's your learning journey overview and personalized insights
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white shadow-lg">
                {userData.avatar || userData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                <p className="text-white/70">{userData.email}</p>
                <p className="text-white/50 text-sm">Member since {new Date(userData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors">
                Edit Profile
              </button>
              <button 
                onClick={handleDownloadRoadmap}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Download Roadmap
              </button>
              <PDFDownloadLink
                document={<StudyReportPDF userData={userData} userStats={userStats} />}
                fileName={`EduMentorAI-Report-${userData.name}.pdf`}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ml-4"
              >
                {({ loading }) =>
                  loading ? 'Generating PDF...' : 'Download PDF Report'
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Quizzes', value: userStats?.stats.totalQuizzes || 0, icon: '🧠', color: 'from-pink-500 to-purple-600' },
            { label: 'Average', value: `${userStats?.stats.averageScore || 0}%`, icon: '📊', color: 'from-blue-500 to-cyan-600' },
            { label: 'Plans', value: userStats?.stats.totalStudyPlans || 0, icon: '📘', color: 'from-green-500 to-emerald-600' },
            { label: 'Tasks', value: userStats?.stats.completedStudyPlans || 0, icon: '✅', color: 'from-orange-500 to-red-600' }
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/20">
            {[
              { id: 'overview', label: 'overview', icon: '📊' },
              { id: 'performance', label: 'performance', icon: '📈' },
              { id: 'activity', label: 'activity', icon: '📅' },
              { id: 'roadmap', label: 'roadmap', icon: '🗺️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Learning Overview</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Strong Areas</h4>
                  <div className="space-y-3">
                    {userStats?.subjectPerformance ? 
                      Object.entries(userStats.subjectPerformance)
                        .filter(([_, data]) => data.percentage >= 80)
                        .map(([subject, data]) => (
                          <div key={subject} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                            <span className="text-white">{subject}</span>
                            <span className="text-green-400 font-semibold">{data.percentage}%</span>
                          </div>
                        )) : 
                      <p className="text-white/70">No strong areas identified yet. Keep learning!</p>
                    }
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Areas to Improve</h4>
                  <div className="space-y-3">
                    {userStats?.subjectPerformance ? 
                      Object.entries(userStats.subjectPerformance)
                        .filter(([_, data]) => data.percentage < 70)
                        .map(([subject, data]) => (
                          <div key={subject} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                            <span className="text-white">{subject}</span>
                            <span className="text-orange-400 font-semibold">{data.percentage}%</span>
                          </div>
                        )) : 
                      <p className="text-white/70">No weak areas identified yet. Great job!</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Subject Performance</h3>
              <div className="h-80">
                {userStats?.subjectPerformance && Object.keys(userStats.subjectPerformance).length > 0 ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/70 text-lg">No performance data available yet. Take some quizzes to see your progress!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {userStats?.recentActivity && userStats.recentActivity.length > 0 ? (
                  userStats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-white/5 rounded-lg p-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'quiz' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {activity.type === 'quiz' ? '🧠' : '📘'}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{activity.title}</h4>
                        <p className="text-white/70 text-sm">
                          {activity.type === 'quiz' ? `Score: ${activity.score}%` : `Progress: ${activity.progress}%`}
                        </p>
                      </div>
                      <span className="text-white/50 text-sm">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/70 text-center py-8">No recent activity. Start learning to see your progress!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Learning Roadmap</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Current Goals</h4>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Achieve 85%+ Average Score</h5>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((userStats?.stats.averageScore || 0) / 85 * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-white/70 text-sm mt-2">Current: {userStats?.stats.averageScore || 0}%</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Complete 20+ Quizzes</h5>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((userStats?.stats.totalQuizzes || 0) / 20 * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-white/70 text-sm mt-2">Current: {userStats?.stats.totalQuizzes || 0}/20</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Recommended Actions</h4>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Focus on Weak Areas</h5>
                      <p className="text-white/70 text-sm">Practice subjects where you scored below 70%</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Complete Study Plans</h5>
                      <p className="text-white/70 text-sm">Follow structured learning paths for better results</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Regular Practice</h5>
                      <p className="text-white/70 text-sm">Take quizzes regularly to maintain progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 