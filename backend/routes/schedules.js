import { Router } from 'express';
import Schedule from '../models/Schedule.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get user schedule
router.get('/', authMiddleware, async (req, res) => {
  try {
    const schedule = await Schedule.find({ user: req.user.userId });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Get today's schedule
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const schedule = await Schedule.find({
      user: req.user.userId,
      startTime: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json(schedule);
  } catch (error) {
    console.error('Error fetching today\'s schedule:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s schedule' });
  }
});

// Create/Update schedule
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    const schedule = new Schedule({
      user: req.user.userId,
      title,
      startTime,
      endTime
    });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    console.log('Request Body:', req.body);
    console.error('Failed to create/update schedule:', error.message); // Log the error message
    res.status(500).json({ error: 'Failed to create/update schedule' });
  }
});

export { router };