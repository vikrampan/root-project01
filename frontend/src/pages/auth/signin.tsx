// pages/auth/signin.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Head from 'next/head';
import { setAuthToken } from '@/utils/auth';
import { toast } from 'react-hot-toast';

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
        // Set auth token in localStorage, cookies, and axios headers
        setAuthToken(response.data.token);
        toast.success('Successfully signed in!');
        
        // Add a small delay before redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to sign in';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - RAST</title>
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
              <h2 className="text-2xl font-bold text-white text-center">Welcome to RAST</h2>
              <h1 className="mt-2 text-3xl font-bold text-white text-center">Your Trusted Digital Partner</h1>
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
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
    </>
  );
}