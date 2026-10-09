import express from 'express';
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventParticipants,
  checkRegistrationStatus,
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', protect, registerForEvent);
router.put('/cancel/:id', protect, cancelRegistration);
router.get('/my-registrations', protect, getMyRegistrations);
router.get('/event/:eventId/participants', protect, authorize('organizer', 'admin'), getEventParticipants);
router.get('/status/:eventId', protect, checkRegistrationStatus);

export default router;
