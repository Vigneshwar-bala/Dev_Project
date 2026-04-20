import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.use((req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123_fallback');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// GET /api/config - get user config
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('aiConfig');
    res.json({ success: true, data: user?.aiConfig || { scoreThreshold: 70, volatilityFilter: 'Medium' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/config - update user config
router.post('/', async (req, res) => {
  try {
    const { scoreThreshold, volatilityFilter } = req.body;
    if (scoreThreshold < 0 || scoreThreshold > 100) {
      return res.status(400).json({ success: false, message: 'Invalid scoreThreshold' });
    }
    const update = { aiConfig: { scoreThreshold, volatilityFilter, updatedAt: new Date() } };
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('aiConfig');
    res.json({ success: true, data: user.aiConfig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

