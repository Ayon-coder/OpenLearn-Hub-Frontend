
import React from 'react';
import { GraduationCap, BookOpen, Globe, ShieldCheck, Medal, Users } from 'lucide-react';
import { User } from '@/types';
import { trustLevelService } from '@/services/user/trustLevelService';

interface VerificationBadgeProps {
    user: User;
    size?: 'small' | 'medium' | 'large';
    showIcon?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
    user,
    size = 'medium',
    showIcon = true
}) => {
    if (user.verificationStatus !== 'verified') {
        return (
            <span className={`
        inline-flex items-center space-x-1 px-2 py-1 rounded-full
        bg-gray-100 text-gray-600 border border-gray-200
        ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'}
        font-bold
      `}>
                {showIcon && <ShieldCheck size={size === 'small' ? 12 : size === 'large' ? 16 : 14} />}
                <span>Unverified</span>
            </span>
        );
    }

    const getBadgeConfig = () => {
        switch (user.role) {
            case 'student':
                return {
                    icon: GraduationCap,
                    label: 'Student Verified',
                    bgColor: 'bg-blue-50',
                    textColor: 'text-blue-700',
                    borderColor: 'border-blue-200',
                    iconColor: 'text-blue-600'
                };
            case 'teacher':
                return {
                    icon: BookOpen,
                    label: 'Teacher Verified',
                    bgColor: 'bg-purple-50',
                    textColor: 'text-purple-700',
                    borderColor: 'border-purple-200',
                    iconColor: 'text-purple-600'
                };
            case 'online_educator':
                return {
                    icon: Globe,
                    label: 'Educator Verified',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-200',
                    iconColor: 'text-green-600'
                };
            case 'community_contributor':
                if (user.communityMetrics) {
                    const levelInfo = trustLevelService.getTrustLevelInfo(user.communityMetrics.trustLevel);
                    return {
                        icon: Medal,
                        label: levelInfo.label,
                        bgColor: levelInfo.bgColor,
                        textColor: levelInfo.textColor,
                        borderColor: levelInfo.borderColor,
                        iconColor: levelInfo.iconColor
                    };
                }
                return {
                    icon: Users,
                    label: 'Community Contributor',
                    bgColor: 'bg-orange-50',
                    textColor: 'text-orange-700',
                    borderColor: 'border-orange-200',
                    iconColor: 'text-orange-600'
                };
            default:
                return {
                    icon: ShieldCheck,
                    label: 'Verified',
                    bgColor: 'bg-gray-50',
                    textColor: 'text-gray-700',
                    borderColor: 'border-gray-200',
                    iconColor: 'text-gray-600'
                };
        }
    };

    const config = getBadgeConfig();
    const Icon = config.icon;

    return (
        <span className={`
      inline-flex items-center space-x-1 px-2 py-1 rounded-full
      ${config.bgColor} ${config.textColor} border ${config.borderColor}
      ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'}
      font-bold
    `}>
            {showIcon && <Icon size={size === 'small' ? 12 : size === 'large' ? 16 : 14} className={config.iconColor} />}
            <span>{config.label}</span>
        </span>
    );
};
