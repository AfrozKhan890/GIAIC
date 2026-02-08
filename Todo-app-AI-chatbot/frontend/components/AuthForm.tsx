'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { AuthResponse } from '@/lib/types';

type AuthMode = 'signin' | 'signup';

interface FormData {
  email: string;
  password: string;
  name: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setValidationErrors({});
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'signup' && !formData.name) {
      errors.name = 'Name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';

      const body = mode === 'signup'
        ? { email: formData.email, password: formData.password, name: formData.name }
        : { email: formData.email, password: formData.password };

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `${mode === 'signup' ? 'Registration' : 'Login'} failed`);
      }

      const authData = data as AuthResponse;
      localStorage.setItem('auth_token', authData.access_token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      toast.success(mode === 'signin' ? 'Welcome to SmartDo! 🚀' : 'Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-[#E5E7EB] shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#0077FF] to-[#38BDF8]">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-[#333333]">
          {mode === 'signin' ? 'Welcome to SmartDo' : 'Join SmartDo'}
        </CardTitle>
        <CardDescription className="text-[#6B7280]">
          {mode === 'signin'
            ? 'Sign in to manage your smart tasks'
            : 'Create your account to get started'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-[#333333]">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className={validationErrors.name ? "border-red-500 focus:ring-red-500/20" : ""}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-red-600 font-medium">{validationErrors.name}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-[#333333]">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={validationErrors.email ? "border-red-500 focus:ring-red-500/20" : ""}
            />
            {validationErrors.email && (
              <p className="text-xs text-red-600 font-medium">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[#333333]">Password</Label>
              {mode === 'signin' && (
                <button type="button" className="text-xs text-[#0077FF] hover:underline font-medium">
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={validationErrors.password ? "border-red-500 focus:ring-red-500/20" : ""}
            />
            {validationErrors.password && (
              <p className="text-xs text-red-600 font-medium">{validationErrors.password}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#0077FF] hover:bg-[#0066DD] text-white shadow-lg"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Please wait...</span>
              </div>
            ) : (
              <>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-center text-[#6B7280] w-full">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-[#0077FF] hover:underline transition-colors"
            disabled={loading}
          >
            {mode === 'signin' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}