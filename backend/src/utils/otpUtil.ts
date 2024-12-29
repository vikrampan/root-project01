Auth Controller and OTP Utility Implementation

// backend/src/utils/otpUtil.ts
import { createClient } from 'redis';
import { promisify } from 'util';

interface RedisClientType {
  connect: () => Promise<void>;
  set: (key: string, value: string, options?: { EX?: number }) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  del: (key: string) => Promise<number>;
  on: (event: string, listener: (err: Error) => void) => void;
}

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err: Error) => {
  console.error('Redis Client Error:', err);
});

// Initialize Redis connection
const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection error:', error);
    // Implement retry logic or fallback mechanism if needed
  }
};

initRedis();

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = async (email: string, otp: string): Promise<void> => {
  try {
    await redisClient.set(`otp:${email}`, otp, { EX: 600 }); // 10 minutes expiration
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw new Error('Failed to store OTP');
  }
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const storedOTP = await redisClient.get(`otp:${email}`);
    if (!storedOTP) return false;
    
    const isValid = storedOTP === otp;
    if (isValid) {
      // Delete OTP after successful verification
      await redisClient.del(`otp:${email}`);
    }
    return isValid;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};