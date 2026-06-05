import userModel from '../models/user.model.js';
import { sendEmail } from '../services/mail.services.js';
import jwt from 'jsonwebtoken';

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

    const emailVerificationToken = jwt.sign({
      email: user.email,
      userId: user._id
    } , process.env.JWT_SECRET);

    await sendEmail({
      to: email,
      subject: 'Welcome to Perplexity!',
      html: `<h1>Welcome, ${username}!</h1><p>Thank you for registering at Perplexity. We're excited to have you on board!</p>
      
      <p>Please verify your email by clicking the link below:</p>
      <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
      `,
      
      text: `Welcome, ${username}! Thank you for registering at Perplexity. We're excited to have you on board!`,
    });

    return res.status(201).json({
      success: false,
      message: 'Verification email sent. Please verify your email to activate your account.',
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



export async function verifyEmailController(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
      });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification token",
    });
  }

  const htmlResponse = 
  `
  h1>Email Verified Successfully!</h1>
  <p>Your email has been verified. You can now log in to your account.</p>
  <a href="http://localhost:3000/login">Go to Login</a>
  `

  res.send(htmlResponse);
}

export const loginController = async (req, res) => {
  // email and password from request body
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
  if (!user.verified) {
    return res.status(403).json({
      success: false,
      message: 'Email not verified. Please verify your email before logging in.',
    });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.cookie('token', token)
    .status(200)
    .json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });


  
};

export const getMeController = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await userModel.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}