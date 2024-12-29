// frontend/src/pages/api/send-otp.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Log request received
  console.log('API route received request:', req.method);

  // Check HTTP method
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed - only POST is supported'
    });
  }

  try {
    const { email, recaptchaToken } = req.body;
    console.log('Processing request for email:', email);

    // Validate inputs
    if (!email || !recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email and recaptchaToken'
      });
    }

    // Call backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Calling backend at:', backendUrl);

    const response = await axios.post(`${backendUrl}/auth/send-otp`, {
      email,
      recaptchaToken
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: response.data
    });

  } catch (error: any) {
    console.error('API route error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP'
    });
  }
}