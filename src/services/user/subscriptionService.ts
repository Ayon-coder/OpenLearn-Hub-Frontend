import {
    User,
    FollowableCreator,
    Subscription,
    FollowEligibility,
    SubscriptionCreatorView,
    CreatorNote,
    CreatorNotesGroup
} from '@/types';
import { DEMO_CONTENTS, DemoContent } from '@/data/demoContents';

class SubscriptionService {
    private STORAGE_KEY_PREFIX = 'openlearn_subscriptions_user_';

    // Get current user ID from auth storage
    private getCurrentUserId(): string | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('openlearn_auth_user');
        if (!userStr) return null;
        try {
            const user = JSON.parse(userStr);
            return user.id;
        } catch {
            return null;
        }
    }

    // Get user-scoped storage key for subscriptions
    private getStorageKey(): string {
        const userId = this.getCurrentUserId();
        if (userId) {
            return `${this.STORAGE_KEY_PREFIX}${userId}`;
        }
        // Fallback for guests (should not happen in practice)
        return 'openlearn_subscriptions_guest';
    }

    // Check if a user can be followed
    getFollowEligibility(user: User): FollowEligibility {
        if (user.role === 'teacher' && user.verificationStatus === 'verified') {
            return {
                canBeFollowed: true,
                badge: 'verified_teacher'
            };
        }

        if (user.role === 'online_educator' && user.verificationStatus === 'verified') {
            return {
                canBeFollowed: true,
                badge: 'online_educator'
            };
        }

        if (user.role === 'community_contributor' &&
            user.communityMetrics?.trustLevel === 'gold') {
            return {
                canBeFollowed: true,
                badge: 'trusted_contributor'
            };
        }

        // Verified Students - Allow following verified students
        if (user.role === 'student' && user.verificationStatus === 'verified') {
            return {
                canBeFollowed: true,
                badge: 'verified_teacher' // Reuse the verified badge
            };
        }

        return {
            canBeFollowed: false,
            reason: 'Only verified users can be followed',
            badge: 'none'
        };
    }

    // Get all subscriptions from localStorage (user-scoped)
    private getSubscriptionsFromStorage(): Subscription[] {
        try {
            const stored = localStorage.getItem(this.getStorageKey());
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    // Save subscriptions to localStorage (user-scoped)
    private saveSubscriptionsToStorage(subscriptions: Subscription[]): void {
        try {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(subscriptions));
            window.dispatchEvent(new Event('subscription-change'));
        } catch (error) {
            console.error('Failed to save subscriptions:', error);
        }
    }

    // Follow a creator
    followCreator(userId: string, creatorId: string): void {
        const subscriptions = this.getSubscriptionsFromStorage();

        // Check if already following
        const exists = subscriptions.some(
            sub => sub.userId === userId && sub.creatorId === creatorId
        );

        if (!exists) {
            const newSub: Subscription = {
                id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                creatorId,
                followedAt: new Date().toISOString()
            };

            subscriptions.push(newSub);
            this.saveSubscriptionsToStorage(subscriptions);
        }
    }

    // Unfollow a creator
    unfollowCreator(userId: string, creatorId: string): void {
        let subscriptions = this.getSubscriptionsFromStorage();
        subscriptions = subscriptions.filter(
            sub => !(sub.userId === userId && sub.creatorId === creatorId)
        );
        this.saveSubscriptionsToStorage(subscriptions);
    }

    // Check if user follows a creator
    isFollowing(userId: string, creatorId: string): boolean {
        const subscriptions = this.getSubscriptionsFromStorage();
        return subscriptions.some(
            sub => sub.userId === userId && sub.creatorId === creatorId
        );
    }

    // Get creator IDs that a user follows
    getFollowedCreatorIds(userId: string): string[] {
        const subscriptions = this.getSubscriptionsFromStorage();
        return subscriptions
            .filter(sub => sub.userId === userId)
            .map(sub => sub.creatorId);
    }

    // Get follower count for a creator
    getFollowerCount(creatorId: string): number {
        const subscriptions = this.getSubscriptionsFromStorage();
        return subscriptions.filter(sub => sub.creatorId === creatorId).length;
    }

    // Convert demo content uploader to FollowableCreator
    private getCreatorFromUploader(uploaderName: string): FollowableCreator | null {
        // Mock data - in production this would come from a real user database
        const mockCreators: Record<string, FollowableCreator> = {
            'Priya Sharma': {
                id: 'creator_priya_sharma',
                name: 'Dr. Priya Sharma',
                avatar: '👩‍🏫',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'IIT Delhi',
                totalNotes: 45,
                totalCourseNotes: 12,
                averageRating: 4.8,
                followerCount: 0,
                reputation: 985
            },
            'Rahul Kumar': {
                id: 'creator_rahul_kumar',
                name: 'Rahul Kumar',
                avatar: '👨‍💼',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'medium',
                channelName: 'CodeWithHarry',
                totalNotes: 120,
                totalCourseNotes: 8,
                averageRating: 4.6,
                followerCount: 0,
                reputation: 742
            },
            'Amit Patel': {
                id: 'creator_amit_patel',
                name: 'Amit Patel',
                avatar: '👨‍🎓',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'medium',
                channelName: 'Apna College',
                totalNotes: 89,
                totalCourseNotes: 5,
                averageRating: 4.7,
                followerCount: 0,
                reputation: 650
            },
            'Sneha Reddy': {
                id: 'creator_sneha_reddy',
                name: 'Sneha Reddy',
                avatar: '👩‍🔬',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'IIT Madras',
                totalNotes: 67,
                totalCourseNotes: 15,
                averageRating: 4.9,
                followerCount: 0,
                reputation: 1120
            },
            'Vikram Singh': {
                id: 'creator_vikram_singh',
                name: 'Vikram Singh',
                avatar: '👨‍🏫',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'BITS Pilani',
                totalNotes: 54,
                totalCourseNotes: 10,
                averageRating: 4.7,
                followerCount: 0,
                reputation: 890
            },
            'Ananya Gupta': {
                id: 'creator_ananya_gupta',
                name: 'Dr. Ananya Gupta',
                avatar: '👩‍💻',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'Stanford University',
                totalNotes: 102,
                totalCourseNotes: 25,
                averageRating: 5.0,
                followerCount: 0,
                reputation: 1450
            },
            'Rohan Mehta': {
                id: 'creator_rohan_mehta',
                name: 'Rohan Mehta',
                avatar: '👨‍🎓',
                role: 'student',
                verificationStatus: 'verified',
                verificationLevel: 'medium',
                institution: 'IIT Bombay',
                totalNotes: 34,
                totalCourseNotes: 0,
                averageRating: 4.5,
                followerCount: 0,
                reputation: 520
            },
            'Rohan Verma': {
                id: 'creator_rohan_verma',
                name: 'Rohan Verma',
                avatar: '👨‍💼',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'medium',
                channelName: 'CodeWithHarry',
                totalNotes: 78,
                totalCourseNotes: 6,
                averageRating: 4.6,
                followerCount: 0,
                reputation: 685
            },
            'Priya Krishnan': {
                id: 'creator_priya_krishnan',
                name: 'Dr. Priya Krishnan',
                avatar: '👩‍🔬',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'IIT Madras',
                totalNotes: 56,
                totalCourseNotes: 14,
                averageRating: 4.8,
                followerCount: 0,
                reputation: 940
            },
            'Karan Malhotra': {
                id: 'creator_karan_malhotra',
                name: 'Karan Malhotra',
                avatar: '👨‍💻',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'medium',
                channelName: 'freeCodeCamp',
                totalNotes: 92,
                totalCourseNotes: 8,
                averageRating: 4.7,
                followerCount: 0,
                reputation: 780
            },
            'Arjun Kapoor': {
                id: 'creator_arjun_kapoor',
                name: 'Arjun Kapoor',
                avatar: '👨‍🏫',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'BITS Pilani',
                totalNotes: 48,
                totalCourseNotes: 11,
                averageRating: 4.6,
                followerCount: 0,
                reputation: 815
            },
            'Dr. Neha Gupta': {
                id: 'creator_neha_gupta',
                name: 'Dr. Neha Gupta',
                avatar: '👩‍🔬',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'AIIMS Delhi',
                totalNotes: 63,
                totalCourseNotes: 18,
                averageRating: 4.9,
                followerCount: 0,
                reputation: 1050
            },
            'Amit Kumar': {
                id: 'creator_amit_kumar',
                name: 'Amit Kumar',
                avatar: '👨‍🏫',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'IIT Kanpur',
                totalNotes: 71,
                totalCourseNotes: 20,
                averageRating: 4.8,
                followerCount: 0,
                reputation: 1180
            },
            'Kavya Iyer': {
                id: 'creator_kavya_iyer',
                name: 'Kavya Iyer',
                avatar: '👩‍💻',
                role: 'student',
                verificationStatus: 'verified',
                verificationLevel: 'medium',
                institution: 'IIT Kanpur',
                totalNotes: 28,
                totalCourseNotes: 0,
                averageRating: 4.4,
                followerCount: 0,
                reputation: 445
            },
            'pro_coder_99': {
                id: 'creator_pro_coder_99',
                name: 'pro_coder_99',
                avatar: '👨‍💻',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'CodeMaster Hub',
                totalNotes: 156,
                totalCourseNotes: 42,
                averageRating: 4.9,
                followerCount: 0,
                reputation: 1850
            }
        };

        return mockCreators[uploaderName] || null;
    }

    // Get all followable creators from demo content
    getAllFollowableCreators(): FollowableCreator[] {
        const uniqueUploaders = Array.from(
            new Set(DEMO_CONTENTS.map(c => c.uploadedBy))
        );

        const creators = uniqueUploaders
            .map(uploader => this.getCreatorFromUploader(uploader))
            .filter((creator): creator is FollowableCreator => creator !== null);

        // Update follower counts
        creators.forEach(creator => {
            creator.followerCount = this.getFollowerCount(creator.id);
        });

        return creators;
    }

    // Group notes by topic
    private groupNotesByTopic(notes: CreatorNote[]): CreatorNotesGroup[] {
        const grouped = new Map<string, CreatorNote[]>();

        notes.forEach(note => {
            const topic = note.topic;
            if (!grouped.has(topic)) {
                grouped.set(topic, []);
            }
            grouped.get(topic)!.push(note);
        });

        return Array.from(grouped.entries()).map(([topic, notes]) => ({
            topic,
            notes: notes.sort((a, b) =>
                new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            )
        }));
    }

    // Get subscription view for a user
    getSubscriptions(userId: string): SubscriptionCreatorView[] {
        const followedCreatorIds = this.getFollowedCreatorIds(userId);
        const allCreators = this.getAllFollowableCreators();

        return followedCreatorIds
            .map(creatorId => {
                const creator = allCreators.find(c => c.id === creatorId);
                if (!creator) return null;

                // Get all content from this creator
                const creatorContent = DEMO_CONTENTS.filter(
                    content => {
                        const contentCreator = this.getCreatorFromUploader(content.uploadedBy);
                        return contentCreator?.id === creatorId;
                    }
                );

                // Convert to CreatorNote format
                const allNotes: CreatorNote[] = creatorContent.map(content => ({
                    id: content.id,
                    title: content.title,
                    subject: content.organization?.subjectPath?.subject || '',
                    topic: content.organization?.subjectPath?.coreTopic || '',
                    subtopic: content.organization?.subjectPath?.subtopic,
                    uploadedAt: content.uploadedAt,
                    isCourseNote: !!(content.organization?.universityPath || content.organization?.coursePath),
                    courseId: content.organization?.universityPath ?
                        `course_${content.organization.universityPath.university}_${content.organization.universityPath.subject}` :
                        undefined,
                    previewAvailable: false
                }));

                // Separate community and course notes
                const communityNotes = allNotes.filter(note => !note.isCourseNote);
                const courseNotes = allNotes.filter(note => note.isCourseNote);

                return {
                    creator,
                    communityNotes: this.groupNotesByTopic(communityNotes),
                    courseNotes: this.groupNotesByTopic(courseNotes),
                    totalCommunityNotes: communityNotes.length,
                    totalCourseNotes: courseNotes.length
                };
            })
            .filter((view): view is SubscriptionCreatorView => view !== null);
    }

    // Get creator by ID
    getCreatorById(creatorId: string): FollowableCreator | null {
        const allCreators = this.getAllFollowableCreators();
        return allCreators.find(c => c.id === creatorId) || null;
    }

    // Get creator by uploader name (for demo content integration)
    getCreatorByUploaderName(uploaderName: string): FollowableCreator | null {
        return this.getCreatorFromUploader(uploaderName);
    }
}

export const subscriptionService = new SubscriptionService();
