import express from 'express';
import {
  getAdminStats,
  getAllUsersAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  getAllRegistrationsAdmin,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply admin protection to all routes in this router
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id', updateUserAdmin);
router.delete('/users/:id', deleteUserAdmin);
router.get('/registrations', getAllRegistrationsAdmin);

export default router;
