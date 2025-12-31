
import { CommunityMetrics, TrustLevel } from '@/types';

export type MetricAction =
    | { type: 'note_uploaded' }
    | { type: 'upvote_received' }
    | { type: 'downvote_received' }
    | { type: 'helpful_mark' }
    | { type: 'report_received' };

/**
 * Trust Level Service
 * Manages trust-based verification for community contributors
 */
export const trustLevelService = {
    /**
     * Calculate trust score (0-100) based on community metrics
     * Formula weights:
     * - Notes uploaded: 20%
     * - Upvote ratio: 40%
     * - Helpful marks: 30%
     * - Report penalty: -10%
     */
    calculateTrustScore(metrics: CommunityMetrics): number {
        const {
            notesUploaded,
            upvotes,
            downvotes,
            helpfulMarks,
            reportCount
        } = metrics;

        // Notes score (0-20 points): 1 point per note, max 20
        const notesScore = Math.min(notesUploaded, 20);

        // Upvote ratio score (0-40 points)
        const totalVotes = upvotes + downvotes;
        const upvoteRatio = totalVotes > 0 ? upvotes / totalVotes : 0;
        const upvoteScore = upvoteRatio * 40;

        // Helpful marks score (0-30 points): 1.5 points per mark, max 30
        const helpfulScore = Math.min(helpfulMarks * 1.5, 30);

        // Report penalty (0 to -10 points): -5 points per report
        const reportPenalty = Math.max(reportCount * -5, -10);

        // Total score (0-100)
        const totalScore = notesScore + upvoteScore + helpfulScore + reportPenalty;
        return Math.max(0, Math.min(100, Math.round(totalScore)));
    },

    /**
     * Get trust level based on score
     * Bronze: 0-39 (cannot upload)
     * Silver: 40-69 (can upload)
     * Gold: 70-100 (can upload, priority review)
     */
    getTrustLevel(score: number): TrustLevel {
        if (score >= 70) return 'gold';
        if (score >= 40) return 'silver';
        return 'bronze';
    },

    /**
     * Check if user can upload notes based on trust level
     */
    canUploadNotes(metrics: CommunityMetrics): boolean {
        return metrics.trustLevel === 'silver' || metrics.trustLevel === 'gold';
    },

    /**
     * Update metrics based on user action
     */
    updateMetrics(currentMetrics: CommunityMetrics, action: MetricAction): CommunityMetrics {
        const updated = { ...currentMetrics };

        switch (action.type) {
            case 'note_uploaded':
                updated.notesUploaded += 1;
                break;
            case 'upvote_received':
                updated.upvotes += 1;
                break;
            case 'downvote_received':
                updated.downvotes += 1;
                break;
            case 'helpful_mark':
                updated.helpfulMarks += 1;
                break;
            case 'report_received':
                updated.reportCount += 1;
                break;
        }

        // Recalculate trust score and level
        updated.trustScore = this.calculateTrustScore(updated);
        updated.trustLevel = this.getTrustLevel(updated.trustScore);
        updated.canUploadNotes = this.canUploadNotes(updated);

        return updated;
    },

    /**
     * Get thresholds for each trust level
     */
    getUpgradeThresholds() {
        return {
            bronze: {
                minScore: 0,
                maxScore: 39,
                canUpload: false,
                requirements: 'Build trust through engagement'
            },
            silver: {
                minScore: 40,
                maxScore: 69,
                canUpload: true,
                requirements: '5+ notes, 10+ upvotes, 70%+ positive ratio'
            },
            gold: {
                minScore: 70,
                maxScore: 100,
                canUpload: true,
                requirements: '20+ notes, 50+ upvotes, 80%+ positive ratio'
            }
        };
    },

    /**
     * Get initial metrics for new community contributor
     */
    getInitialMetrics(): CommunityMetrics {
        return {
            notesUploaded: 0,
            upvotes: 0,
            downvotes: 0,
            helpfulMarks: 0,
            reportCount: 0,
            trustScore: 0,
            trustLevel: 'bronze',
            canUploadNotes: false
        };
    },

    /**
     * Get trust level display info
     */
    getTrustLevelInfo(level: TrustLevel) {
        const levels = {
            bronze: {
                label: 'Bronze Contributor',
                color: 'orange',
                icon: '🥉',
                description: 'Starting level - Build your reputation',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-700',
                borderColor: 'border-orange-200',
                iconColor: 'text-orange-600'
            },
            silver: {
                label: 'Silver Contributor',
                color: 'gray',
                icon: '🥈',
                description: 'Trusted contributor - Can upload notes',
                bgColor: 'bg-gray-50',
                textColor: 'text-gray-700',
                borderColor: 'border-gray-200',
                iconColor: 'text-gray-600'
            },
            gold: {
                label: 'Gold Contributor',
                color: 'yellow',
                icon: '🥇',
                description: 'Elite contributor - Priority review',
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
                borderColor: 'border-yellow-200',
                iconColor: 'text-yellow-600'
            }
        };
        return levels[level];
    }
};
