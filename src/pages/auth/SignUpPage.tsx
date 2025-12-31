
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Loader2, CheckCircle, Clock } from 'lucide-react';
import { authApiService } from '@/services/auth/authApiService';
import { UserRole } from '@/types';
import { RoleSelector } from '@/components/forms/auth/RoleSelector';
import { StudentVerificationForm } from '@/components/forms/verification/StudentVerificationForm';
import { TeacherVerificationForm } from '@/components/forms/verification/TeacherVerificationForm';
import { EducatorVerificationForm } from '@/components/forms/verification/EducatorVerificationForm';
import { CommunityContributorForm } from '@/components/forms/community/CommunityContributorForm';

type SignUpStep = 'credentials' | 'role' | 'verification' | 'complete';

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<SignUpStep>('credentials');
    const [isLoading, setIsLoading] = useState(false);

    // Form data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [error, setError] = useState('');

    // Step 1: Credentials
    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setStep('role');
    };

    // Step 2: Role Selection
    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleRoleContinue = () => {
        if (!selectedRole) {
            setError('Please select a role');
            return;
        }
        setError('');
        setStep('verification');
    };

    // Step 3: Verification
    const handleVerificationSubmit = async (verificationData: any) => {
        setIsLoading(true);
        setError('');

        try {
            // Register user with backend API
            const result = await authApiService.register({
                email,
                password,
                name,
                role: selectedRole!,
                verificationData: Object.keys(verificationData).length > 0 ? verificationData : undefined
            });

            if (!result.success) {
                setError(result.message);
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            setStep('complete');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            setIsLoading(false);
        }
    };

    // No navigation on complete - user must wait for approval

    const renderProgressBar = () => {
        const steps = ['credentials', 'role', 'verification', 'complete'];
        const currentIndex = steps.indexOf(step);
        const progress = ((currentIndex + 1) / steps.length) * 100;

        return (
            <div className="mb-8">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                    <span className={step === 'credentials' ? 'text-blue-600' : ''}>Account</span>
                    <span className={step === 'role' ? 'text-blue-600' : ''}>Role</span>
                    <span className={step === 'verification' ? 'text-blue-600' : ''}>Verification</span>
                    <span className={step === 'complete' ? 'text-blue-600' : ''}>Complete</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-1/3 h-1/3 bg-blue-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/3 h-1/3 bg-purple-100/50 rounded-full blur-[120px]" />

            <div className="w-full max-w-2xl animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] text-white font-black text-4xl mb-6 shadow-2xl shadow-blue-200">
                        O
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Join OpenLearn Hub</h1>
                    <p className="text-gray-500 font-medium">Create your account and start learning</p>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-10">
                        {renderProgressBar()}

                        {/* Step 1: Credentials */}
                        {step === 'credentials' && (
                            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium placeholder:text-gray-500"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Email Address
                                    </label>
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
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Password
                                    </label>
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

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium placeholder:text-gray-500"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm font-bold ml-2 animate-in fade-in">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3"
                                >
                                    <span>Continue</span>
                                    <ArrowRight size={20} />
                                </button>
                            </form>
                        )}

                        {/* Step 2: Role Selection */}
                        {step === 'role' && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setStep('credentials')}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 font-bold text-sm"
                                >
                                    <ArrowLeft size={16} />
                                    <span>Back</span>
                                </button>

                                <RoleSelector
                                    selectedRole={selectedRole}
                                    onRoleSelect={handleRoleSelect}
                                />

                                {error && (
                                    <p className="text-red-500 text-sm font-bold ml-2 animate-in fade-in">
                                        {error}
                                    </p>
                                )}

                                <button
                                    onClick={handleRoleContinue}
                                    disabled={!selectedRole}
                                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:translate-y-0"
                                >
                                    <span>Continue to Verification</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* Step 3: Verification */}
                        {step === 'verification' && selectedRole && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setStep('role')}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 font-bold text-sm"
                                >
                                    <ArrowLeft size={16} />
                                    <span>Back</span>
                                </button>

                                {selectedRole === 'student' && (
                                    <StudentVerificationForm
                                        email={email}
                                        onSubmit={handleVerificationSubmit}
                                    />
                                )}

                                {selectedRole === 'teacher' && (
                                    <TeacherVerificationForm
                                        email={email}
                                        onSubmit={handleVerificationSubmit}
                                    />
                                )}

                                {selectedRole === 'online_educator' && (
                                    <EducatorVerificationForm
                                        onSubmit={handleVerificationSubmit}
                                    />
                                )}

                                {selectedRole === 'community_contributor' && (
                                    <CommunityContributorForm
                                        onSubmit={handleVerificationSubmit}
                                    />
                                )}
                            </div>
                        )}

                        {/* Step 4: Complete - Verification Pending */}
                        {step === 'complete' && (
                            <div className="text-center py-8">
                                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50">
                                    <Clock className="text-orange-600" size={50} />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-3">Account Under Verification</h2>
                                <p className="text-gray-600 font-medium mb-4 max-w-md mx-auto">
                                    Your account is under verification. You will be notified via email once approved.
                                </p>
                                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                                    Our admin team will review your information and approve your account shortly.
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all inline-flex items-center space-x-2"
                                >
                                    <span>Back to Login</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {step !== 'complete' && (
                        <div className="bg-gray-50 p-8 border-t border-gray-100 text-center">
                            <p className="text-gray-500 font-medium">
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-blue-600 font-black hover:underline"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
