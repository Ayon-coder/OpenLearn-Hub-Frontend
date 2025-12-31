
import React from 'react';
import { Users, TrendingUp, Award, Info } from 'lucide-react';
import { trustLevelService } from '@/services/user/trustLevelService';

interface CommunityContributorFormProps {
    onSubmit: (data: any) => void;
}

export const CommunityContributorForm: React.FC<CommunityContributorFormProps> = ({ onSubmit }) => {
    const thresholds = trustLevelService.getUpgradeThresholds();

    const handleGetStarted = () => {
        // No verification data needed for community contributors
        onSubmit({});
    };

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-orange-600" size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                    Welcome, Community Contributor!
                </h2>
                <p className="text-gray-600 font-medium">
                    Build trust through quality contributions. No professional credentials required.
                </p>
            </div>

            {/* Trust Level Progression */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="text-orange-600" size={20} />
                    <h3 className="font-black text-gray-900">Trust Level Progression</h3>
                </div>

                <div className="space-y-4">
                    {/* Bronze Level */}
                    <div className="bg-white rounded-xl p-4 border-2 border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🥉</span>
                                <span className="font-black text-orange-700">Bronze</span>
                            </div>
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Starting Level
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Score: {thresholds.bronze.minScore}-{thresholds.bronze.maxScore}
                        </p>
                        <p className="text-xs text-gray-500">
                            ✓ Read and comment on notes<br />
                            ✗ Cannot upload notes yet
                        </p>
                    </div>

                    {/* Silver Level */}
                    <div className="bg-white rounded-xl p-4 border-2 border-gray-300">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🥈</span>
                                <span className="font-black text-gray-700">Silver</span>
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                Upload Enabled
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Score: {thresholds.silver.minScore}-{thresholds.silver.maxScore}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                            ✓ Upload notes<br />
                            ✓ Full community access
                        </p>
                        <p className="text-xs font-bold text-gray-700">
                            Requirements: {thresholds.silver.requirements}
                        </p>
                    </div>

                    {/* Gold Level */}
                    <div className="bg-white rounded-xl p-4 border-2 border-yellow-300">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🥇</span>
                                <span className="font-black text-yellow-700">Gold</span>
                            </div>
                            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                Elite Status
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Score: {thresholds.gold.minScore}-{thresholds.gold.maxScore}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                            ✓ Priority review<br />
                            ✓ Enhanced visibility<br />
                            ✓ Community recognition
                        </p>
                        <p className="text-xs font-bold text-gray-700">
                            Requirements: {thresholds.gold.requirements}
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                        <Award className="text-blue-600" size={18} />
                        <h4 className="font-black text-blue-900 text-sm">Earn Trust</h4>
                    </div>
                    <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Upload quality notes</li>
                        <li>• Receive upvotes</li>
                        <li>• Get helpful marks</li>
                        <li>• Engage with community</li>
                    </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center space-x-2 mb-2">
                        <Info className="text-red-600" size={18} />
                        <h4 className="font-black text-red-900 text-sm">What Affects Trust</h4>
                    </div>
                    <ul className="text-xs text-red-800 space-y-1">
                        <li>• Downvotes reduce score</li>
                        <li>• Reports lower trust</li>
                        <li>• Low-quality content</li>
                        <li>• Spam or violations</li>
                    </ul>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <h4 className="font-black mb-2 flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Your Journey Starts Here</span>
                </h4>
                <p className="text-sm text-gray-300 mb-4">
                    You'll start at Bronze level with read-only access. Contribute quality content,
                    engage positively with the community, and your trust level will automatically
                    upgrade as you meet the requirements.
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Info size={14} />
                    <span>Trust scores update automatically based on community feedback</span>
                </div>
            </div>

            {/* Get Started Button */}
            <button
                onClick={handleGetStarted}
                className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3"
            >
                <Users size={20} />
                <span>Get Started as Community Contributor</span>
            </button>

            {/* Footer Note */}
            <p className="text-xs text-center text-gray-500">
                No documents or credentials required. Your contributions speak for themselves.
            </p>
        </div>
    );
};
