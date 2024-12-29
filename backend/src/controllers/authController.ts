import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import nodemailer from 'nodemailer';
import User from '../models/User';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otpUtil';

// Type definitions
interface UserDocument {
  _id: string;
  email: string;
  password: string;
  verified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
}

// Environment variables validation
const requiredEnvVars = [
  'JWT_SECRET',
  'RECAPTCHA_SECRET_KEY',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_SERVICE'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Constants
const JWT_SECRET = process.env.JWT_SECRET!;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!;

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify((error) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// reCAPTCHA verification
const verifyRecaptcha = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
};

// Send email with OTP
const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for RAST signup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d3748; text-align: center;">Welcome to RAST</h2>
        <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="color: #4a5568; text-align: center; margin-bottom: 10px;">Your OTP for signup is:</p>
          <h1 style="color: #2b6cb0; text-align: center; font-size: 32px; margin: 0;">
            ${otp}
          </h1>
        </div>
        <p style="color: #718096; text-align: center; font-size: 14px;">
          This OTP is valid for 10 minutes.<br>
          If you didn't request this OTP, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Controllers
export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, otp, recaptchaToken } = req.body;

    // Input validation
    if (!email || !password || !otp || !recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed',
      });
    }

    // Verify OTP
    const isOTPValid = await verifyOTP(email, otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create new user
    const user = new User({
      email,
      password, // Will be hashed by the User model pre-save hook
      verified: true,
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, recaptchaToken } = req.body;

    // Input validation
    if (!email || !password || !recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

export const sendOTP = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, recaptchaToken } = req.body;

    // Input validation
    if (!email || !recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: 'Email and reCAPTCHA token are required',
      });
    }

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp);

    // Send OTP email
    await sendOTPEmail(email, otp);

    return res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

export const verifyOTPHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, otp } = req.body;

    // Input validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    // Verify OTP
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
    });
  }
};