import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (element: string | HTMLElement, options: any) => void;
    };
  }
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  // Load reCAPTCHA script
  useEffect(() => {
    // Only load if not already loaded
    if (!document.querySelector('script[src*="recaptcha"]')) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=6Ld0UKQqAAAAACOxp3FHOL3IH4XYLiURHsP2HWZW`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setRecaptchaLoaded(true);
        // Initialize reCAPTCHA after script loads
        window.grecaptcha?.ready(() => {
          refreshRecaptchaToken();
        });
      };
      
      document.head.appendChild(script);
    } else {
      setRecaptchaLoaded(true);
    }

    return () => {
      // Optional: Cleanup if component unmounts during loading
      const script = document.querySelector('script[src*="recaptcha"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  // Function to refresh reCAPTCHA token
  const refreshRecaptchaToken = async () => {
    if (window.grecaptcha) {
      try {
        const token = await window.grecaptcha.execute('6Ld0UKQqAAAAACOxp3FHOL3IH4XYLiURHsP2HWZW', {
          action: 'signup'
        });
        setRecaptchaToken(token);
      } catch (error) {
        console.error('Error executing reCAPTCHA:', error);
        setError('Error loading reCAPTCHA. Please refresh the page.');
      }
    }
  };

  // Execute reCAPTCHA and return token
  const executeRecaptcha = async () => {
    if (!window.grecaptcha) {
      throw new Error('reCAPTCHA has not loaded yet');
    }

    try {
      const token = await window.grecaptcha.execute('6Ld0UKQqAAAAACOxp3FHOL3IH4XYLiURHsP2HWZW', {
        action: 'signup'
      });
      setRecaptchaToken(token);
      return token;
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Get fresh reCAPTCHA token
      const token = await executeRecaptcha();

      if (!token) {
        setError('Please wait for reCAPTCHA to load');
        return;
      }

      if (!otpSent) {
        // Send OTP logic
        try {
          const response = await axios.post('/api/send-otp', { 
            email,
            recaptchaToken: token
          });
          
          if (response.data.success) {
            setOtpSent(true);
          } else {
            setError(response.data.message || 'Failed to send OTP');
          }
        } catch (err) {
          setError('Error sending OTP');
          console.error('OTP send error:', err);
        }
        return;
      }

      // Signup logic
      const response = await axios.post('/api/signup', {
        email,
        password,
        otp,
        recaptchaToken: token
      });

      if (response.data.success) {
        router.push('/auth/success');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred during signup');
    }
  };

  // Handle social sign-in
  const handleSocialSignIn = async (provider: string) => {
    try {
      const response = await signIn(provider, { 
        redirect: false, 
        callbackUrl: '/auth/success' 
      });
      
      if (response?.ok) {
        router.push('/auth/success');
      } else {
        setError(`${provider} sign-in failed: ${response?.error}`);
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      setError(`Error during ${provider} sign-in`);
    }
  };

  // Password strength checker
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    
    if (pwd.length < 8) {
      setPasswordStrength('Password too short');
    } else if (!/[A-Z]/.test(pwd)) {
      setPasswordStrength('Include at least one uppercase letter');
    } else if (!/[a-z]/.test(pwd)) {
      setPasswordStrength('Include at least one lowercase letter');
    } else if (!/[0-9]/.test(pwd)) {
      setPasswordStrength('Include at least one number');
    } else if (!/[!@#$%^&*]/.test(pwd)) {
      setPasswordStrength('Include at least one special character');
    } else {
      setPasswordStrength('Strong password');
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
              <span className="ml-2 text-xl font-semibold text-white">RAST</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Start your journey</h2>
            <h1 className="mt-2 text-3xl font-bold text-white">Sign Up to RAST</h1>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 bg-red-100 border border-red-400 rounded-lg p-3">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  E-mail
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

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
                  <div className={`text-sm mt-1 ${
                    passwordStrength === 'Strong password' 
                      ? 'text-green-500' 
                      : 'text-yellow-500'
                  }`}>
                    {passwordStrength}
                  </div>
                )}
              </div>

              {otpSent && (
                <div>
                  <label htmlFor="otp" className="text-sm font-medium text-gray-300">
                    OTP
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!recaptchaLoaded}
              >
                {otpSent ? 'Sign Up' : 'Send OTP'}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-white">
              Already have an account?{' '}
              <a href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-700 text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => handleSocialSignIn('google')}
              >
                <FcGoogle className="w-6 h-6 mr-2" />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="hidden md:block w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: 'url("/images/background.jpg")' }}
      />
    </div>
  );
}