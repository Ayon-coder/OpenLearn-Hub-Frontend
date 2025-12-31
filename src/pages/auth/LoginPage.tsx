
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles, Chrome, ArrowRight, Loader2, Clock } from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { authApiService } from '@/services/auth/authApiService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsPendingApproval(false);
    setIsLoading(true);

    try {
      // Try backend API login first
      const result = await authApiService.login(email, password);

      if (!result.success) {
        if (result.notFound) {
          // Account doesn't exist
          setError('No account found with this email. Please create an account first.');
          setIsPendingApproval(false);
        } else if (result.approved === false) {
          // User account is pending approval
          setIsPendingApproval(true);
          setError('');
        } else {
          setError(result.message);
          setIsPendingApproval(false);
        }
        setIsLoading(false);
        return;
      }

      // On successful login, also update local authService for session with full user data
      if (result.user) {
        // Pass full user data to properly initialize role-based restrictions
        authService.login(result.user.email, password, result.user);
      }

      setIsLoading(false);
      navigate('/');
    } catch (err: any) {
      // Fallback to local auth if backend is not available
      setError(err.message || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('Google login is not available during approval system transition');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Website Manager Button - Top Right */}
      <button
        onClick={() => navigate('/admin/login')}
        className="absolute top-6 right-6 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all flex items-center space-x-2 shadow-lg z-10"
      >
        <span>🔐</span>
        <span>Website Manager</span>
      </button>

      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-1/3 h-1/3 bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-1/3 h-1/3 bg-indigo-100/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-lg animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white font-black text-4xl mb-6 shadow-2xl shadow-blue-200">
            O
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">OpenLearn Hub</h1>
          <p className="text-gray-500 font-medium">Empowering universal education through community.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium placeholder:text-gray-500"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium placeholder:text-gray-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-bold ml-2 animate-in fade-in slide-in-from-top-2">{error}</p>
              )}

              {isPendingApproval && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start space-x-3">
                    <Clock className="text-orange-600 mt-0.5" size={20} />
                    <div>
                      <p className="text-orange-800 font-bold text-sm">Account Pending Verification</p>
                      <p className="text-orange-600 text-sm mt-1">
                        Your account is under verification. You will be notified via email once approved.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-100 transition-all" />
                  <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700">Remember me</span>
                </label>
                <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot Password?</button>
              </div>

              <button
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:translate-y-0"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Sign In to Hub</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-black text-gray-400 tracking-widest">
                <span className="bg-white px-4">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center space-x-3"
            >
              <Chrome size={20} className="text-blue-500" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="bg-gray-50 p-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium">
              Don't have an account? <button onClick={() => navigate('/signup')} className="text-blue-600 font-black hover:underline">Join the Community</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
