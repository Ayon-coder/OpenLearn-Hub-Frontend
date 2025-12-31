
import React from 'react';
import { CheckCircle, Award, AlertCircle, Shield } from 'lucide-react';
import { User } from '@/types';
import { quizPublishingService } from '@/services/quiz/quizPublishingService';

interface QuizPublishingGuardProps {
    user: User;
    compact?: boolean;
}

export const QuizPublishingGuard: React.FC<QuizPublishingGuardProps> = ({ user, compact = false }) => {
    const publishingInfo = quizPublishingService.getPublishingInfo(user);
    const authorTypeInfo = quizPublishingService.getAuthorTypeInfo(publishingInfo.authorType);

    // Direct publishing (Teachers/Educators)
    if (user.role === 'teacher' || user.role === 'online_educator') {
        return (
            <div className={`bg-green-50 border-2 border-green-200 rounded-2xl ${compact ? 'p-4' : 'p-6'}`}>
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                        <CheckCircle className="text-green-600" size={compact ? 20 : 24} />
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-black text-green-900 ${compact ? 'text-sm' : 'text-lg'} mb-1`}>
                            ✅ Direct Publishing Enabled
                        </h3>
                        <p className={`text-green-700 ${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                            {publishingInfo.reason}
                        </p>
                        {!compact && (
                            <div className="mt-3 flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${authorTypeInfo.bgColor} ${authorTypeInfo.textColor} border ${authorTypeInfo.borderColor}`}>
                                    {authorTypeInfo.label}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Trusted user (Students/Contributors with high trust)
    if (publishingInfo.canPublish) {
        return (
            <div className={`bg-blue-50 border-2 border-blue-200 rounded-2xl ${compact ? 'p-4' : 'p-6'}`}>
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        <Award className="text-blue-600" size={compact ? 20 : 24} />
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-black text-blue-900 ${compact ? 'text-sm' : 'text-lg'} mb-1`}>
                            🏆 Trust-Based Publishing
                        </h3>
                        <p className={`text-blue-700 ${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                            {publishingInfo.reason}
                        </p>
                        {!compact && user.communityMetrics && (
                            <div className="mt-3 flex items-center space-x-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                                    {user.communityMetrics.trustLevel.charAt(0).toUpperCase() + user.communityMetrics.trustLevel.slice(1)} Level
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${authorTypeInfo.bgColor} ${authorTypeInfo.textColor} border ${authorTypeInfo.borderColor}`}>
                                    {authorTypeInfo.label}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Verification required
    return (
        <div className={`bg-yellow-50 border-2 border-yellow-200 rounded-2xl ${compact ? 'p-4' : 'p-6'}`}>
            <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 rounded-xl">
                    <AlertCircle className="text-yellow-600" size={compact ? 20 : 24} />
                </div>
                <div className="flex-1">
                    <h3 className={`font-black text-yellow-900 ${compact ? 'text-sm' : 'text-lg'} mb-1`}>
                        ⚠️ Chatbot Verification Required
                    </h3>
                    <p className={`text-yellow-700 ${compact ? 'text-xs' : 'text-sm'} font-medium mb-3`}>
                        {publishingInfo.reason}
                    </p>
                    {!compact && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-yellow-800 uppercase tracking-widest">Your quiz will be checked for:</p>
                            <ul className="space-y-1 text-sm text-yellow-700">
                                <li className="flex items-center space-x-2">
                                    <Shield size={14} className="text-yellow-600" />
                                    <span>Conceptual correctness</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Shield size={14} className="text-yellow-600" />
                                    <span>Question clarity</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Shield size={14} className="text-yellow-600" />
                                    <span>Plagiarism detection</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Shield size={14} className="text-yellow-600" />
                                    <span>Subject alignment</span>
                                </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t border-yellow-200">
                                <p className="text-xs text-yellow-600 font-medium">
                                    💡 <span className="font-bold">Earn direct publishing:</span> Build your trust level to Silver or higher through quality contributions
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
