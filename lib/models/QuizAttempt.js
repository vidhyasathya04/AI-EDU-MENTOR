import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true,
  },
  selectedAnswer: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  timeSpent: {
    type: Number,
    default: 0, // seconds
  },
});

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  timeSpent: {
    type: Number,
    default: 0, // total seconds
  },
  completed: {
    type: Boolean,
    default: false,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  feedback: {
    type: String,
    default: '',
  },
});

// Calculate percentage before saving
quizAttemptSchema.pre('save', function (next) {
  if (this.totalQuestions > 0) {
    this.percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }
  next();
});

// Method to get performance insights
quizAttemptSchema.methods.getPerformanceInsights = function () {
  const insights = {
    overall: this.percentage >= 80 ? 'Excellent' : this.percentage >= 60 ? 'Good' : this.percentage >= 40 ? 'Fair' : 'Needs Improvement',
    timePerQuestion: this.totalQuestions > 0 ? Math.round(this.timeSpent / this.totalQuestions) : 0,
    accuracy: this.percentage,
  };

  // Analyze question performance
  const questionAnalysis = this.answers.map((answer, index) => ({
    questionIndex: index,
    correct: answer.isCorrect,
    timeSpent: answer.timeSpent,
  }));

  insights.questionAnalysis = questionAnalysis;
  insights.slowQuestions = questionAnalysis.filter(q => q.timeSpent > 60);
  insights.incorrectQuestions = questionAnalysis.filter(q => !q.correct);

  return insights;
};

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema); 