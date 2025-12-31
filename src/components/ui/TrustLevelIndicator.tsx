
import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { CommunityMetrics } from '@/types';
import { trustLevelService } from '@/services/user/trustLevelService';

interface TrustLevelIndicatorProps {
    metrics: CommunityMetrics;
    showDetails?: boolean;
}

export const TrustLevelIndicator: React.FC<TrustLevelIndicatorProps> = ({
    metrics,
    showDetails = true
}) => {
    const levelInfo = trustLevelService.getTrustLevelInfo(metrics.trustLevel);
    const thresholds = trustLevelService.getUpgradeThresholds();
    const currentThreshold = thresholds[metrics.trustLevel];

    // Calculate next level info
    const getNextLevelInfo = () => {
        if (metrics.trustLevel === 'bronze') {
            return { level: 'silver', minScore: thresholds.silver.minScore };
        } else if (metrics.trustLevel === 'silver') {
            return { level: 'gold', minScore: thresholds.gold.minScore };
        }
        return null;
    };

    const nextLevel = getNextLevelInfo();
    const progressToNext = nextLevel
        ? ((metrics.trustScore - currentThreshold.minScore) / (nextLevel.minScore - currentThreshold.minScore)) * 100
        : 100;

    const totalVotes = metrics.upvotes + metrics.downvotes;
    const upvoteRatio = totalVotes > 0 ? (metrics.upvotes / totalVotes) * 100 : 0;

    return (
        <div className="space-y-4">
            {/* Current Level Badge */}
            <div className={`${levelInfo.bgColor} border ${levelInfo.borderColor} rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${levelInfo.bgColor} border-2 ${levelInfo.borderColor} rounded-full flex items-center justify-center text-2xl`}>
                            {levelInfo.icon}
                        </div>
                        <div>
                            <h3 className={`font-black ${levelInfo.textColor} text-lg`}>
                                {levelInfo.label}
                            </h3>
                            <p className="text-xs text-gray-600">{levelInfo.description}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-3xl font-black ${levelInfo.textColor}`}>
                            {metrics.trustScore}
                        </div>
                        <div className="text-xs text-gray-500">Trust Score</div>
                    </div>
                </div>

                {/* Progress Bar */}
                {nextLevel && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-600">
                                Progress to {nextLevel.level.charAt(0).toUpperCase() + nextLevel.level.slice(1)}
                            </span>
                            <span className="text-xs font-bold text-gray-600">
                                {Math.round(progressToNext)}%
                            </span>
                        </div>
                        <div className="h-3 bg-white rounded-full overflow-hidden border border-gray-200">
                            <div
                                className={`h-full ${nextLevel.level === 'silver' ? 'bg-gray-400' : 'bg-yellow-400'
                                    } transition-all duration-500`}
                                style={{ width: `${Math.min(progressToNext, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {nextLevel.minScore - metrics.trustScore} points to next level
                        </p>
                    </div>
                )}

                {metrics.trustLevel === 'gold' && (
                    <div className="flex items-center space-x-2 text-yellow-700">
                        <Award size={16} />
                        <span className="text-xs font-bold">Maximum level achieved! 🎉</span>
                    </div>
                )}
            </div>

            {/* Metrics Breakdown */}
            {showDetails && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp className="text-blue-600" size={18} />
                        <h4 className="font-black text-gray-900">Your Metrics</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                            <div className="text-2xl font-black text-blue-600">
                                {metrics.notesUploaded}
                            </div>
                            <div className="text-xs text-blue-700 font-bold">Notes Uploaded</div>
                        </div>

                        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                            <div className="text-2xl font-black text-green-600">
                                {metrics.upvotes}
                            </div>
                            <div className="text-xs text-green-700 font-bold">Upvotes</div>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                            <div className="text-2xl font-black text-purple-600">
                                {metrics.helpfulMarks}
                            </div>
                            <div className="text-xs text-purple-700 font-bold">Helpful Marks</div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <div className="text-2xl font-black text-gray-600">
                                {Math.round(upvoteRatio)}%
                            </div>
                            <div className="text-xs text-gray-700 font-bold">Positive Ratio</div>
                        </div>
                    </div>

                    {/* Upload Permission Status */}
                    <div className={`mt-4 p-3 rounded-xl border ${metrics.canUploadNotes
                            ? 'bg-green-50 border-green-200'
                            : 'bg-orange-50 border-orange-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${metrics.canUploadNotes ? 'text-green-700' : 'text-orange-700'
                                }`}>
                                Upload Permission
                            </span>
                            <span className={`text-xs font-black px-2 py-1 rounded-full ${metrics.canUploadNotes
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                {metrics.canUploadNotes ? '✓ Enabled' : '✗ Locked'}
                            </span>
                        </div>
                        {!metrics.canUploadNotes && (
                            <p className="text-xs text-orange-600 mt-2">
                                Reach Silver level to unlock note uploads
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Next Level Requirements */}
            {nextLevel && showDetails && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
                    <h4 className="font-black text-gray-900 mb-3">
                        Next Level Requirements
                    </h4>
                    <p className="text-sm text-gray-700 font-medium">
                        {thresholds[nextLevel.level as keyof typeof thresholds].requirements}
                    </p>
                </div>
            )}
        </div>
    );
};
