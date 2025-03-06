import { Router } from 'express';
import Notification from '../models/Notification.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export { router };
