import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { generateQuizImage } from '../lib/huggingface';

export default function Quiz() {
  const router = useRouter();
  const [currentGradient, setCurrentGradient] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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

  // Question bank for different topics
  const questionBank = {
    'General Knowledge': [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        concept: "Geography - European Capitals",
        explanation: "Paris is the capital and largest city of France. It has been the capital since 987 CE and is known as the 'City of Light'.",
        difficulty: "Beginner",
        category: "Geography"
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        concept: "Astronomy - Solar System Planets",
        explanation: "Mars is called the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface.",
        difficulty: "Beginner",
        category: "Science"
      },
      {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        correct: 1,
        concept: "Chemistry - Chemical Symbols",
        explanation: "Au comes from the Latin word 'aurum' which means gold. Ag is the symbol for silver (argentum).",
        difficulty: "Intermediate",
        category: "Chemistry"
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1,
        concept: "Literature - Shakespearean Works",
        explanation: "William Shakespeare wrote 'Romeo and Juliet' between 1591-1595. It's one of his most famous tragedies.",
        difficulty: "Beginner",
        category: "Literature"
      },
      {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3,
        concept: "Geography - World Oceans",
        explanation: "The Pacific Ocean covers about 30% of Earth's surface and is the largest and deepest ocean on our planet.",
        difficulty: "Beginner",
        category: "Geography"
      },
      {
        question: "Which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2,
        concept: "History - World War II",
        explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in September.",
        difficulty: "Intermediate",
        category: "History"
      },
      {
        question: "What is the main component of the sun?",
        options: ["Liquid Lava", "Molten Iron", "Hot Gases", "Solid Rock"],
        correct: 2,
        concept: "Astronomy - Solar System",
        explanation: "The sun is primarily composed of hot gases, mainly hydrogen and helium, undergoing nuclear fusion.",
        difficulty: "Intermediate",
        category: "Science"
      },
      {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "Australia", "South Africa", "India"],
        correct: 1,
        concept: "Geography - World Countries",
        explanation: "Kangaroos are native to Australia and are one of the country's most iconic animals.",
        difficulty: "Beginner",
        category: "Geography"
      }
    ],
    'Mathematics': [
      {
        question: "What is 15 + 27?",
        options: ["40", "42", "43", "41"],
        correct: 1,
        concept: "Basic Arithmetic - Addition",
        explanation: "15 + 27 = 42. This is a basic addition problem.",
        difficulty: "Beginner",
        category: "Mathematics"
      },
      {
        question: "What is the square root of 64?",
        options: ["6", "7", "8", "9"],
        correct: 2,
        concept: "Algebra - Square Roots",
        explanation: "The square root of 64 is 8, because 8 × 8 = 64.",
        difficulty: "Beginner",
        category: "Mathematics"
      },
      {
        question: "What is 3/4 as a decimal?",
        options: ["0.25", "0.5", "0.75", "0.8"],
        correct: 2,
        concept: "Fractions - Converting to Decimals",
        explanation: "3/4 = 0.75. To convert a fraction to decimal, divide the numerator by the denominator.",
        difficulty: "Intermediate",
        category: "Mathematics"
      },
      {
        question: "What is the area of a circle with radius 5?",
        options: ["25π", "50π", "75π", "100π"],
        correct: 0,
        concept: "Geometry - Circle Area",
        explanation: "Area = πr² = π(5)² = 25π. The formula for circle area is π times radius squared.",
        difficulty: "Intermediate",
        category: "Mathematics"
      },
      {
        question: "What is 2³ × 2²?",
        options: ["2⁵", "2⁶", "4⁵", "4⁶"],
        correct: 0,
        concept: "Algebra - Exponents",
        explanation: "2³ × 2² = 2^(3+2) = 2⁵ = 32. When multiplying with same base, add the exponents.",
        difficulty: "Intermediate",
        category: "Mathematics"
      },
      {
        question: "What is the value of x if 2x + 5 = 13?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        concept: "Algebra - Linear Equations",
        explanation: "2x + 5 = 13 → 2x = 8 → x = 4. Subtract 5 from both sides, then divide by 2.",
        difficulty: "Intermediate",
        category: "Mathematics"
      }
    ],
    'Chemistry': [
      {
        question: "What is the chemical formula for water?",
        options: ["H2O", "CO2", "O2", "N2"],
        correct: 0,
        concept: "Chemistry - Chemical Formulas",
        explanation: "H2O is the chemical formula for water, consisting of two hydrogen atoms and one oxygen atom.",
        difficulty: "Beginner",
        category: "Chemistry"
      },
      {
        question: "What is the atomic number of carbon?",
        options: ["4", "5", "6", "7"],
        correct: 2,
        concept: "Chemistry - Periodic Table",
        explanation: "Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus.",
        difficulty: "Intermediate",
        category: "Chemistry"
      },
      {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        correct: 1,
        concept: "Chemistry - Chemical Symbols",
        explanation: "Au comes from the Latin word 'aurum' which means gold. Ag is the symbol for silver (argentum).",
        difficulty: "Beginner",
        category: "Chemistry"
      },
      {
        question: "What type of bond is formed between sodium and chlorine in NaCl?",
        options: ["Covalent", "Ionic", "Metallic", "Hydrogen"],
        correct: 1,
        concept: "Chemistry - Chemical Bonding",
        explanation: "NaCl forms an ionic bond where sodium donates an electron to chlorine, creating Na+ and Cl- ions.",
        difficulty: "Intermediate",
        category: "Chemistry"
      },
      {
        question: "What is the pH of a neutral solution?",
        options: ["0", "7", "14", "10"],
        correct: 1,
        concept: "Chemistry - pH Scale",
        explanation: "A neutral solution has a pH of 7. Values below 7 are acidic, above 7 are basic.",
        difficulty: "Beginner",
        category: "Chemistry"
      },
      {
        question: "Which gas is known as the 'silent killer'?",
        options: ["CO2", "CO", "NO2", "SO2"],
        correct: 1,
        concept: "Chemistry - Toxic Gases",
        explanation: "Carbon monoxide (CO) is called the 'silent killer' because it's colorless, odorless, and deadly.",
        difficulty: "Intermediate",
        category: "Chemistry"
      }
    ],
    'Physics': [
      {
        question: "What is the SI unit of force?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        correct: 2,
        concept: "Physics - Units and Measurements",
        explanation: "The Newton (N) is the SI unit of force, defined as the force needed to accelerate 1 kg at 1 m/s².",
        difficulty: "Beginner",
        category: "Physics"
      },
      {
        question: "What type of energy does a moving car have?",
        options: ["Potential", "Kinetic", "Thermal", "Chemical"],
        correct: 1,
        concept: "Physics - Energy Types",
        explanation: "A moving car has kinetic energy, which is the energy of motion.",
        difficulty: "Beginner",
        category: "Physics"
      },
      {
        question: "What is the speed of light in vacuum?",
        options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
        correct: 0,
        concept: "Physics - Light and Electromagnetism",
        explanation: "The speed of light in vacuum is approximately 299,792 kilometers per second.",
        difficulty: "Intermediate",
        category: "Physics"
      },
      {
        question: "What is the hardest natural substance on Earth?",
        options: ["Steel", "Diamond", "Granite", "Iron"],
        correct: 1,
        concept: "Physics - Material Properties",
        explanation: "Diamond is the hardest natural substance on Earth, scoring 10 on the Mohs scale.",
        difficulty: "Intermediate",
        category: "Physics"
      },
      {
        question: "What is Ohm's Law?",
        options: ["V = IR", "P = VI", "F = ma", "E = mc²"],
        correct: 0,
        concept: "Physics - Electricity",
        explanation: "Ohm's Law states that voltage (V) equals current (I) times resistance (R): V = IR.",
        difficulty: "Intermediate",
        category: "Physics"
      },
      {
        question: "What is the law of conservation of energy?",
        options: ["Energy can be created", "Energy can be destroyed", "Energy cannot be created or destroyed", "Energy always increases"],
        correct: 2,
        concept: "Physics - Energy Conservation",
        explanation: "The law of conservation of energy states that energy cannot be created or destroyed, only transformed.",
        difficulty: "Intermediate",
        category: "Physics"
      }
    ],
    'Biology': [
      {
        question: "Which organ pumps blood throughout the body?",
        options: ["Lungs", "Heart", "Liver", "Brain"],
        correct: 1,
        concept: "Biology - Human Anatomy",
        explanation: "The heart is responsible for pumping blood throughout the circulatory system.",
        difficulty: "Beginner",
        category: "Biology"
      },
      {
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Liver", "Skin"],
        correct: 3,
        concept: "Biology - Human Anatomy",
        explanation: "The skin is the largest organ in the human body, covering approximately 20 square feet.",
        difficulty: "Intermediate",
        category: "Biology"
      },
      {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        correct: 1,
        concept: "Biology - Cell Biology",
        explanation: "Mitochondria are called the powerhouse of the cell because they produce energy through cellular respiration.",
        difficulty: "Intermediate",
        category: "Biology"
      },
      {
        question: "What is the process by which plants make food?",
        options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
        correct: 1,
        concept: "Biology - Plant Biology",
        explanation: "Photosynthesis is the process by which plants convert sunlight, CO2, and water into glucose and oxygen.",
        difficulty: "Beginner",
        category: "Biology"
      },
      {
        question: "What are the building blocks of proteins?",
        options: ["Nucleotides", "Amino acids", "Fatty acids", "Monosaccharides"],
        correct: 1,
        concept: "Biology - Biochemistry",
        explanation: "Amino acids are the building blocks of proteins, linked together by peptide bonds.",
        difficulty: "Intermediate",
        category: "Biology"
      },
      {
        question: "What is the study of heredity called?",
        options: ["Ecology", "Genetics", "Taxonomy", "Physiology"],
        correct: 1,
        concept: "Biology - Genetics",
        explanation: "Genetics is the study of heredity and the variation of inherited characteristics.",
        difficulty: "Intermediate",
        category: "Biology"
      }
    ],
    'Computer Science': [
      {
        question: "What is the main component of a computer's CPU?",
        options: ["RAM", "ALU", "Hard Drive", "Power Supply"],
        correct: 1,
        concept: "Computer Science - Hardware",
        explanation: "The ALU (Arithmetic Logic Unit) is the main component of a CPU that performs mathematical and logical operations.",
        difficulty: "Beginner",
        category: "Computer Science"
      },
      {
        question: "What does RAM stand for?",
        options: ["Random Access Memory", "Read Access Memory", "Random Available Memory", "Read Available Memory"],
        correct: 0,
        concept: "Computer Science - Memory",
        explanation: "RAM stands for Random Access Memory, which is volatile memory that stores data temporarily while the computer is running.",
        difficulty: "Beginner",
        category: "Computer Science"
      },
      {
        question: "What is a programming language?",
        options: ["A computer game", "A set of instructions for computers", "A type of hardware", "An operating system"],
        correct: 1,
        concept: "Computer Science - Programming",
        explanation: "A programming language is a set of instructions and syntax used to create computer programs and applications.",
        difficulty: "Beginner",
        category: "Computer Science"
      },
      {
        question: "What is the binary representation of decimal 10?",
        options: ["1010", "1100", "1001", "1110"],
        correct: 0,
        concept: "Computer Science - Number Systems",
        explanation: "Decimal 10 in binary is 1010 (1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10).",
        difficulty: "Intermediate",
        category: "Computer Science"
      },
      {
        question: "What is an algorithm?",
        options: ["A computer program", "A step-by-step problem-solving procedure", "A type of hardware", "An operating system"],
        correct: 1,
        concept: "Computer Science - Algorithms",
        explanation: "An algorithm is a step-by-step procedure or set of rules used to solve a problem or perform a task.",
        difficulty: "Intermediate",
        category: "Computer Science"
      },
      {
        question: "What does HTML stand for?",
        options: ["HyperText Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
        correct: 0,
        concept: "Computer Science - Web Development",
        explanation: "HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.",
        difficulty: "Beginner",
        category: "Computer Science"
      }
    ],
    'DBMS': [
      {
        question: "What does DBMS stand for?",
        options: ["Database Management System", "Data Base Management Software", "Database Model System", "Data Business Management System"],
        correct: 0,
        concept: "DBMS - Fundamentals",
        explanation: "DBMS stands for Database Management System, which is software designed to store, retrieve, and manage data in a database.",
        difficulty: "Beginner",
        category: "DBMS"
      },
      {
        question: "What is a primary key in a database?",
        options: ["A foreign key", "A unique identifier for each record", "A backup key", "A temporary key"],
        correct: 1,
        concept: "DBMS - Keys",
        explanation: "A primary key is a unique identifier for each record in a database table, ensuring no duplicate values.",
        difficulty: "Beginner",
        category: "DBMS"
      },
      {
        question: "What is normalization in database design?",
        options: ["Making tables larger", "Organizing data to reduce redundancy", "Deleting data", "Adding more columns"],
        correct: 1,
        concept: "DBMS - Normalization",
        explanation: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.",
        difficulty: "Intermediate",
        category: "DBMS"
      },
      {
        question: "What is SQL?",
        options: ["A programming language", "Structured Query Language", "System Query Language", "Simple Query Language"],
        correct: 1,
        concept: "DBMS - SQL",
        explanation: "SQL stands for Structured Query Language, used to communicate with and manipulate databases.",
        difficulty: "Beginner",
        category: "DBMS"
      },
      {
        question: "What is a foreign key?",
        options: ["A primary key", "A key that references another table's primary key", "A backup key", "A temporary key"],
        correct: 1,
        concept: "DBMS - Relationships",
        explanation: "A foreign key is a field that references the primary key of another table, establishing relationships between tables.",
        difficulty: "Intermediate",
        category: "DBMS"
      },
      {
        question: "What is ACID in database transactions?",
        options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Integrity, Data", "Analysis, Consistency, Input, Data", "Atomic, Consistent, Isolated, Data"],
        correct: 0,
        concept: "DBMS - ACID Properties",
        explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability - properties that ensure reliable database transactions.",
        difficulty: "Advanced",
        category: "DBMS"
      }
    ],
    'OOPs': [
      {
        question: "What does OOP stand for?",
        options: ["Object-Oriented Programming", "Object-Oriented Process", "Object-Oriented Protocol", "Object-Oriented Platform"],
        correct: 0,
        concept: "OOPs - Fundamentals",
        explanation: "OOP stands for Object-Oriented Programming, a programming paradigm based on objects containing data and code.",
        difficulty: "Beginner",
        category: "OOPs"
      },
      {
        question: "What is encapsulation in OOP?",
        options: ["Bundling data and methods together", "Inheriting from another class", "Creating multiple forms", "Hiding implementation details"],
        correct: 0,
        concept: "OOPs - Encapsulation",
        explanation: "Encapsulation is the bundling of data and methods that operate on that data within a single unit (class).",
        difficulty: "Beginner",
        category: "OOPs"
      },
      {
        question: "What is inheritance in OOP?",
        options: ["Creating new objects", "Reusing code from existing classes", "Hiding data", "Polymorphism"],
        correct: 1,
        concept: "OOPs - Inheritance",
        explanation: "Inheritance allows a class to inherit properties and methods from another class, promoting code reuse.",
        difficulty: "Beginner",
        category: "OOPs"
      },
      {
        question: "What is polymorphism?",
        options: ["Multiple inheritance", "Same interface, different implementations", "Data hiding", "Code reusability"],
        correct: 1,
        concept: "OOPs - Polymorphism",
        explanation: "Polymorphism allows objects to be treated as instances of their parent class while maintaining their own unique behavior.",
        difficulty: "Intermediate",
        category: "OOPs"
      },
      {
        question: "What is abstraction in OOP?",
        options: ["Hiding complex implementation details", "Inheritance", "Encapsulation", "Polymorphism"],
        correct: 0,
        concept: "OOPs - Abstraction",
        explanation: "Abstraction is the concept of hiding complex implementation details and showing only necessary features.",
        difficulty: "Intermediate",
        category: "OOPs"
      },
      {
        question: "What is a constructor in OOP?",
        options: ["A method that destroys objects", "A special method that initializes objects", "A method that returns values", "A method that hides data"],
        correct: 1,
        concept: "OOPs - Constructors",
        explanation: "A constructor is a special method that is automatically called when an object is created to initialize it.",
        difficulty: "Beginner",
        category: "OOPs"
      }
    ],
    'Operating Systems': [
      {
        question: "What is an operating system?",
        options: ["A computer program", "System software that manages hardware and software", "A type of hardware", "A programming language"],
        correct: 1,
        concept: "OS - Fundamentals",
        explanation: "An operating system is system software that manages computer hardware, software resources, and provides common services.",
        difficulty: "Beginner",
        category: "Operating Systems"
      },
      {
        question: "What is process scheduling?",
        options: ["Creating new processes", "Managing which process runs when", "Deleting processes", "Stopping all processes"],
        correct: 1,
        concept: "OS - Process Management",
        explanation: "Process scheduling is the mechanism by which the OS decides which process should run at any given time.",
        difficulty: "Intermediate",
        category: "Operating Systems"
      },
      {
        question: "What is virtual memory?",
        options: ["Physical RAM", "Memory that appears larger than physical RAM", "Hard disk space", "Cache memory"],
        correct: 1,
        concept: "OS - Memory Management",
        explanation: "Virtual memory is a memory management technique that makes the computer appear to have more RAM than physically available.",
        difficulty: "Intermediate",
        category: "Operating Systems"
      },
      {
        question: "What is a deadlock?",
        options: ["A system crash", "A situation where processes are waiting for resources held by each other", "A virus", "A hardware failure"],
        correct: 1,
        concept: "OS - Deadlocks",
        explanation: "A deadlock occurs when two or more processes are waiting for resources that are held by each other, creating a circular wait.",
        difficulty: "Advanced",
        category: "Operating Systems"
      },
      {
        question: "What is a file system?",
        options: ["A type of hardware", "A method for storing and organizing files", "A programming language", "An application software"],
        correct: 1,
        concept: "OS - File Systems",
        explanation: "A file system is a method for storing and organizing computer files and the data they contain.",
        difficulty: "Beginner",
        category: "Operating Systems"
      },
      {
        question: "What is multitasking?",
        options: ["Running multiple programs simultaneously", "Using multiple computers", "Having multiple users", "Using multiple operating systems"],
        correct: 0,
        concept: "OS - Multitasking",
        explanation: "Multitasking is the ability of an OS to run multiple programs or tasks simultaneously.",
        difficulty: "Beginner",
        category: "Operating Systems"
      }
    ],
    'Networking': [
      {
        question: "What is a computer network?",
        options: ["A single computer", "Multiple computers connected together", "A type of software", "A programming language"],
        correct: 1,
        concept: "Networking - Fundamentals",
        explanation: "A computer network is a collection of computers and devices connected together to share resources and information.",
        difficulty: "Beginner",
        category: "Networking"
      },
      {
        question: "What does IP stand for?",
        options: ["Internet Protocol", "Internal Protocol", "Internet Program", "Internal Program"],
        correct: 0,
        concept: "Networking - IP Addresses",
        explanation: "IP stands for Internet Protocol, which is the method by which data is sent from one computer to another on the internet.",
        difficulty: "Beginner",
        category: "Networking"
      },
      {
        question: "What is a router?",
        options: ["A type of computer", "A device that forwards data packets between networks", "A programming language", "An operating system"],
        correct: 1,
        concept: "Networking - Network Devices",
        explanation: "A router is a networking device that forwards data packets between computer networks.",
        difficulty: "Beginner",
        category: "Networking"
      },
      {
        question: "What is DNS?",
        options: ["Domain Name System", "Data Network System", "Digital Network Service", "Domain Network Service"],
        correct: 0,
        concept: "Networking - DNS",
        explanation: "DNS stands for Domain Name System, which translates domain names into IP addresses.",
        difficulty: "Intermediate",
        category: "Networking"
      },
      {
        question: "What is a firewall?",
        options: ["A type of computer", "A security system that monitors network traffic", "A programming language", "An operating system"],
        correct: 1,
        concept: "Networking - Security",
        explanation: "A firewall is a security system that monitors and controls incoming and outgoing network traffic.",
        difficulty: "Intermediate",
        category: "Networking"
      },
      {
        question: "What is bandwidth?",
        options: ["The width of a network cable", "The maximum data transfer rate of a network", "The number of computers in a network", "The type of network protocol"],
        correct: 1,
        concept: "Networking - Bandwidth",
        explanation: "Bandwidth is the maximum data transfer rate of a network or internet connection.",
        difficulty: "Intermediate",
        category: "Networking"
      }
    ],
    'History': [
      {
        question: "In which year did Christopher Columbus discover America?",
        options: ["1490", "1492", "1495", "1500"],
        correct: 1,
        concept: "History - Age of Exploration",
        explanation: "Christopher Columbus discovered America in 1492, though he thought he had reached Asia.",
        difficulty: "Beginner",
        category: "History"
      },
      {
        question: "Who was the first President of the United States?",
        options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
        correct: 2,
        concept: "History - American Presidents",
        explanation: "George Washington was the first President of the United States, serving from 1789 to 1797.",
        difficulty: "Beginner",
        category: "History"
      },
      {
        question: "Which empire was ruled by Julius Caesar?",
        options: ["Greek", "Roman", "Egyptian", "Persian"],
        correct: 1,
        concept: "History - Ancient Rome",
        explanation: "Julius Caesar was a Roman general and statesman who played a critical role in the Roman Republic.",
        difficulty: "Intermediate",
        category: "History"
      },
      {
        question: "What year did World War I begin?",
        options: ["1912", "1914", "1916", "1918"],
        correct: 1,
        concept: "History - World War I",
        explanation: "World War I began in 1914 with the assassination of Archduke Franz Ferdinand.",
        difficulty: "Intermediate",
        category: "History"
      },
      {
        question: "Who was the first woman to win a Nobel Prize?",
        options: ["Marie Curie", "Mother Teresa", "Jane Addams", "Pearl Buck"],
        correct: 0,
        concept: "History - Nobel Prize Winners",
        explanation: "Marie Curie was the first woman to win a Nobel Prize, winning in Physics in 1903.",
        difficulty: "Intermediate",
        category: "History"
      }
    ],
    'Geography': [
      {
        question: "What is the capital of Japan?",
        options: ["Osaka", "Kyoto", "Tokyo", "Yokohama"],
        correct: 2,
        concept: "Geography - World Capitals",
        explanation: "Tokyo is the capital and largest city of Japan.",
        difficulty: "Beginner",
        category: "Geography"
      },
      {
        question: "Which is the largest continent?",
        options: ["Africa", "Asia", "North America", "Europe"],
        correct: 1,
        concept: "Geography - Continents",
        explanation: "Asia is the largest continent, covering about 30% of Earth's land area.",
        difficulty: "Beginner",
        category: "Geography"
      },
      {
        question: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correct: 1,
        concept: "Geography - Rivers",
        explanation: "The Nile River is the longest river in the world, flowing through 11 countries.",
        difficulty: "Intermediate",
        category: "Geography"
      },
      {
        question: "Which country has the largest population?",
        options: ["India", "China", "United States", "Indonesia"],
        correct: 1,
        concept: "Geography - Demographics",
        explanation: "China has the largest population in the world, though India is rapidly catching up.",
        difficulty: "Beginner",
        category: "Geography"
      },
      {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        correct: 2,
        concept: "Geography - World Capitals",
        explanation: "Canberra is the capital of Australia, while Sydney and Melbourne are larger cities.",
        difficulty: "Intermediate",
        category: "Geography"
      }
    ],
    'Literature': [
      {
        question: "Who wrote 'Pride and Prejudice'?",
        options: ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Mary Shelley"],
        correct: 0,
        concept: "Literature - Classic Novels",
        explanation: "Jane Austen wrote 'Pride and Prejudice', published in 1813.",
        difficulty: "Beginner",
        category: "Literature"
      },
      {
        question: "What is the main theme of '1984' by George Orwell?",
        options: ["Love", "Totalitarianism", "Nature", "Adventure"],
        correct: 1,
        concept: "Literature - Dystopian Fiction",
        explanation: "1984 is a dystopian novel that explores themes of totalitarianism and surveillance.",
        difficulty: "Intermediate",
        category: "Literature"
      },
      {
        question: "Who wrote 'The Great Gatsby'?",
        options: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"],
        correct: 1,
        concept: "Literature - American Classics",
        explanation: "F. Scott Fitzgerald wrote 'The Great Gatsby', published in 1925.",
        difficulty: "Intermediate",
        category: "Literature"
      },
      {
        question: "What type of poem is a sonnet?",
        options: ["14 lines", "16 lines", "18 lines", "20 lines"],
        correct: 0,
        concept: "Literature - Poetry Forms",
        explanation: "A sonnet is a 14-line poem, typically written in iambic pentameter.",
        difficulty: "Intermediate",
        category: "Literature"
      },
      {
        question: "Who is the author of 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Mark Twain", "John Steinbeck", "William Golding"],
        correct: 0,
        concept: "Literature - American Literature",
        explanation: "Harper Lee wrote 'To Kill a Mockingbird', published in 1960.",
        difficulty: "Intermediate",
        category: "Literature"
      }
    ]
  };

  // Generate quiz based on topic and subject
  const generateQuiz = (topic, subject) => {
    // Priority: Use subject if available, then topic mapping
    let availableQuestions = [];
    
    // First, try to use the exact subject from question bank
    if (questionBank[subject]) {
      availableQuestions = questionBank[subject];
    } else if (questionBank[topic]) {
      // If subject not found, try topic
      availableQuestions = questionBank[topic];
    } else {
      // Map custom topics to relevant predefined categories
      const topicLower = topic.toLowerCase();
      const subjectLower = subject.toLowerCase();
      
      if (subjectLower.includes('chemistry') || topicLower.includes('chemistry')) {
        availableQuestions = questionBank['Chemistry'];
      } else if (subjectLower.includes('physics') || topicLower.includes('physics')) {
        availableQuestions = questionBank['Physics'];
      } else if (subjectLower.includes('biology') || topicLower.includes('biology')) {
        availableQuestions = questionBank['Biology'];
      } else if (subjectLower.includes('math') || subjectLower.includes('mathematics') || topicLower.includes('math') || topicLower.includes('calculus') || topicLower.includes('algebra') || topicLower.includes('geometry')) {
        availableQuestions = questionBank['Mathematics'];
      } else if (subjectLower.includes('computer') || subjectLower.includes('programming') || topicLower.includes('programming') || topicLower.includes('coding')) {
        availableQuestions = questionBank['Computer Science'];
      } else if (subjectLower.includes('dbms') || subjectLower.includes('database') || topicLower.includes('database') || topicLower.includes('sql')) {
        availableQuestions = questionBank['DBMS'];
      } else if (subjectLower.includes('oop') || subjectLower.includes('object') || topicLower.includes('object') || topicLower.includes('class')) {
        availableQuestions = questionBank['OOPs'];
      } else if (subjectLower.includes('os') || subjectLower.includes('operating') || topicLower.includes('operating') || topicLower.includes('system')) {
        availableQuestions = questionBank['Operating Systems'];
      } else if (subjectLower.includes('network') || subjectLower.includes('internet') || topicLower.includes('network') || topicLower.includes('protocol')) {
        availableQuestions = questionBank['Networking'];
      } else if (subjectLower.includes('history') || topicLower.includes('history') || topicLower.includes('war') || topicLower.includes('ancient') || topicLower.includes('civilization')) {
        availableQuestions = questionBank['History'];
      } else if (subjectLower.includes('geography') || topicLower.includes('geography') || topicLower.includes('country') || topicLower.includes('capital')) {
        availableQuestions = questionBank['Geography'];
      } else if (subjectLower.includes('literature') || topicLower.includes('literature') || topicLower.includes('book') || topicLower.includes('poem') || topicLower.includes('novel')) {
        availableQuestions = questionBank['Literature'];
      } else {
        // Default to General Knowledge for unknown topics/subjects
        availableQuestions = questionBank['General Knowledge'];
      }
    }
    
    // Shuffle questions to get random selection and prevent repetition
    const shuffledQuestions = [...availableQuestions].sort(() => Math.random() - 0.5);
    
    // Take first 5 questions (or all if less than 5)
    const selectedQuestions = shuffledQuestions.slice(0, 5);
    
    return {
      topic: topic,
      subject: subject,
      level: router.query.level || 'beginner',
      questions: selectedQuestions
    };
  };

  // Initialize quiz when component mounts
  useEffect(() => {
    const topic = router.query.topic || 'General Knowledge';
    const subject = router.query.subject || 'General Knowledge';
    const generatedQuiz = generateQuiz(topic, subject);
    setQuizData(generatedQuiz);
    
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [router.query.topic, router.query.level, router.query.subject]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && quizData) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted && quizData) {
      handleNextQuestion();
    }
  }, [timeLeft, quizCompleted, quizData]);

  useEffect(() => {
    async function fetchImage() {
      if (quizData && quizData.questions && quizData.questions[currentQuestion]) {
        const url = await generateQuizImage(quizData.questions[currentQuestion].question);
        setImageUrl(url);
      }
    }
    fetchImage();
  }, [currentQuestion, quizData]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (!quizData) return;
    
    // Store user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newUserAnswers);

    if (selectedAnswer === quizData.questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFinishQuiz = () => {
    if (!quizData) return;
    
    // Store final answer
    const finalUserAnswers = [...userAnswers];
    finalUserAnswers[currentQuestion] = selectedAnswer;
    
    const finalScore = selectedAnswer === quizData.questions[currentQuestion].correct ? score + 1 : score;
    const percentage = Math.round((finalScore / quizData.questions.length) * 100);
    
    // Create review data for wrong answers
    const reviewData = [];
    finalUserAnswers.forEach((userAnswer, index) => {
      if (userAnswer !== quizData.questions[index].correct) {
        reviewData.push({
          question: quizData.questions[index].question,
          userAnswer: quizData.questions[index].options[userAnswer] || "No answer",
          correctAnswer: quizData.questions[index].options[quizData.questions[index].correct],
          concept: quizData.questions[index].concept,
          explanation: quizData.questions[index].explanation,
          difficulty: quizData.questions[index].difficulty,
          category: quizData.questions[index].category
        });
      }
    });
    
    // Redirect to results page with score data and review data
    router.push({
      pathname: '/results',
      query: {
        score: finalScore,
        total: quizData.questions.length,
        percentage: percentage,
        topic: quizData.topic,
        subject: quizData.subject,
        reviewData: JSON.stringify(reviewData)
      }
    });
  };

  if (isLoading || !quizData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} flex items-center justify-center transition-all duration-1000`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Generating Your Quiz...</h2>
          <p className="text-white/70">AI is creating personalized questions for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[currentGradient]} relative overflow-hidden transition-all duration-1000`}>
      <Head>
        <title>Quiz - EduMentor AI</title>
        <meta name="description" content="Take your personalized AI-generated quiz" />
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
              <Link href="/results" className="text-white/80 hover:text-white transition-colors font-medium">
                Results
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            AI-Generated Quiz
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Quiz on
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {quizData.topic}
            </span>
          </h1>
          <p className="text-white/70">
            {quizData.subject} • {quizData.level} level
          </p>
        </div>

        {/* Progress and Timer */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">
              <span className="font-semibold">Question {currentQuestion + 1}</span>
              <span className="text-white/70"> of {quizData.questions.length}</span>
            </div>
            <div className="text-white">
              <span className="font-semibold">Time: {timeLeft}s</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {imageUrl && (
            <img src={imageUrl} alt="AI generated" className="w-full max-w-md rounded-lg my-4" />
          )}
          <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
            {quizData.questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {quizData.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 ${
                  selectedAnswer === index
                    ? 'border-pink-500 bg-pink-500/20 text-white'
                    : 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                    selectedAnswer === index
                      ? 'border-pink-500 bg-pink-500 text-white'
                      : 'border-white/30 text-white/70'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:border-white/50 hover:bg-white/10 transition-all duration-300"
          >
            ← Back to Dashboard
          </button>

          {currentQuestion < quizData.questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={handleFinishQuiz}
              disabled={selectedAnswer === null}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finish Quiz 🎯
            </button>
          )}
        </div>
      </main>
    </div>
  );
} 