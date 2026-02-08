import AuthForm from '@/components/AuthForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication | TaskSync AI',
  description: 'Sign in or create an account to access AI-powered task management',
};

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00F5D4]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#6BFFB8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-[#A78BFA]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="p-3 rounded-xl bg-gradient-ai text-gray-900 shadow-lg shadow-[#00F5D4]/30 group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl font-bold gradient-text">TaskSync AI</span>
              <span className="text-sm text-muted-foreground">Intelligent Task Management</span>
            </div>
          </Link>
          <p className="text-lg text-muted-foreground">
            Transform your productivity with AI-powered task orchestration
          </p>
        </div>

        <AuthForm />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}