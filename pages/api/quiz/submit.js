import { requireAuth } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import Quiz from '../../../lib/models/Quiz';
import QuizAttempt from '../../../lib/models/QuizAttempt';
import User from '../../../lib/models/User';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { quizId, answers, timeSpent } = req.body;

    // Validation
    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Quiz ID and answers are required' });
    }

    // Get quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate results
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0,
      };
    });

    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / quiz.totalQuestions) * 100);

    // Create quiz attempt
    const quizAttempt = new QuizAttempt({
      user: req.user._id,
      quiz: quizId,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.totalQuestions,
      correctAnswers,
      percentage,
      timeSpent: timeSpent || 0,
      completed: true,
      completedAt: Date.now(),
    });

    await quizAttempt.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    user.stats.totalQuizzes += 1;
    user.stats.totalScore += score;
    user.stats.averageScore = Math.round(user.stats.totalScore / user.stats.totalQuizzes);
    await user.save();

    // Get performance insights
    const insights = quizAttempt.getPerformanceInsights();

    res.status(200).json({
      message: 'Quiz submitted successfully',
      result: {
        score,
        totalQuestions: quiz.totalQuestions,
        correctAnswers,
        percentage,
        timeSpent: quizAttempt.timeSpent,
        insights,
      },
      quizAttempt: {
        id: quizAttempt._id,
        completedAt: quizAttempt.completedAt,
      },
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
}

export default requireAuth(handler); 