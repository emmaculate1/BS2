import express from 'express';
import { register, login, getCurrentUser, forgotPassword, resetPassword, sendMessage, getUsers } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/send-message', protect, sendMessage);
router.get('/users', protect, authorize('admin'), getUsers);

export default router;

