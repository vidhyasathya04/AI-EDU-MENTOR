import { requireAuth } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import StudyPlan from '../../../lib/models/StudyPlan';
import aiService from '../../../lib/ai-service';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { topic, subject, level } = req.body;

    // Validation
    if (!topic || !subject || !level) {
      return res.status(400).json({ error: 'Topic, subject, and level are required' });
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: 'Invalid level' });
    }

    // Generate study plan using AI
    const planData = await aiService.generateStudyPlan(topic, subject, level);

    // Save study plan to database
    const studyPlan = new StudyPlan({
      user: req.user._id,
      title: planData.title,
      description: planData.description,
      topic: planData.topic,
      subject: planData.subject,
      level: planData.level,
      difficulty: planData.difficulty,
      days: planData.days,
      totalDays: planData.totalDays,
      progress: 0,
      status: 'not_started',
      startedAt: Date.now(),
    });

    await studyPlan.save();

    // Return study plan data
    res.status(200).json({
      message: 'Study plan generated successfully',
      studyPlan: {
        id: studyPlan._id,
        title: studyPlan.title,
        description: studyPlan.description,
        topic: studyPlan.topic,
        subject: studyPlan.subject,
        level: studyPlan.level,
        difficulty: studyPlan.difficulty,
        totalDays: studyPlan.totalDays,
        progress: studyPlan.progress,
        status: studyPlan.status,
        days: studyPlan.days,
      },
    });
  } catch (error) {
    console.error('Study plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
}

export default requireAuth(handler); 