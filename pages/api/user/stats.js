import { requireAuth } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import QuizAttempt from '../../../lib/models/QuizAttempt';
import StudyPlan from '../../../lib/models/StudyPlan';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get user's quiz attempts
    const quizAttempts = await QuizAttempt.find({ user: req.user._id })
      .populate('quiz', 'title topic subject level')
      .sort({ completedAt: -1 })
      .limit(10);

    // Get user's study plans
    const studyPlans = await StudyPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate additional stats
    const totalQuizTime = quizAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const averageQuizTime = quizAttempts.length > 0 ? Math.round(totalQuizTime / quizAttempts.length) : 0;

    // Get performance by subject
    const subjectPerformance = {};
    quizAttempts.forEach(attempt => {
      const subject = attempt.quiz.subject;
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = { total: 0, correct: 0, attempts: 0 };
      }
      subjectPerformance[subject].total += attempt.totalQuestions;
      subjectPerformance[subject].correct += attempt.correctAnswers;
      subjectPerformance[subject].attempts += 1;
    });

    // Calculate percentages
    Object.keys(subjectPerformance).forEach(subject => {
      const stats = subjectPerformance[subject];
      stats.percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    });

    // Get recent activity
    const recentActivity = [
      ...quizAttempts.map(attempt => ({
        type: 'quiz',
        date: attempt.completedAt,
        title: attempt.quiz.title,
        score: attempt.percentage,
      })),
      ...studyPlans.map(plan => ({
        type: 'study_plan',
        date: plan.createdAt,
        title: plan.title,
        progress: plan.progress,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    res.status(200).json({
      stats: {
        ...req.user.stats,
        totalQuizTime,
        averageQuizTime,
        totalStudyPlans: studyPlans.length,
        completedStudyPlans: studyPlans.filter(plan => plan.status === 'completed').length,
      },
      subjectPerformance,
      recentActivity,
      quizAttempts: quizAttempts.map(attempt => ({
        id: attempt._id,
        quizTitle: attempt.quiz.title,
        topic: attempt.quiz.topic,
        subject: attempt.quiz.subject,
        level: attempt.quiz.level,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        timeSpent: attempt.timeSpent,
        completedAt: attempt.completedAt,
      })),
      studyPlans: studyPlans.map(plan => ({
        id: plan._id,
        title: plan.title,
        topic: plan.topic,
        subject: plan.subject,
        level: plan.level,
        progress: plan.progress,
        status: plan.status,
        totalDays: plan.totalDays,
        createdAt: plan.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
}

export default requireAuth(handler); 