import React from 'react';
import { ShieldCheck, GraduationCap, Award } from 'lucide-react';
import { FollowEligibility } from '@/types';

interface FollowEligibilityBadgeProps {
    eligibility: FollowEligibility;
    size?: 'sm' | 'md' | 'lg';
}

export const FollowEligibilityBadge: React.FC<FollowEligibilityBadgeProps> = ({
    eligibility,
    size = 'md'
}) => {
    if (!eligibility.canBeFollowed) {
        return null;
    }

    const sizeClasses = {
        sm: 'text-[10px] px-2 py-1',
        md: 'text-xs px-3 py-1.5',
        lg: 'text-sm px-4 py-2'
    };

    const iconSizes = {
        sm: 10,
        md: 14,
        lg: 16
    };

    const badges = {
        verified_teacher: {
            label: 'Verified Teacher',
            icon: <GraduationCap size={iconSizes[size]} />,
            className: 'bg-purple-50 text-purple-700 border-purple-200'
        },
        online_educator: {
            label: 'Online Educator',
            icon: <ShieldCheck size={iconSizes[size]} />,
            className: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        trusted_contributor: {
            label: 'Trusted Contributor',
            icon: <Award size={iconSizes[size]} />,
            className: 'bg-amber-50 text-amber-700 border-amber-200'
        },
        none: {
            label: '',
            icon: null,
            className: ''
        }
    };

    const badge = badges[eligibility.badge];

    return (
        <div className={`inline-flex items-center space-x-1 ${sizeClasses[size]} rounded-full font-bold border ${badge.className}`}>
            {badge.icon}
            <span>{badge.label}</span>
        </div>
    );
};
