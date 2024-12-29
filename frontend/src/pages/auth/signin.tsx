import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, SignInResponse } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign in');
      console.error('Sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    try {
      setLoading(true);
      setError('');

      const result = await signIn(provider, {
        callbackUrl: '/dashboard',
        redirect: true
      });
      
      // Note: We won't reach this code if redirect is true
      // This is just for handling cases where redirect might fail
      if (result?.error) {
        setError(`Authentication failed. Please try again.`);
      }
    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign-in error:', error);
    } finally {
      setLoading(false);
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
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <h1 className="mt-2 text-3xl font-bold text-white">Sign In to RAST</h1>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-150 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">or sign in with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => handleSocialSignIn('google')}
                disabled={loading}
                className="flex justify-center items-center py-2.5 border border-gray-700 bg-white rounded-lg hover:bg-gray-100 transition duration-150 disabled:opacity-50"
              >
                <FcGoogle className="w-6 h-6" />
              </button>
            </div>
          </form>

          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-blue-500 hover:text-blue-400">
              Sign up
            </a>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-400 via-pink-300 to-blue-500"></div>
    </div>
  );
}