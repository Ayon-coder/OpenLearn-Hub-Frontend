import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, User, Reply } from 'lucide-react';
import { Comment } from '@/types';

interface CommentSectionProps {
    contentId: string;
    comments: Comment[];
    onCommentSubmit: (text: string, parentId?: string) => void;
    onCommentUpvote: (commentId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
    comments,
    onCommentSubmit,
    onCommentUpvote
}) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

    const handleSubmitComment = () => {
        if (newComment.trim()) {
            onCommentSubmit(newComment);
            setNewComment('');
        }
    };

    const handleSubmitReply = (parentId: string) => {
        if (replyText.trim()) {
            onCommentSubmit(replyText, parentId);
            setReplyText('');
            setReplyingTo(null);
        }
    };

    const sortedComments = [...comments].sort((a, b) => {
        if (sortBy === 'popular') {
            return b.upvotes - a.upvotes;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const renderComment = (comment: Comment, isReply = false) => (
        <div key={comment.id} className={`${isReply ? 'ml-12' : ''}`}>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black flex-shrink-0">
                        {comment.userAvatar ? (
                            <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full rounded-full" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="font-black text-gray-900">{comment.userName}</span>
                            <span className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <p className="text-gray-700 font-medium leading-relaxed mb-4">{comment.text}</p>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => onCommentUpvote(comment.id)}
                                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <ThumbsUp size={14} />
                                <span className="font-bold">{comment.upvotes}</span>
                            </button>

                            {!isReply && (
                                <button
                                    onClick={() => setReplyingTo(comment.id)}
                                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    <Reply size={14} />
                                    <span className="font-bold">Reply</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply Input */}
            {replyingTo === comment.id && (
                <div className="ml-12 mb-4">
                    <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl border-none focus:ring-4 focus:ring-blue-200 outline-none font-medium placeholder:text-gray-500 resize-none"
                        />
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">{replyText.length} characters</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText('');
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSubmitReply(comment.id)}
                                    disabled={!replyText.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-2">
                    {comment.replies.map(reply => renderComment(reply, true))}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-gray-50 rounded-[4rem] border border-gray-100 p-10 md:p-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">Comments</h3>
                        <p className="text-sm text-gray-500 font-medium">{comments.length} discussion{comments.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-blue-100 outline-none"
                >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>

            {/* New Comment Input */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or ask a question..."
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-900 text-white rounded-2xl border-none focus:ring-4 focus:ring-blue-200 outline-none font-medium placeholder:text-gray-500 resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500 font-medium">{newComment.length} characters</span>
                    <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
                    >
                        <Send size={18} />
                        <span>Post Comment</span>
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {sortedComments.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    sortedComments.map(comment => renderComment(comment))
                )}
            </div>
        </div>
    );
};
