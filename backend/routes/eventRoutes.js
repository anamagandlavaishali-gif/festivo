import express from 'express';
import jwt from 'jsonwebtoken';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';
import { findUserById } from '../services/dataStore.js';

const router = express.Router();

// Middleware to optionally attach user to req if token exists
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'festivo_super_secret_jwt_key_2026_college_events'
      );
      const user = await findUserById(decoded.id);
      if (user && user.isActive !== false) {
        req.user = user;
      }
    } catch (e) {
      // Ignore token errors for public read routes
    }
  }
  next();
};

router.get('/', getEvents);
router.get('/my-events', protect, authorize('organizer', 'admin'), getMyEvents);
router.get('/:id', optionalAuth, getEventById);
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

export default router;
