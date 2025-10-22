'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { LockClosedIcon, EnvelopeIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@kedco.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Left Side - Background Image */}
      <div
        className="hidden w-1/2 lg:flex lg:flex-col lg:justify-center lg:px-12"
        style={{
          backgroundImage: 'url(/kedco1.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-3xl font-bold text-gray-900">KEDCO Registry</h1>
            <p className="mt-2 text-gray-600">Document Management System</p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            {/* KEDCO Logo */}
            <div className="mb-6 flex justify-center">
              <img src="/KEDCO.jpg" alt="KEDCO Logo" className="h-20 w-auto" />
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                <ExclamationCircleIcon className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="you@kedco.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6">
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
              >
                {showCredentials ? 'Hide' : 'Show'} Demo Credentials
              </button>

              {showCredentials && (
                <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                  <p className="font-semibold text-gray-700">Demo Accounts:</p>
                  <button
                    onClick={() => handleDemoLogin('admin@kedco.com', 'admin123')}
                    className="block w-full rounded bg-white p-2 text-left hover:bg-gray-100"
                  >
                    <span className="font-medium">Admin:</span> admin@kedco.com / admin123
                  </button>
                  <button
                    onClick={() => handleDemoLogin('md@kedco.com', 'md123')}
                    className="block w-full rounded bg-white p-2 text-left hover:bg-gray-100"
                  >
                    <span className="font-medium">MD:</span> md@kedco.com / md123
                  </button>
                  <button
                    onClick={() => handleDemoLogin('john.doe@kedco.com', 'john123')}
                    className="block w-full rounded bg-white p-2 text-left hover:bg-gray-100"
                  >
                    <span className="font-medium">Dept Head:</span> john.doe@kedco.com / john123
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-600">
            © 2025 KEDCO. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
