
import React from 'react';
import { Shield, Award, CheckCircle, Clock, XCircle } from 'lucide-react';
import { QuizAuthorType, QuizStatus } from '@/types';
import { quizPublishingService } from '@/services/quiz/quizPublishingService';

interface QuizStatusBadgeProps {
    authorType?: QuizAuthorType;
    status?: QuizStatus;
    size?: 'small' | 'medium' | 'large';
}

export const QuizStatusBadge: React.FC<QuizStatusBadgeProps> = ({
    authorType,
    status,
    size = 'medium'
}) => {
    // Status badges
    if (status) {
        const statusConfig = {
            draft: {
                icon: Clock,
                label: 'Draft',
                bgColor: 'bg-gray-50',
                textColor: 'text-gray-700',
                borderColor: 'border-gray-200'
            },
            pending_verification: {
                icon: Clock,
                label: 'Pending Verification',
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
                borderColor: 'border-yellow-200'
            },
            published: {
                icon: CheckCircle,
                label: 'Published',
                bgColor: 'bg-green-50',
                textColor: 'text-green-700',
                borderColor: 'border-green-200'
            },
            rejected: {
                icon: XCircle,
                label: 'Needs Revision',
                bgColor: 'bg-red-50',
                textColor: 'text-red-700',
                borderColor: 'border-red-200'
            }
        };

        const config = statusConfig[status];
        const Icon = config.icon;
        const iconSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

        return (
            <span className={`
        inline-flex items-center space-x-1 px-2 py-1 rounded-full border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'}
        font-bold
      `}>
                <Icon size={iconSize} />
                <span>{config.label}</span>
            </span>
        );
    }

    // Author type badges
    if (authorType) {
        const authorInfo = quizPublishingService.getAuthorTypeInfo(authorType);
        const iconSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

        const icons = {
            educator: Shield,
            student_verified: CheckCircle,
            community_trusted: Award
        };

        const Icon = icons[authorType];

        return (
            <span className={`
        inline-flex items-center space-x-1 px-2 py-1 rounded-full border
        ${authorInfo.bgColor} ${authorInfo.textColor} ${authorInfo.borderColor}
        ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'}
        font-bold
      `}>
                <Icon size={iconSize} />
                <span>{authorInfo.label}</span>
            </span>
        );
    }

    return null;
};
