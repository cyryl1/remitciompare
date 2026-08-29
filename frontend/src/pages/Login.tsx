import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Login() {
  const navigate  = useNavigate();
  const login     = useAuthStore((s) => s.login);

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPwd, setShowPwd]       = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // 2. Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Authenticate with our backend
      const data = await authApi.firebaseLogin(idToken);
      
      login(data.user, data.accessToken);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
         setError('Invalid email or password.');
      } else {
         setError(err?.response?.data?.message ?? err.message ?? 'An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      
      const data = await authApi.firebaseLogin(idToken);
      login(data.user, data.accessToken);
      navigate('/');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err?.response?.data?.message ?? err.message ?? 'An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel (desktop) */}
      <div className="hidden lg:flex w-1/2 relative bg-primary-container overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/50 to-transparent z-10" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #9acee1 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-20 flex flex-col justify-center h-full px-16 max-w-2xl">
          <div className="flex items-center gap-2 mb-12">
            <ArrowLeftRight size={32} className="text-vibrant-green" />
            <span className="font-display font-bold text-headline-md text-on-primary tracking-tight">RemitCompare</span>
          </div>
          <h1 className="font-display text-display-md text-on-primary mb-6 leading-tight">
            Precise rates for global citizens.
          </h1>
          <p className="text-body-xl text-primary-fixed-dim opacity-90 max-w-lg">
            Access real-time, data-driven exchange comparisons. Stop losing money to hidden fees and opaque margins.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-surface-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <ArrowLeftRight size={24} className="text-vibrant-green" />
            <span className="font-display font-bold text-headline-sm text-primary">RemitCompare</span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-headline-lg text-primary mb-2">Welcome back</h2>
            <p className="text-body-md text-on-surface-variant">Log in to your account to continue comparing.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-body-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              prefix={<Mail size={18} />}
            />
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-label-sm text-on-surface-variant">Password</label>
                <Link to="/forgot-password" className="text-label-sm text-secondary hover:text-primary">
                  Forgot Password?
                </Link>
              </div>
              <Input
                type={showPwd ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                prefix={<Lock size={18} />}
                suffix={
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="text-outline hover:text-primary">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            <Button type="submit" fullWidth size="lg" variant="secondary" loading={loading}>
              Login
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-variant" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-surface-white text-label-sm text-outline uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex justify-center items-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl bg-surface-white hover:bg-surface-container-low transition-colors col-span-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-body-sm font-medium text-on-surface">Continue with Google</span>
            </button>

          </div>

          <p className="mt-10 text-center text-body-md text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-secondary hover:text-primary transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
