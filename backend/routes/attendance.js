import { Router } from 'express';
import Attendance from '../models/Attendance.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Clock In/Out endpoint
router.post('/clock', authMiddleware, async (req, res) => {
  try {
    const { type, location } = req.body;
    const userId = req.user.userId;

    // Validate clock type
    if (!['clockIn', 'clockOut', 'breakStart', 'breakEnd'].includes(type)) {
      return res.status(400).json({ error: 'Invalid clock type' });
    }

    // Create attendance record
    const attendance = new Attendance({
      user: userId,
      type,
      location: {
        coordinates: [location.longitude, location.latitude]
      },
      ipAddress: req.ip,
      deviceInfo: req.headers['user-agent']
    });

    await attendance.save();

    res.status(201).json({ message: 'Attendance recorded successfully', attendance });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

// Get today's attendance
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      user: req.user.userId,
      timestamp: { $gte: startOfDay }
    }).sort('timestamp');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get attendance by date range
router.get('/range', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date

    const attendance = await Attendance.find({
      user: req.user.userId,
      timestamp: {
        $gte: start,
        $lte: end
      }
    }).sort('timestamp');

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance range:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

export { router };