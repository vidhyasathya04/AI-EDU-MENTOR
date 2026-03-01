const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/edu-mentor-ai';

async function createDemoUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create User model
    const userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      avatar: {
        type: String,
        default: '',
      },
      role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student',
      },
      preferences: {
        subjects: [String],
        difficulty: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'beginner',
        },
        notifications: {
          type: Boolean,
          default: true,
        },
      },
      stats: {
        totalQuizzes: {
          type: Number,
          default: 0,
        },
        totalScore: {
          type: Number,
          default: 0,
        },
        averageScore: {
          type: Number,
          default: 0,
        },
        studyPlansCompleted: {
          type: Number,
          default: 0,
        },
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      lastLogin: {
        type: Date,
        default: Date.now,
      },
    });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@edumentor.ai' });
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@edumentor.ai',
      password: hashedPassword,
      avatar: '👤',
      preferences: {
        subjects: ['Mathematics', 'Science', 'Computer Science'],
        difficulty: 'beginner',
        notifications: true,
      },
      stats: {
        totalQuizzes: 15,
        totalScore: 1170, // 15 quizzes * 78 average
        averageScore: 78,
        studyPlansCompleted: 8,
      },
    });

    await demoUser.save();
    console.log('Demo user created successfully!');
    console.log('Email: demo@edumentor.ai');
    console.log('Password: demo123');

  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createDemoUser(); 