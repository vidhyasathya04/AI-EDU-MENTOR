import { optionalAuth } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import Quiz from '../../../lib/models/Quiz';
import aiService from '../../../lib/ai-service';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { topic, subject, level, numQuestions = 5 } = req.body;

    // Validation
    if (!topic || !subject || !level) {
      return res.status(400).json({ error: 'Topic, subject, and level are required' });
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: 'Invalid level' });
    }

    if (numQuestions < 1 || numQuestions > 20) {
      return res.status(400).json({ error: 'Number of questions must be between 1 and 20' });
    }

    // Generate quiz using AI
    const quizData = await aiService.generateQuiz(topic, subject, level, numQuestions);

    // Save quiz to database
    const quiz = new Quiz({
      title: quizData.title,
      topic: quizData.topic,
      subject: quizData.subject,
      level: quizData.level,
      questions: quizData.questions,
      totalQuestions: quizData.totalQuestions,
      timeLimit: quizData.timeLimit,
      createdBy: req.user?._id || null,
      isPublic: true,
      tags: [topic, subject, level],
    });

    await quiz.save();

    // Return quiz data
    res.status(200).json({
      message: 'Quiz generated successfully',
      quiz: {
        id: quiz._id,
        title: quiz.title,
        topic: quiz.topic,
        subject: quiz.subject,
        level: quiz.level,
        totalQuestions: quiz.totalQuestions,
        timeLimit: quiz.timeLimit,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
}

export default optionalAuth(handler); 