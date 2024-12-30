import { useState } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FormErrors {
  email?: string;
  password?: string;
  otp?: string;
}

export default function SignUp() {
  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  
  // Error handling
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState('');
  
  const router = useRouter();

  const validatePassword = (pwd: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*]/.test(pwd);
    const isLengthValid = pwd.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLengthValid;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword.length < 8) {
      setPasswordStrength('Password must be at least 8 characters');
    } else if (!/[A-Z]/.test(newPassword)) {
      setPasswordStrength('Add an uppercase letter');
    } else if (!/[a-z]/.test(newPassword)) {
      setPasswordStrength('Add a lowercase letter');
    } else if (!/[0-9]/.test(newPassword)) {
      setPasswordStrength('Add a number');
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      setPasswordStrength('Add a special character (!@#$%^&*)');
    } else {
      setPasswordStrength('Strong password!');
    }
  };

  const handleSendOtp = async () => {
    setFormErrors({});
    
    if (!validateEmail(email)) {
      setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    if (!validatePassword(password)) {
      setFormErrors(prev => ({ ...prev, password: 'Password does not meet requirements' }));
      return;
    }

    try {
      setIsOtpLoading(true);
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setIsEmailSent(true);
        toast.success('OTP sent to your email!');
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
        setFormErrors(prev => ({ ...prev, email: response.data.message }));
      }
    } catch (error: any) {
      console.error('Full OTP Send Error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to send OTP';
      toast.error(errorMessage);
      setFormErrors(prev => ({ ...prev, email: errorMessage }));
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setFormErrors(prev => ({ ...prev, otp: 'Please enter the OTP' }));
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/auth/verify-signup`, {
        email,
        password,
        otp
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setIsOtpVerified(true);
        setIsRegistrationComplete(true);
        toast.success('Signup successful!');
        
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Invalid OTP');
        setFormErrors(prev => ({ ...prev, otp: response.data.message }));
      }
    } catch (error: any) {
      console.error('OTP Verify Error:', error);
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Invalid OTP';
      toast.error(errorMessage);
      setFormErrors(prev => ({ ...prev, otp: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailSent) {
      await handleSendOtp();
    } else if (isEmailSent && !isOtpVerified) {
      await handleVerifyOtp();
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - RAST</title>
      </Head>

      <div className="min-h-screen flex bg-black">
        <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div>
              <div className="flex items-center justify-center w-full mb-8 bg-white rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src="/favicon-192x192.png"
                    alt="RAST Logo"
                    className="w-20 h-20"
                  />
                  <span className="text-4xl font-bold text-black">RAST</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center">Start Your Journey</h2>
              <h1 className="mt-2 text-3xl font-bold text-white text-center">Join RAST Today</h1>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isEmailSent}
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>

                {!isEmailSent && (
                  <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordStrength && (
                      <p className={`mt-1 text-sm ${
                        passwordStrength === 'Strong password!' 
                          ? 'text-green-500' 
                          : 'text-yellow-500'
                      }`}>
                        {passwordStrength}
                      </p>
                    )}
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                    )}
                  </div>
                )}

                {isEmailSent && !isOtpVerified && (
                  <div>
                    <label htmlFor="otp" className="text-sm font-medium text-gray-300">
                      Enter OTP
                    </label>
                    <div className="mt-1">
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter 6-digit OTP"
                        required
                      />
                    </div>
                    {formErrors.otp && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.otp}</p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || isOtpLoading}
                className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-150 disabled:opacity-50"
              >
                {isLoading || isOtpLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isEmailSent ? (
                  'Verify OTP'
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>

            <p className="text-center text-gray-400">
              Already have an account?{' '}
              <a href="/auth/signin" className="text-blue-500 hover:text-blue-400">
                Sign in
              </a>
            </p>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-400 via-pink-300 to-blue-500"></div>
      </div>
    </>
  );
}