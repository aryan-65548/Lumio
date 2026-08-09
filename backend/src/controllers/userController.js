import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Protected
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    user,
  });
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Protected
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.fullName = req.body.fullName || user.fullName;
  if (req.body.profilePhoto !== undefined) {
    user.profilePhoto = req.body.profilePhoto;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    user: updatedUser,
  });
});
