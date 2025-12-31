
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Loader2, Shield } from 'lucide-react';
import { adminService } from '@/services/admin/adminService';

export const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if already logged in
    useEffect(() => {
        if (adminService.isLoggedIn()) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        setIsLoading(true);

        const result = await adminService.login(username, password);

        setIsLoading(false);

        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-1/3 h-1/3 bg-purple-900/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/3 h-1/3 bg-blue-900/30 rounded-full blur-[120px]" />

            <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-[2rem] text-white mb-6 shadow-2xl shadow-purple-900/50">
                        <Shield size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-3">Admin Portal</h1>
                    <p className="text-gray-400 font-medium">OpenLearn Hub Administration</p>
                </div>

                <div className="bg-gray-800 rounded-[2rem] shadow-2xl shadow-black/30 border border-gray-700 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-14 pr-6 py-4 bg-gray-700 text-white border-none rounded-xl focus:ring-4 focus:ring-purple-500/30 outline-none transition-all font-medium placeholder:text-gray-500"
                                        placeholder="admin"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        className="w-full pl-14 pr-6 py-4 bg-gray-700 text-white border-none rounded-xl focus:ring-4 focus:ring-purple-500/30 outline-none transition-all font-medium placeholder:text-gray-500"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm font-bold ml-2 animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </p>
                            )}

                            <button
                                disabled={isLoading}
                                className="w-full py-4 bg-purple-600 text-white rounded-xl font-black shadow-xl shadow-purple-900/30 hover:bg-purple-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:translate-y-0"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <span>Access Dashboard</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-700/50 p-6 border-t border-gray-700 text-center">
                        <p className="text-gray-400 text-sm">
                            <button onClick={() => navigate('/login')} className="text-purple-400 font-bold hover:underline">
                                ← Back to User Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
