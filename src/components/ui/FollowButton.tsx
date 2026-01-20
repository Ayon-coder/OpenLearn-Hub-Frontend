import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { subscriptionService } from '@/services/user/subscriptionService';
import { useAuth } from '@/hooks/useAuth';
import { useUserStorage } from '@/hooks/useUserStorage';

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
    const { profile, updateSubscriptions, loading: profileLoading } = useUserStorage();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Derive isFollowing from profile
    const isFollowing = React.useMemo(() => {
        if (!profile || !profile.subscriptions) return false;
        return subscriptionService.isFollowing(profile.subscriptions, creatorId);
    }, [profile, creatorId]);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        if (profileLoading || !profile) {
            // Profile still loading, show loading feedback
            return;
        }

        setIsLoading(true);

        try {
            let newSubscriptions = [...(profile.subscriptions || [])];

            if (isFollowing) {
                // Unfollow logic
                newSubscriptions = newSubscriptions.filter(sub => sub.creatorId !== creatorId);
                onFollowChange?.(false);
            } else {
                // Follow logic
                const newSub = subscriptionService.createSubscription(user.id, creatorId);
                newSubscriptions.push(newSub);
                onFollowChange?.(true);
            }

            await updateSubscriptions(newSubscriptions);
        } catch (error) {
            console.error("Failed to update subscription", error);
        } finally {
            setIsLoading(false);
        }
    };

    // If profile is loading, show loading state
    if (user && (profileLoading || !profile)) {
        return (
            <button
                disabled
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-sm bg-gray-50 text-gray-400 cursor-wait`}
            >
                <Loader2 size={16} className="animate-spin" />
                <span>Loading...</span>
            </button>
        );
    }

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
