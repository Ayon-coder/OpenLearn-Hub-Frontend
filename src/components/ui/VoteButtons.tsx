import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface VoteButtonsProps {
    contentId: string;
    upvotes: number;
    downvotes: number;
    userVote: 'up' | 'down' | null;
    onVote: (vote: 'up' | 'down' | null) => void;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
    upvotes,
    downvotes,
    userVote,
    onVote
}) => {
    const handleUpvote = () => {
        onVote(userVote === 'up' ? null : 'up');
    };

    const handleDownvote = () => {
        onVote(userVote === 'down' ? null : 'down');
    };

    return (
        <div className="flex items-center space-x-3">
            <button
                onClick={handleUpvote}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-black transition-all border shadow-sm ${userVote === 'up'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200'
                        : 'bg-white text-gray-700 border-gray-100 hover:bg-blue-50 hover:border-blue-200'
                    }`}
            >
                <ThumbsUp size={18} className={userVote === 'up' ? 'fill-current' : ''} />
                <span>{upvotes}</span>
            </button>

            <button
                onClick={handleDownvote}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-black transition-all border shadow-sm ${userVote === 'down'
                        ? 'bg-red-600 text-white border-red-600 shadow-red-200'
                        : 'bg-white text-gray-700 border-gray-100 hover:bg-red-50 hover:border-red-200'
                    }`}
            >
                <ThumbsDown size={18} className={userVote === 'down' ? 'fill-current' : ''} />
                <span>{downvotes}</span>
            </button>
        </div>
    );
};
