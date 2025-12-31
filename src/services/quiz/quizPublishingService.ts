
import { User, PublishingInfo, QuizAuthorType } from '@/types';

/**
 * Quiz Publishing Service
 * Determines quiz publishing permissions based on user role and trust level
 */
export const quizPublishingService = {
    /**
     * Check if user can publish quizzes directly without verification
     */
    canPublishDirectly(user: User): boolean {
        // Teachers & Online Educators: Always allowed
        if (user.role === 'teacher' || user.role === 'online_educator') {
            return true;
        }

        // Community Contributors: Check trust level
        if (user.role === 'community_contributor' && user.communityMetrics) {
            // Silver or Gold trust level can publish directly
            return user.communityMetrics.trustLevel === 'silver' ||
                user.communityMetrics.trustLevel === 'gold';
        }

        // Students: Check verification level (strong = trusted)
        if (user.role === 'student') {
            return user.verificationLevel === 'strong';
        }

        return false;
    },

    /**
     * Check if user requires chatbot verification
     */
    requiresChatbotVerification(user: User): boolean {
        // Only students and community contributors need verification
        if (user.role !== 'student' && user.role !== 'community_contributor') {
            return false;
        }

        // If they can publish directly, no verification needed
        return !this.canPublishDirectly(user);
    },

    /**
     * Get author type based on user role and permissions
     */
    getAuthorType(user: User): QuizAuthorType {
        // Teachers and educators
        if (user.role === 'teacher' || user.role === 'online_educator') {
            return 'educator';
        }

        // Trusted users who can publish directly
        if (this.canPublishDirectly(user)) {
            return 'community_trusted';
        }

        // Students who need verification
        return 'student_verified';
    },

    /**
     * Get publishing reason message
     */
    getPublishingReason(user: User): string {
        if (user.role === 'teacher' || user.role === 'online_educator') {
            return `As a ${user.role === 'teacher' ? 'Teacher' : 'Online Educator'}, you can publish quizzes directly without verification. Your expertise is trusted by the community.`;
        }

        if (this.canPublishDirectly(user)) {
            if (user.role === 'community_contributor' && user.communityMetrics) {
                return `Your ${user.communityMetrics.trustLevel.charAt(0).toUpperCase() + user.communityMetrics.trustLevel.slice(1)} trust level allows you to publish quizzes directly. You've earned this privilege through quality contributions!`;
            }
            if (user.role === 'student') {
                return 'Your verified status allows you to publish quizzes directly.';
            }
        }

        return 'Your quiz will be checked by our chatbot for quality assurance before publishing. This ensures high-quality content for all learners.';
    },

    /**
     * Get complete publishing information for user
     */
    getPublishingInfo(user: User): PublishingInfo {
        return {
            canPublish: this.canPublishDirectly(user),
            requiresVerification: this.requiresChatbotVerification(user),
            reason: this.getPublishingReason(user),
            authorType: this.getAuthorType(user)
        };
    },

    /**
     * Get role display name
     */
    getRoleDisplayName(role: string): string {
        switch (role) {
            case 'teacher': return 'Teacher';
            case 'online_educator': return 'Online Educator';
            case 'student': return 'Student';
            case 'community_contributor': return 'Community Contributor';
            default: return role;
        }
    },

    /**
     * Get author type display info
     */
    getAuthorTypeInfo(authorType: QuizAuthorType) {
        const types = {
            educator: {
                label: 'Educator Verified',
                color: 'purple',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-700',
                borderColor: 'border-purple-200',
                description: 'Created by verified educator'
            },
            student_verified: {
                label: 'Chatbot Verified',
                color: 'blue',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
                borderColor: 'border-blue-200',
                description: 'Verified by AI quality check'
            },
            community_trusted: {
                label: 'Trusted Contributor',
                color: 'orange',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-700',
                borderColor: 'border-orange-200',
                description: 'Created by trusted community member'
            }
        };
        return types[authorType];
    }
};
