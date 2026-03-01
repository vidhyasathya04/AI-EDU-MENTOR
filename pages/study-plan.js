import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function StudyPlan() {
  const router = useRouter();
  const [currentGradient, setCurrentGradient] = useState(0);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('beginner');
  const [studyPlan, setStudyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Different gradient combinations
  const gradients = [
    'from-emerald-400 via-teal-500 to-cyan-500',
    'from-blue-400 via-indigo-500 to-purple-500',
    'from-violet-400 via-purple-500 to-pink-500',
    'from-rose-400 via-pink-500 to-red-500',
    'from-orange-400 via-red-500 to-pink-500',
    'from-yellow-400 via-orange-500 to-red-500',
    'from-lime-400 via-green-500 to-emerald-500',
    'from-cyan-400 via-blue-500 to-indigo-500'
  ];

  // Change gradient every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [gradients.length]);

  // Get parameters from URL
  useEffect(() => {
    if (router.isReady) {
      setTopic(router.query.topic || 'General Knowledge');
      setSubject(router.query.subject || 'Mixed');
      setLevel(router.query.level || 'beginner');
      
      // Generate study plan if parameters are provided
      if (router.query.topic && router.query.subject) {
        generateStudyPlan(router.query.topic, router.query.subject, router.query.level || 'beginner');
      }
    }
  }, [router.isReady, router.query]);

  const generateStudyPlan = async (topicName, subjectName, levelName) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const plan = createStudyPlan(topicName, subjectName, levelName);
      setStudyPlan(plan);
      setIsLoading(false);
    }, 2000);
  };

  const createStudyPlan = (topicName, subjectName, levelName) => {
    const difficulty = levelName === 'beginner' ? 'Basic' : levelName === 'intermediate' ? 'Intermediate' : 'Advanced';
    
    // Smart subject mapping
    const subjectMap = {
      'Science': 'General Science',
      'General Science': 'General Science',
      'Chemistry': 'Chemistry',
      'Physics': 'Physics',
      'Biology': 'Biology',
      'Mathematics': 'Mathematics',
      'Math': 'Mathematics',
      'Computer Science': 'Computer Science',
      'CS': 'Computer Science'
    };
    
    const mappedSubject = subjectMap[subjectName] || 'General Science';
    
    const plans = {
      'General Science': {
        title: `${topicName} - 5-Day Science Study Plan`,
        description: `Master ${topicName} through scientific inquiry and hands-on learning`,
        difficulty: difficulty,
        days: [
          {
            day: 1,
            title: "Scientific Foundation",
            duration: "2-3 hours",
            tasks: [
              { id: 1, title: "Understand scientific method", completed: false, type: "concept" },
              { id: 2, title: "Watch science fundamentals", completed: false, type: "video" },
              { id: 3, title: "Basic scientific concepts", completed: false, type: "reading" },
              { id: 4, title: "Create science journal", completed: false, type: "activity" }
            ],
            resources: [
              { title: "Scientific Method Tutorial", url: "https://www.youtube.com/results?search_query=scientific+method+tutorial", type: "video" },
              { title: "Science Fundamentals", url: "#", type: "document" },
              { title: "Interactive Science Tools", url: "#", type: "interactive" }
            ]
          },
          {
            day: 2,
            title: "Experimental Learning",
            duration: "2-3 hours",
            tasks: [
              { id: 5, title: "Design simple experiments", completed: false, type: "experiment" },
              { id: 6, title: "Data collection practice", completed: false, type: "practice" },
              { id: 7, title: "Observation skills", completed: false, type: "skill" },
              { id: 8, title: "Hypothesis formation", completed: false, type: "thinking" }
            ],
            resources: [
              { title: "Science Experiments for Beginners", url: "https://www.youtube.com/results?search_query=science+experiments+for+beginners", type: "video" },
              { title: "Data Collection Guide", url: "#", type: "guide" },
              { title: "Virtual Lab Simulations", url: "#", type: "simulation" }
            ]
          },
          {
            day: 3,
            title: "Analysis & Interpretation",
            duration: "2-3 hours",
            tasks: [
              { id: 9, title: "Data analysis techniques", completed: false, type: "analysis" },
              { id: 10, title: "Graph interpretation", completed: false, type: "interpretation" },
              { id: 11, title: "Drawing conclusions", completed: false, type: "thinking" },
              { id: 12, title: "Peer review practice", completed: false, type: "collaboration" }
            ],
            resources: [
              { title: "Data Analysis in Science", url: "https://www.youtube.com/results?search_query=data+analysis+in+science", type: "video" },
              { title: "Graph Reading Skills", url: "#", type: "guide" },
              { title: "Analysis Tools", url: "#", type: "tool" }
            ]
          },
          {
            day: 4,
            title: "Real-World Applications",
            duration: "2-3 hours",
            tasks: [
              { id: 13, title: "Research current discoveries", completed: false, type: "research" },
              { id: 14, title: "Science in daily life", completed: false, type: "application" },
              { id: 15, title: "Environmental science", completed: false, type: "concept" },
              { id: 16, title: "Technology connections", completed: false, type: "connection" }
            ],
            resources: [
              { title: "Science in Daily Life", url: "https://www.youtube.com/results?search_query=science+in+daily+life", type: "video" },
              { title: "Current Science News", url: "#", type: "news" },
              { title: "Environmental Science", url: "#", type: "document" }
            ]
          },
          {
            day: 5,
            title: "Scientific Communication",
            duration: "2-3 hours",
            tasks: [
              { id: 17, title: "Write science report", completed: false, type: "writing" },
              { id: 18, title: "Present findings", completed: false, type: "presentation" },
              { id: 19, title: "Science communication", completed: false, type: "communication" },
              { id: 20, title: "Future research planning", completed: false, type: "planning" }
            ],
            resources: [
              { title: "Science Communication Skills", url: "https://www.youtube.com/results?search_query=science+communication+skills", type: "video" },
              { title: "Report Writing Guide", url: "#", type: "guide" },
              { title: "Presentation Tips", url: "#", type: "tips" }
            ]
          }
        ]
      },
      'Chemistry': {
        title: `${topicName} - 5-Day Study Plan`,
        description: `Master ${topicName} fundamentals with this structured learning path`,
        difficulty: difficulty,
        days: [
          {
            day: 1,
            title: "Foundation Day",
            duration: "2-3 hours",
            tasks: [
              { id: 1, title: "Read basic concepts", completed: false, type: "reading" },
              { id: 2, title: "Watch introductory videos", completed: false, type: "video" },
              { id: 3, title: "Take diagnostic quiz", completed: false, type: "quiz" },
              { id: 4, title: "Create concept map", completed: false, type: "activity" }
            ],
            resources: [
              { title: "Introduction to Chemistry", url: "https://www.youtube.com/results?search_query=introduction+to+chemistry", type: "video" },
              { title: "Chemistry Basics PDF", url: "#", type: "document" },
              { title: "Interactive Periodic Table", url: "#", type: "interactive" }
            ]
          },
          {
            day: 2,
            title: "Core Concepts",
            duration: "2-3 hours",
            tasks: [
              { id: 5, title: "Study atomic structure", completed: false, type: "reading" },
              { id: 6, title: "Practice chemical symbols", completed: false, type: "practice" },
              { id: 7, title: "Complete exercises", completed: false, type: "exercise" },
              { id: 8, title: "Review key formulas", completed: false, type: "review" }
            ],
            resources: [
              { title: "Atomic Structure Tutorial", url: "https://www.youtube.com/results?search_query=atomic+structure+chemistry", type: "video" },
              { title: "Chemical Symbols Quiz", url: "#", type: "quiz" },
              { title: "Chemistry Formulas Sheet", url: "#", type: "document" }
            ]
          },
          {
            day: 3,
            title: "Application Day",
            duration: "2-3 hours",
            tasks: [
              { id: 9, title: "Solve practice problems", completed: false, type: "practice" },
              { id: 10, title: "Work on lab simulations", completed: false, type: "simulation" },
              { id: 11, title: "Group study session", completed: false, type: "collaboration" },
              { id: 12, title: "Create flashcards", completed: false, type: "activity" }
            ],
            resources: [
              { title: "Chemistry Problem Solving", url: "https://www.youtube.com/results?search_query=chemistry+problem+solving", type: "video" },
              { title: "Virtual Lab Simulations", url: "#", type: "simulation" },
              { title: "Practice Problems Set", url: "#", type: "exercise" }
            ]
          },
          {
            day: 4,
            title: "Advanced Topics",
            duration: "2-3 hours",
            tasks: [
              { id: 13, title: "Study advanced concepts", completed: false, type: "reading" },
              { id: 14, title: "Complex problem solving", completed: false, type: "practice" },
              { id: 15, title: "Research applications", completed: false, type: "research" },
              { id: 16, title: "Prepare for assessment", completed: false, type: "preparation" }
            ],
            resources: [
              { title: "Advanced Chemistry Concepts", url: "https://www.youtube.com/results?search_query=advanced+chemistry+concepts", type: "video" },
              { title: "Real-world Applications", url: "#", type: "document" },
              { title: "Assessment Preparation Guide", url: "#", type: "guide" }
            ]
          },
          {
            day: 5,
            title: "Review & Assessment",
            duration: "2-3 hours",
            tasks: [
              { id: 17, title: "Comprehensive review", completed: false, type: "review" },
              { id: 18, title: "Final practice test", completed: false, type: "quiz" },
              { id: 19, title: "Identify weak areas", completed: false, type: "analysis" },
              { id: 20, title: "Plan next steps", completed: false, type: "planning" }
            ],
            resources: [
              { title: "Comprehensive Review Session", url: "https://www.youtube.com/results?search_query=chemistry+review+session", type: "video" },
              { title: "Final Assessment Test", url: "#", type: "quiz" },
              { title: "Progress Analysis Report", url: "#", type: "report" }
            ]
          }
        ]
      },
      'Physics': {
        title: `${topicName} - 5-Day Study Plan`,
        description: `Master ${topicName} principles with hands-on learning approach`,
        difficulty: difficulty,
        days: [
          {
            day: 1,
            title: "Fundamentals Day",
            duration: "2-3 hours",
            tasks: [
              { id: 1, title: "Understand basic principles", completed: false, type: "reading" },
              { id: 2, title: "Watch concept videos", completed: false, type: "video" },
              { id: 3, title: "Basic calculations", completed: false, type: "practice" },
              { id: 4, title: "Create physics journal", completed: false, type: "activity" }
            ],
            resources: [
              { title: "Physics Fundamentals", url: "https://www.youtube.com/results?search_query=physics+fundamentals", type: "video" },
              { title: "Physics Formulas", url: "#", type: "document" },
              { title: "Interactive Simulations", url: "#", type: "interactive" }
            ]
          },
          {
            day: 2,
            title: "Problem Solving",
            duration: "2-3 hours",
            tasks: [
              { id: 5, title: "Practice kinematics", completed: false, type: "practice" },
              { id: 6, title: "Work on dynamics", completed: false, type: "practice" },
              { id: 7, title: "Energy conservation", completed: false, type: "concept" },
              { id: 8, title: "Problem-solving strategies", completed: false, type: "strategy" }
            ],
            resources: [
              { title: "Physics Problem Solving", url: "https://www.youtube.com/results?search_query=physics+problem+solving", type: "video" },
              { title: "Practice Problems", url: "#", type: "exercise" },
              { title: "Problem Solving Guide", url: "#", type: "guide" }
            ]
          },
          {
            day: 3,
            title: "Experiments & Labs",
            duration: "2-3 hours",
            tasks: [
              { id: 9, title: "Virtual lab experiments", completed: false, type: "experiment" },
              { id: 10, title: "Data analysis", completed: false, type: "analysis" },
              { id: 11, title: "Graph interpretation", completed: false, type: "interpretation" },
              { id: 12, title: "Lab report writing", completed: false, type: "writing" }
            ],
            resources: [
              { title: "Virtual Physics Labs", url: "https://www.youtube.com/results?search_query=virtual+physics+labs", type: "video" },
              { title: "Lab Simulations", url: "#", type: "simulation" },
              { title: "Data Analysis Tools", url: "#", type: "tool" }
            ]
          },
          {
            day: 4,
            title: "Advanced Applications",
            duration: "2-3 hours",
            tasks: [
              { id: 13, title: "Complex problem solving", completed: false, type: "practice" },
              { id: 14, title: "Real-world applications", completed: false, type: "application" },
              { id: 15, title: "Research current topics", completed: false, type: "research" },
              { id: 16, title: "Peer discussions", completed: false, type: "discussion" }
            ],
            resources: [
              { title: "Advanced Physics Applications", url: "https://www.youtube.com/results?search_query=advanced+physics+applications", type: "video" },
              { title: "Real-world Examples", url: "#", type: "document" },
              { title: "Research Papers", url: "#", type: "research" }
            ]
          },
          {
            day: 5,
            title: "Assessment & Review",
            duration: "2-3 hours",
            tasks: [
              { id: 17, title: "Comprehensive review", completed: false, type: "review" },
              { id: 18, title: "Mock test", completed: false, type: "quiz" },
              { id: 19, title: "Performance analysis", completed: false, type: "analysis" },
              { id: 20, title: "Future learning plan", completed: false, type: "planning" }
            ],
            resources: [
              { title: "Physics Review Session", url: "https://www.youtube.com/results?search_query=physics+review+session", type: "video" },
              { title: "Mock Test", url: "#", type: "quiz" },
              { title: "Performance Report", url: "#", type: "report" }
            ]
          }
        ]
      },
      'Mathematics': {
        title: `${topicName} - 5-Day Study Plan`,
        description: `Build strong mathematical foundation with systematic approach`,
        difficulty: difficulty,
        days: [
          {
            day: 1,
            title: "Foundation Building",
            duration: "2-3 hours",
            tasks: [
              { id: 1, title: "Review prerequisites", completed: false, type: "review" },
              { id: 2, title: "Basic concepts", completed: false, type: "concept" },
              { id: 3, title: "Simple exercises", completed: false, type: "exercise" },
              { id: 4, title: "Create formula sheet", completed: false, type: "activity" }
            ],
            resources: [
              { title: "Math Fundamentals", url: "https://www.youtube.com/results?search_query=math+fundamentals", type: "video" },
              { title: "Formula Reference", url: "#", type: "document" },
              { title: "Interactive Math Tools", url: "#", type: "interactive" }
            ]
          },
          {
            day: 2,
            title: "Core Techniques",
            duration: "2-3 hours",
            tasks: [
              { id: 5, title: "Learn key methods", completed: false, type: "learning" },
              { id: 6, title: "Practice techniques", completed: false, type: "practice" },
              { id: 7, title: "Problem patterns", completed: false, type: "pattern" },
              { id: 8, title: "Speed calculations", completed: false, type: "speed" }
            ],
            resources: [
              { title: "Math Problem Solving", url: "https://www.youtube.com/results?search_query=math+problem+solving", type: "video" },
              { title: "Practice Problems", url: "#", type: "exercise" },
              { title: "Technique Guide", url: "#", type: "guide" }
            ]
          },
          {
            day: 3,
            title: "Application Practice",
            duration: "2-3 hours",
            tasks: [
              { id: 9, title: "Complex problems", completed: false, type: "practice" },
              { id: 10, title: "Real-world applications", completed: false, type: "application" },
              { id: 11, title: "Group problem solving", completed: false, type: "collaboration" },
              { id: 12, title: "Create study notes", completed: false, type: "notes" }
            ],
            resources: [
              { title: "Advanced Math Problems", url: "https://www.youtube.com/results?search_query=advanced+math+problems", type: "video" },
              { title: "Application Examples", url: "#", type: "document" },
              { title: "Problem Sets", url: "#", type: "exercise" }
            ]
          },
          {
            day: 4,
            title: "Advanced Topics",
            duration: "2-3 hours",
            tasks: [
              { id: 13, title: "Advanced concepts", completed: false, type: "concept" },
              { id: 14, title: "Proof techniques", completed: false, type: "proof" },
              { id: 15, title: "Theoretical understanding", completed: false, type: "theory" },
              { id: 16, title: "Research connections", completed: false, type: "research" }
            ],
            resources: [
              { title: "Advanced Math Concepts", url: "https://www.youtube.com/results?search_query=advanced+math+concepts", type: "video" },
              { title: "Proof Techniques", url: "#", type: "document" },
              { title: "Theoretical Papers", url: "#", type: "research" }
            ]
          },
          {
            day: 5,
            title: "Assessment & Mastery",
            duration: "2-3 hours",
            tasks: [
              { id: 17, title: "Comprehensive review", completed: false, type: "review" },
              { id: 18, title: "Final assessment", completed: false, type: "quiz" },
              { id: 19, title: "Weak area analysis", completed: false, type: "analysis" },
              { id: 20, title: "Next level planning", completed: false, type: "planning" }
            ],
            resources: [
              { title: "Math Review Session", url: "https://www.youtube.com/results?search_query=math+review+session", type: "video" },
              { title: "Final Assessment", url: "#", type: "quiz" },
              { title: "Progress Analysis", url: "#", type: "report" }
            ]
          }
        ]
      },
      'Biology': {
        title: `${topicName} - 5-Day Biology Study Plan`,
        description: `Explore life sciences through systematic learning approach`,
        difficulty: difficulty,
        days: [
          {
            day: 1,
            title: "Cell Biology Foundation",
            duration: "2-3 hours",
            tasks: [
              { id: 1, title: "Study cell structure", completed: false, type: "reading" },
              { id: 2, title: "Watch cell biology videos", completed: false, type: "video" },
              { id: 3, title: "Cell organelles review", completed: false, type: "concept" },
              { id: 4, title: "Create cell diagram", completed: false, type: "activity" }
            ],
            resources: [
              { title: "Cell Biology Basics", url: "https://www.youtube.com/results?search_query=cell+biology+basics", type: "video" },
              { title: "Cell Structure Guide", url: "#", type: "document" },
              { title: "Interactive Cell Model", url: "#", type: "interactive" }
            ]
          },
          {
            day: 2,
            title: "Genetics & DNA",
            duration: "2-3 hours",
            tasks: [
              { id: 5, title: "DNA structure study", completed: false, type: "reading" },
              { id: 6, title: "Genetic inheritance patterns", completed: false, type: "concept" },
              { id: 7, title: "Punnett square practice", completed: false, type: "practice" },
              { id: 8, title: "Genetic disorders research", completed: false, type: "research" }
            ],
            resources: [
              { title: "Genetics Tutorial", url: "https://www.youtube.com/results?search_query=genetics+tutorial", type: "video" },
              { title: "DNA Structure Guide", url: "#", type: "guide" },
              { title: "Punnett Square Practice", url: "#", type: "exercise" }
            ]
          },
          {
            day: 3,
            title: "Human Anatomy",
            duration: "2-3 hours",
            tasks: [
              { id: 9, title: "Body systems overview", completed: false, type: "reading" },
              { id: 10, title: "Organ functions study", completed: false, type: "concept" },
              { id: 11, title: "Virtual anatomy tour", completed: false, type: "virtual" },
              { id: 12, title: "Health and disease", completed: false, type: "application" }
            ],
            resources: [
              { title: "Human Anatomy Overview", url: "https://www.youtube.com/results?search_query=human+anatomy+overview", type: "video" },
              { title: "Virtual Anatomy Lab", url: "#", type: "simulation" },
              { title: "Body Systems Guide", url: "#", type: "document" }
            ]
          },
          {
            day: 4,
            title: "Ecology & Evolution",
            duration: "2-3 hours",
            tasks: [
              { id: 13, title: "Ecosystem dynamics", completed: false, type: "concept" },
              { id: 14, title: "Evolutionary processes", completed: false, type: "reading" },
              { id: 15, title: "Environmental interactions", completed: false, type: "application" },
              { id: 16, title: "Biodiversity study", completed: false, type: "research" }
            ],
            resources: [
              { title: "Ecology Fundamentals", url: "https://www.youtube.com/results?search_query=ecology+fundamentals", type: "video" },
              { title: "Evolution Explained", url: "#", type: "document" },
              { title: "Biodiversity Database", url: "#", type: "database" }
            ]
          },
          {
            day: 5,
            title: "Biology Applications",
            duration: "2-3 hours",
            tasks: [
              { id: 17, title: "Biotechnology overview", completed: false, type: "concept" },
              { id: 18, title: "Medical applications", completed: false, type: "application" },
              { id: 19, title: "Environmental biology", completed: false, type: "research" },
              { id: 20, title: "Future of biology", completed: false, type: "planning" }
            ],
            resources: [
              { title: "Biotechnology Applications", url: "https://www.youtube.com/results?search_query=biotechnology+applications", type: "video" },
              { title: "Medical Biology Guide", url: "#", type: "guide" },
              { title: "Environmental Biology", url: "#", type: "document" }
            ]
          }
        ]
      },
      'Computer Science': {
        title: `${topicName} - 5-Day Computer Science Study Plan`,
        description: `Master programming and computational thinking systematically`,
        difficulty: difficulty,
        days: [
          {
            day: 1,
            title: "Programming Fundamentals",
            duration: "2-3 hours",
            tasks: [
              { id: 1, title: "Learn basic syntax", completed: false, type: "learning" },
              { id: 2, title: "Watch programming tutorials", completed: false, type: "video" },
              { id: 3, title: "Write first program", completed: false, type: "practice" },
              { id: 4, title: "Set up development environment", completed: false, type: "setup" }
            ],
            resources: [
              { title: "Programming Basics", url: "https://www.youtube.com/results?search_query=programming+basics+tutorial", type: "video" },
              { title: "Code Editor Setup", url: "#", type: "guide" },
              { title: "Interactive Coding Platform", url: "#", type: "platform" }
            ]
          },
          {
            day: 2,
            title: "Data Structures",
            duration: "2-3 hours",
            tasks: [
              { id: 5, title: "Arrays and lists", completed: false, type: "concept" },
              { id: 6, title: "Practice data manipulation", completed: false, type: "practice" },
              { id: 7, title: "Algorithm basics", completed: false, type: "learning" },
              { id: 8, title: "Problem-solving exercises", completed: false, type: "exercise" }
            ],
            resources: [
              { title: "Data Structures Tutorial", url: "https://www.youtube.com/results?search_query=data+structures+tutorial", type: "video" },
              { title: "Algorithm Practice", url: "#", type: "exercise" },
              { title: "Coding Challenges", url: "#", type: "challenge" }
            ]
          },
          {
            day: 3,
            title: "Object-Oriented Programming",
            duration: "2-3 hours",
            tasks: [
              { id: 9, title: "Classes and objects", completed: false, type: "concept" },
              { id: 10, title: "Inheritance and polymorphism", completed: false, type: "learning" },
              { id: 11, title: "Design patterns", completed: false, type: "pattern" },
              { id: 12, title: "Project planning", completed: false, type: "planning" }
            ],
            resources: [
              { title: "OOP Concepts", url: "https://www.youtube.com/results?search_query=object+oriented+programming", type: "video" },
              { title: "Design Patterns Guide", url: "#", type: "guide" },
              { title: "Project Templates", url: "#", type: "template" }
            ]
          },
          {
            day: 4,
            title: "Advanced Concepts",
            duration: "2-3 hours",
            tasks: [
              { id: 13, title: "Database fundamentals", completed: false, type: "concept" },
              { id: 14, title: "Web development basics", completed: false, type: "learning" },
              { id: 15, title: "API integration", completed: false, type: "practice" },
              { id: 16, title: "Version control", completed: false, type: "tool" }
            ],
            resources: [
              { title: "Database Tutorial", url: "https://www.youtube.com/results?search_query=database+tutorial", type: "video" },
              { title: "Web Development Guide", url: "#", type: "guide" },
              { title: "Git Tutorial", url: "#", type: "tutorial" }
            ]
          },
          {
            day: 5,
            title: "Project Development",
            duration: "2-3 hours",
            tasks: [
              { id: 17, title: "Build complete project", completed: false, type: "project" },
              { id: 18, title: "Code review practice", completed: false, type: "review" },
              { id: 19, title: "Testing and debugging", completed: false, type: "testing" },
              { id: 20, title: "Deployment preparation", completed: false, type: "deployment" }
            ],
            resources: [
              { title: "Project Development Guide", url: "https://www.youtube.com/results?search_query=software+project+development", type: "video" },
              { title: "Testing Best Practices", url: "#", type: "guide" },
              { title: "Deployment Tutorial", url: "#", type: "tutorial" }
            ]
          }
        ]
      }
    };

    // Return default plan if subject not found
    return plans[mappedSubject] || plans['Mathematics'];
  };

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const getProgressPercentage = () => {
    if (!studyPlan) return 0;
    const totalTasks = studyPlan.days.reduce((sum, day) => sum + day.tasks.length, 0);
    return Math.round((completedTasks.length / totalTasks) * 100);
  };

  const getDayProgress = (day) => {
    const completedDayTasks = day.tasks.filter(task => completedTasks.includes(task.id)).length;
    return Math.round((completedDayTasks / day.tasks.length) * 100);
  };

  // Download handler for study plan
  const handleDownloadPlan = () => {
    if (!studyPlan) return;
    
    const planText = `
EDUMENTOR AI - STUDY PLAN

Subject: ${subject}
Topic: ${topic}
Generated: ${new Date().toLocaleDateString()}

${studyPlan.days.map((day, index) => `
DAY ${index + 1}: ${day.title}
Duration: ${day.duration}

Tasks:
${day.tasks.map(task => `- ${task.title}`).join('\n')}

Resources:
${day.resources.map(resource => `- ${resource.title}`).join('\n')}
`).join('\n')}

Study Tips:
- Take breaks every 45 minutes
- Review previous day's material before starting new topics
- Practice with quizzes after completing each day
- Stay hydrated and maintain good posture

Good luck with your studies!
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduMentorAI-StudyPlan-${subject}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} relative overflow-hidden transition-all duration-1000`}>
        <Head>
          <title>Generating Study Plan - EduMentor AI</title>
        </Head>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Creating Your Study Plan</h2>
            <p className="text-white/70">AI is analyzing your learning needs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} relative overflow-hidden transition-all duration-1000`}>
      <Head>
        <title>Study Plan - EduMentor AI</title>
        <meta name="description" content="Your personalized AI-generated study plan" />
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
        {!studyPlan ? (
          // Generate Study Plan Form
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Study Plan Generator
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Create Your
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Study Plan
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              Get a personalized 5-day study plan tailored to your learning goals and level
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    What topic would you like to study? *
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Calculus, Organic Chemistry, Quantum Physics..."
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Subject Area *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="" className="bg-gray-800">Select a subject</option>
                    <option value="Science" className="bg-gray-800">Science (General)</option>
                    <option value="Chemistry" className="bg-gray-800">Chemistry</option>
                    <option value="Physics" className="bg-gray-800">Physics</option>
                    <option value="Biology" className="bg-gray-800">Biology</option>
                    <option value="Mathematics" className="bg-gray-800">Mathematics</option>
                    <option value="Computer Science" className="bg-gray-800">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Learning Level *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="beginner" className="bg-gray-800">Beginner</option>
                    <option value="intermediate" className="bg-gray-800">Intermediate</option>
                    <option value="advanced" className="bg-gray-800">Advanced</option>
                  </select>
                </div>

                <button
                  onClick={() => generateStudyPlan(topic, subject, level)}
                  disabled={!topic || !subject}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                >
                  Generate Study Plan
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Study Plan Display
          <div>
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Your Study Plan
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{studyPlan.title}</h1>
              <p className="text-xl text-white/80 mb-6">{studyPlan.description}</p>
              
              {/* Progress Overview */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{getProgressPercentage()}%</div>
                  <div className="text-white/70 mb-4">Overall Progress</div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/20">
                {studyPlan.days.map((day, index) => (
                  <button
                    key={day.day}
                    onClick={() => setCurrentDay(index)}
                    className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 mx-1 ${
                      currentDay === index
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Day Content */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Day {studyPlan.days[currentDay].day}: {studyPlan.days[currentDay].title}
                  </h2>
                  <p className="text-white/70">Duration: {studyPlan.days[currentDay].duration}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{getDayProgress(studyPlan.days[currentDay])}%</div>
                  <div className="text-white/70 text-sm">Day Progress</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Tasks */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">📋 Today's Tasks</h3>
                  <div className="space-y-4">
                    {studyPlan.days[currentDay].tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`bg-white/5 rounded-xl p-4 border border-white/10 transition-all duration-300 ${
                          completedTasks.includes(task.id) ? 'bg-green-500/20 border-green-500/30' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                              completedTasks.includes(task.id)
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-white/30 text-transparent hover:border-white/50'
                            }`}
                          >
                            {completedTasks.includes(task.id) && '✓'}
                          </button>
                          <div className="flex-1">
                            <div className="text-white font-medium">{task.title}</div>
                            <div className="text-white/60 text-sm capitalize">{task.type}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">📚 Learning Resources</h3>
                  <div className="space-y-4">
                    {studyPlan.days[currentDay].resources.map((resource, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{resource.title}</div>
                            <div className="text-white/60 text-sm capitalize">{resource.type}</div>
                          </div>
                          <button
                            onClick={() => window.open(resource.url, '_blank')}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-700 transition-all duration-300"
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
                  disabled={currentDay === 0}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous Day
                </button>
                
                <div className="text-center">
                  <div className="text-white/70 text-sm">Day {currentDay + 1} of {studyPlan.days.length}</div>
                </div>
                
                <button
                  onClick={() => setCurrentDay(Math.min(studyPlan.days.length - 1, currentDay + 1))}
                  disabled={currentDay === studyPlan.days.length - 1}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Day →
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Link href={`/quiz?topic=${encodeURIComponent(topic)}&level=${level}&subject=${encodeURIComponent(subject)}&random=${Date.now()}`} className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Take Quiz on This Topic 🧠
              </Link>
              <Link href="/dashboard" className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-300">
                Back to Dashboard
              </Link>
            </div>

            {/* Download Button */}
            <div className="flex justify-center mt-12">
              <button
                onClick={handleDownloadPlan}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Download Study Plan
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 