import { requireAuth } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import StudyPlan from '../../../lib/models/StudyPlan';
import User from '../../../lib/models/User';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { studyPlanId, dayIndex, taskId } = req.body;

    // Validation
    if (!studyPlanId || dayIndex === undefined || !taskId) {
      return res.status(400).json({ error: 'Study plan ID, day index, and task ID are required' });
    }

    // Get study plan
    const studyPlan = await StudyPlan.findOne({ _id: studyPlanId, user: req.user._id });
    if (!studyPlan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    // Mark task as completed
    studyPlan.completeTask(dayIndex, taskId);
    await studyPlan.save();

    // Update user stats if study plan is completed
    if (studyPlan.status === 'completed') {
      const user = await User.findById(req.user._id);
      user.stats.studyPlansCompleted += 1;
      await user.save();
    }

    // Get updated insights
    const insights = studyPlan.getInsights();

    res.status(200).json({
      message: 'Task completed successfully',
      studyPlan: {
        id: studyPlan._id,
        progress: studyPlan.progress,
        status: studyPlan.status,
        insights,
      },
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
}

export default requireAuth(handler); 