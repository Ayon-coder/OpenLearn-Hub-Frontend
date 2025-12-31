import React from 'react';
import { X, LogIn, UserPlus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
    isOpen,
    onClose,
    feature
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSignIn = () => {
        navigate('/login');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Lock size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Sign In Required</h2>
                            <p className="text-blue-100 text-sm font-medium">Unlock full access</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 font-medium mb-6">
                        To access <strong className="text-gray-900">{feature}</strong>, you need to create a free account or sign in.
                    </p>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
                        <h3 className="font-black text-blue-900 mb-2">With a free account, you can:</h3>
                        <ul className="space-y-2 text-sm font-medium text-blue-700">
                            <li className="flex items-center space-x-2">
                                <span className="text-blue-600">✓</span>
                                <span>Upload your own notes</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="text-blue-600">✓</span>
                                <span>Create and share quizzes</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="text-blue-600">✓</span>
                                <span>Organize notes in your personal drive</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="text-blue-600">✓</span>
                                <span>Access course materials</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="text-blue-600">✓</span>
                                <span>Unlimited downloads</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSignUp}
                            className="w-full flex items-center justify-center space-x-2 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                        >
                            <UserPlus size={20} />
                            <span>Create Free Account</span>
                        </button>
                        <button
                            onClick={handleSignIn}
                            className="w-full flex items-center justify-center space-x-2 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-black hover:bg-gray-50 transition-colors"
                        >
                            <LogIn size={20} />
                            <span>Sign In</span>
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-4 font-medium">
                        No credit card required • Free forever
                    </p>
                </div>
            </div>
        </div>
    );
};
