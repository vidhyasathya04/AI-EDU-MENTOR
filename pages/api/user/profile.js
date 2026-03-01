import { requireAuth } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { name, avatar, preferences } = req.body;

    // Get user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name) {
      user.name = name;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    if (preferences) {
      if (preferences.subjects) {
        user.preferences.subjects = preferences.subjects;
      }
      if (preferences.difficulty) {
        user.preferences.difficulty = preferences.difficulty;
      }
      if (preferences.notifications !== undefined) {
        user.preferences.notifications = preferences.notifications;
      }
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

export default requireAuth(handler); 