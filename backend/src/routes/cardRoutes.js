import express from 'express';
import { createCard, getCardById } from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createCard);
router.get('/:id', getCardById);

export default router;

