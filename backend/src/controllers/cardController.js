import Card from '../models/Card.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create / save generated card
// @route   POST /api/card
// @access  Public / Optional Auth
export const createCard = asyncHandler(async (req, res) => {
  const { name, role, techStack, vibe, title, theme, photoUrl, cardImageUrl } = req.body;

  if (!name || !role || !title || !cardImageUrl) {
    res.status(400);
    throw new Error('Please provide name, role, title, and cardImageUrl');
  }

  const card = await Card.create({
    user: req.user ? req.user._id : undefined,
    name,
    role,
    techStack: techStack || '',
    vibe: vibe || '',
    title,
    theme: theme || 'goa',
    photoUrl: photoUrl || '',
    cardImageUrl,
  });

  res.status(201).json({
    success: true,
    card,
  });
});

// @desc    Get card by ID
// @route   GET /api/card/:id
// @access  Public
export const getCardById = asyncHandler(async (req, res) => {
  const card = await Card.findById(req.params.id).populate('user', 'fullName email profilePhoto');

  if (!card) {
    res.status(404);
    throw new Error('Card not found');
  }

  res.json({
    success: true,
    card,
  });
});
