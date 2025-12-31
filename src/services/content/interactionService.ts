import { Comment, Review, ContentInteraction } from '@/types';
import { authService } from '@/services/auth/authService';

// Mock data storage (in production, this would be API calls)
const interactions: Map<string, ContentInteraction> = new Map();
const comments: Map<string, Comment> = new Map();
const reviews: Map<string, Review> = new Map();

// Initialize with some mock data
const initializeMockData = () => {
    const mockInteraction: ContentInteraction = {
        contentId: 'content_1',
        userVote: null,
        upvotes: 42,
        downvotes: 3,
        comments: [],
        reviews: [],
        averageRating: 4.5,
        totalReviews: 12
    };
    interactions.set('content_1', mockInteraction);
};

initializeMockData();

class InteractionService {
    // Get all interactions for a piece of content
    getContentInteractions(contentId: string): ContentInteraction {
        if (!interactions.has(contentId)) {
            interactions.set(contentId, {
                contentId,
                userVote: null,
                upvotes: 0,
                downvotes: 0,
                comments: [],
                reviews: [],
                averageRating: 0,
                totalReviews: 0
            });
        }
        return interactions.get(contentId)!;
    }

    // Vote on content
    voteContent(contentId: string, vote: 'up' | 'down' | null): ContentInteraction {
        const interaction = this.getContentInteractions(contentId);
        const previousVote = interaction.userVote;

        // Remove previous vote
        if (previousVote === 'up') {
            interaction.upvotes--;
        } else if (previousVote === 'down') {
            interaction.downvotes--;
        }

        // Add new vote
        if (vote === 'up') {
            interaction.upvotes++;
        } else if (vote === 'down') {
            interaction.downvotes++;
        }

        interaction.userVote = vote;
        interactions.set(contentId, interaction);
        return interaction;
    }

    // Add a comment
    addComment(contentId: string, text: string, parentId?: string): Comment {
        const user = authService.getUser();
        if (!user) throw new Error('User must be logged in to comment');

        const newComment: Comment = {
            id: `comment_${Date.now()}_${Math.random()}`,
            contentId,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            text,
            createdAt: new Date().toISOString(),
            upvotes: 0,
            replies: []
        };

        comments.set(newComment.id, newComment);

        const interaction = this.getContentInteractions(contentId);

        if (parentId) {
            // Add as reply
            const parentComment = this.findComment(interaction.comments, parentId);
            if (parentComment) {
                if (!parentComment.replies) parentComment.replies = [];
                parentComment.replies.push(newComment);
            }
        } else {
            // Add as top-level comment
            interaction.comments.push(newComment);
        }

        interactions.set(contentId, interaction);
        return newComment;
    }

    // Helper to find a comment by ID in nested structure
    private findComment(comments: Comment[], commentId: string): Comment | null {
        for (const comment of comments) {
            if (comment.id === commentId) return comment;
            if (comment.replies) {
                const found = this.findComment(comment.replies, commentId);
                if (found) return found;
            }
        }
        return null;
    }

    // Upvote a comment
    upvoteComment(commentId: string): void {
        const comment = comments.get(commentId);
        if (comment) {
            comment.upvotes++;
            comments.set(commentId, comment);
        }
    }

    // Add a review
    addReview(
        contentId: string,
        reviewData: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'notHelpful'>
    ): Review {
        const user = authService.getUser();
        if (!user) throw new Error('User must be logged in to review');

        const newReview: Review = {
            ...reviewData,
            id: `review_${Date.now()}_${Math.random()}`,
            createdAt: new Date().toISOString(),
            helpful: 0,
            notHelpful: 0
        };

        reviews.set(newReview.id, newReview);

        const interaction = this.getContentInteractions(contentId);
        interaction.reviews.push(newReview);
        interaction.totalReviews = interaction.reviews.length;

        // Recalculate average rating
        const totalRating = interaction.reviews.reduce((sum, r) => sum + r.rating, 0);
        interaction.averageRating = totalRating / interaction.reviews.length;

        interactions.set(contentId, interaction);
        return newReview;
    }

    // Mark review as helpful or not helpful
    markReviewHelpful(reviewId: string, helpful: boolean): void {
        const review = reviews.get(reviewId);
        if (review) {
            if (helpful) {
                review.helpful++;
            } else {
                review.notHelpful++;
            }
            reviews.set(reviewId, review);
        }
    }
}

export const interactionService = new InteractionService();
