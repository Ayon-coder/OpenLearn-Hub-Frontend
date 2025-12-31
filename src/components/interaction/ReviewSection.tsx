import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Award, TrendingUp } from 'lucide-react';
import { Review } from '@/types';

interface ReviewSectionProps {
    contentId: string;
    reviews: Review[];
    averageRating: number;
    onReviewSubmit: (review: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'notHelpful'>) => void;
    onReviewHelpful: (reviewId: string, helpful: boolean) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
    contentId,
    reviews,
    averageRating,
    onReviewSubmit,
    onReviewHelpful
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmitReview = () => {
        if (rating > 0 && reviewTitle.trim() && reviewText.trim()) {
            onReviewSubmit({
                contentId,
                userId: 'current_user',
                userName: 'Current User',
                rating,
                title: reviewTitle,
                text: reviewText
            });
            setRating(0);
            setReviewTitle('');
            setReviewText('');
            setShowForm(false);
        }
    };

    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach(review => {
            distribution[review.rating - 1]++;
        });
        return distribution;
    };

    const distribution = getRatingDistribution();
    const totalReviews = reviews.length;

    return (
        <div className="bg-white rounded-[4rem] border border-gray-100 p-10 md:p-16 mb-16">
            {/* Header with Average Rating */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-6">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                        <Award size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">Reviews & Ratings</h3>
                        <p className="text-sm text-gray-500 font-medium">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {/* Rating Summary */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 bg-gray-50 rounded-3xl p-8">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center border-r border-gray-200">
                    <div className="text-6xl font-black text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={24}
                                className={star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Based on {totalReviews} reviews</p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(stars => {
                        const count = distribution[stars - 1];
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        return (
                            <div key={stars} className="flex items-center space-x-3">
                                <span className="text-sm font-bold text-gray-700 w-8">{stars}★</span>
                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-gray-500 w-12 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Review Form */}
            {showForm && (
                <div className="bg-blue-50 rounded-3xl border border-blue-100 p-8 mb-12">
                    <h4 className="text-xl font-black text-gray-900 mb-6">Share Your Experience</h4>

                    {/* Star Rating Input */}
                    <div className="mb-6">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                            Your Rating
                        </label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={40}
                                        className={
                                            star <= (hoverRating || rating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-300'
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Title */}
                    <div className="mb-6">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                            Review Title
                        </label>
                        <input
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="Summarize your experience..."
                            className="w-full px-6 py-4 bg-gray-900 text-white rounded-2xl border-none focus:ring-4 focus:ring-blue-200 outline-none font-medium placeholder:text-gray-500"
                        />
                    </div>

                    {/* Review Text */}
                    <div className="mb-6">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                            Your Review
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share details about your experience with this content..."
                            rows={6}
                            className="w-full px-6 py-4 bg-gray-900 text-white rounded-2xl border-none focus:ring-4 focus:ring-blue-200 outline-none font-medium placeholder:text-gray-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">{reviewText.length} characters</p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setRating(0);
                                setReviewTitle('');
                                setReviewText('');
                            }}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-300 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitReview}
                            disabled={rating === 0 || !reviewTitle.trim() || !reviewText.trim()}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <Star size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this content!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-black flex-shrink-0">
                                        {review.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-black text-gray-900">{review.userName}</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-lg font-black text-gray-900 mb-2">{review.title}</h4>
                            <p className="text-gray-700 font-medium leading-relaxed mb-4">{review.text}</p>

                            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                                <span className="text-xs text-gray-500 font-medium">Was this helpful?</span>
                                <button
                                    onClick={() => onReviewHelpful(review.id, true)}
                                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                                >
                                    <ThumbsUp size={14} />
                                    <span className="font-bold">{review.helpful}</span>
                                </button>
                                <button
                                    onClick={() => onReviewHelpful(review.id, false)}
                                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <ThumbsDown size={14} />
                                    <span className="font-bold">{review.notHelpful}</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
