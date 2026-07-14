import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    getAllBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    getUserBookings
} from '../controllers/bookingController.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllBookings)
    .post(createBooking);

router.route('/:id')
    .get(getBooking)
    .put(protect, authorize('admin'), updateBooking)
    .delete(protect, authorize('admin'), deleteBooking);

router.get('/user/:userId', getUserBookings);

export default router;
