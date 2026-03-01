import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['reading', 'video', 'quiz', 'practice', 'activity', 'experiment', 'writing', 'presentation'],
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  estimatedDuration: {
    type: Number, // minutes
    default: 30,
  },
});

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'document', 'interactive', 'guide', 'simulation', 'news', 'tips'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
});

const daySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: '2-3 hours',
  },
  tasks: [taskSchema],
  resources: [resourceSchema],
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced'],
    required: true,
  },
  days: [daySchema],
  totalDays: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    default: 0, // percentage
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'paused'],
    default: 'not_started',
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update progress and status before saving
studyPlanSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  
  // Calculate progress
  if (this.days && this.days.length > 0) {
    const completedDays = this.days.filter(day => day.completed).length;
    this.progress = Math.round((completedDays / this.days.length) * 100);
    
    // Update status based on progress
    if (this.progress === 0) {
      this.status = 'not_started';
    } else if (this.progress === 100) {
      this.status = 'completed';
      if (!this.completedAt) {
        this.completedAt = Date.now();
      }
    } else {
      this.status = 'in_progress';
    }
  }
  
  next();
});

// Method to mark a task as completed
studyPlanSchema.methods.completeTask = function (dayIndex, taskId) {
  if (this.days[dayIndex]) {
    const task = this.days[dayIndex].tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = true;
      task.completedAt = Date.now();
      
      // Check if all tasks in the day are completed
      const allTasksCompleted = this.days[dayIndex].tasks.every(t => t.completed);
      if (allTasksCompleted) {
        this.days[dayIndex].completed = true;
        this.days[dayIndex].completedAt = Date.now();
      }
    }
  }
};

// Method to get study plan insights
studyPlanSchema.methods.getInsights = function () {
  const insights = {
    totalTasks: this.days.reduce((sum, day) => sum + day.tasks.length, 0),
    completedTasks: this.days.reduce((sum, day) => 
      sum + day.tasks.filter(task => task.completed).length, 0),
    totalResources: this.days.reduce((sum, day) => sum + day.resources.length, 0),
    estimatedTotalTime: this.days.reduce((sum, day) => 
      sum + day.tasks.reduce((daySum, task) => daySum + task.estimatedDuration, 0), 0),
    daysRemaining: this.days.filter(day => !day.completed).length,
  };
  
  return insights;
};

export default mongoose.models.StudyPlan || mongoose.model('StudyPlan', studyPlanSchema); 