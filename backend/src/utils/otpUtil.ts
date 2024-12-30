// src/utils/otpUtil.ts
import OTP from '../models/OTP';

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in MongoDB
export const storeOTP = async (email: string, otp: string): Promise<void> => {
  try {
    // Remove any existing OTP for this email
    await OTP.deleteMany({ email });
    
    // Create new OTP document
    await OTP.create({
      email,
      otp
    });
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw new Error('Failed to store OTP');
  }
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc) return false;

    // Delete the OTP document after verification
    await OTP.deleteOne({ _id: otpDoc._id });
    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};