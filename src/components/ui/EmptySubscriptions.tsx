import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, TrendingUp } from 'lucide-react';

export const EmptySubscriptions: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-200 p-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus size={40} className="text-blue-600" />
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                        You haven't followed any creators yet
                    </h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        Discover verified educators in the Browse section and follow creators whose educational content you trust.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="bg-blue-50 rounded-2xl p-5 text-left border border-blue-100">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">✅</span>
                            </div>
                            <div>
                                <h4 className="font-black text-blue-900 text-sm mb-1">Only Verified Educators</h4>
                                <p className="text-xs text-blue-700 font-medium">
                                    Follow verified teachers, online educators, and trusted contributors
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-5 text-left border border-purple-100">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">📚</span>
                            </div>
                            <div>
                                <h4 className="font-black text-purple-900 text-sm mb-1">Organized by Topic</h4>
                                <p className="text-xs text-purple-700 font-medium">
                                    All creator notes organized topic-wise for easy navigation
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-5 text-left border border-green-100">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">🔒</span>
                            </div>
                            <div>
                                <h4 className="font-black text-green-900 text-sm mb-1">Community & Course Notes</h4>
                                <p className="text-xs text-green-700 font-medium">
                                    Access free community notes and enrolled course materials
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="pt-6">
                    <button
                        onClick={() => navigate('/trending')}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        <TrendingUp size={20} />
                        <span>Browse Trending Notes</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
