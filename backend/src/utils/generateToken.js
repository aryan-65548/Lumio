import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'lumio_jwt_secret_key_2026_goa_builder_card',
    { expiresIn: '30d' }
  );

  // Set HTTP-only cookie if res object is passed
  if (res && res.cookie) {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  return token;
};

export default generateToken;
