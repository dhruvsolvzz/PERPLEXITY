import userModel from '../models/user.model.js';
import { sendEmail } from '../services/mail.services.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    const user = await userModel.create({ username, email, password });

    await sendEmail({
      to: email,
      subject: 'Welcome to Perplexity!',
      html: `<h1>Welcome, ${username}!</h1><p>Thank you for registering at Perplexity. We're excited to have you on board!</p>`,
      text: `Welcome, ${username}! Thank you for registering at Perplexity. We're excited to have you on board!`,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};