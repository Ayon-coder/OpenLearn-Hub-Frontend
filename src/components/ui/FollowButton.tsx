import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { subscriptionService } from '@/services/user/subscriptionService';
import { authService } from '@/services/auth/authService';

interface FollowButtonProps {
    creatorId: string;
    creatorName: string;
    variant?: 'default' | 'compact';
    onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
    creatorId,
    creatorName,
    variant = 'default',
    onFollowChange
}) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = authService.getUser();

    useEffect(() => {
        if (user) {
            setIsFollowing(subscriptionService.isFollowing(user.id, creatorId));
        }
    }, [user, creatorId]);

    useEffect(() => {
        const handleSubscriptionChange = () => {
            if (user) {
                setIsFollowing(subscriptionService.isFollowing(user.id, creatorId));
            }
        };

        window.addEventListener('subscription-change', handleSubscriptionChange);
        return () => window.removeEventListener('subscription-change', handleSubscriptionChange);
    }, [user, creatorId]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            // Redirect to login if not authenticated
            window.location.hash = '/login';
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            if (isFollowing) {
                subscriptionService.unfollowCreator(user.id, creatorId);
                setIsFollowing(false);
                onFollowChange?.(false);
            } else {
                subscriptionService.followCreator(user.id, creatorId);
                setIsFollowing(true);
                onFollowChange?.(true);
            }
            setIsLoading(false);
        }, 200);
    };

    if (variant === 'compact') {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${isFollowing
                        ? 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isFollowing ? (
                    <>
                        <UserCheck size={16} />
                        <span>Following</span>
                    </>
                ) : (
                    <>
                        <UserPlus size={16} />
                        <span>Follow</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-black transition-all ${isFollowing
                    ? 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isFollowing ? (
                <>
                    <UserCheck size={20} />
                    <span>Following {creatorName}</span>
                </>
            ) : (
                <>
                    <UserPlus size={20} />
                    <span>Follow {creatorName}</span>
                </>
            )}
        </button>
    );
};
