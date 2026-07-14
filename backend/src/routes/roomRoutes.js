import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getAvailableRooms
} from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

export default router;
