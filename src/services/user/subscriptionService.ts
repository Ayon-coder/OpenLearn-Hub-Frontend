import {
    User,
    FollowableCreator,
    Subscription,
    FollowEligibility,
    SubscriptionCreatorView,
    CreatorNote,
    CreatorNotesGroup
} from '@/types';
import { DemoContent } from '@/data/demoContents';

class SubscriptionService {

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

    // Create a new subscription object (does not save)
    createSubscription(userId: string, creatorId: string): Subscription {
        return {
            id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            creatorId,
            followedAt: new Date().toISOString()
        };
    }

    // Check if user follows a creator
    isFollowing(subscriptions: Subscription[], creatorId: string): boolean {
        return subscriptions.some(sub => sub.creatorId === creatorId);
    }

    // Get follower count for a creator (mock logic needing global data if real)
    // For now we will assume the profile count is static or passed in, 
    // but the original logic filtered local storage which was wrong for "global" counts.
    // We will leave this simple or rely on the mock data counts for now.
    getFollowerCount(_creatorId: string): number {
        return 0; // In a real app, this comes from the backend creator profile
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
            'FreeCodeCamp': {
                id: 'creator_freecodecamp',
                name: 'FreeCodeCamp',
                avatar: '🔥',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'FreeCodeCamp',
                totalNotes: 250,
                totalCourseNotes: 50,
                averageRating: 4.9,
                followerCount: 500000,
                reputation: 5000
            },
            'Traversy Media': {
                id: 'creator_traversy',
                name: 'Traversy Media',
                avatar: '💻',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'Traversy Media',
                totalNotes: 180,
                totalCourseNotes: 40,
                averageRating: 4.8,
                followerCount: 300000,
                reputation: 4500
            },
            'Kevin Powell': {
                id: 'creator_kevin_powell',
                name: 'Kevin Powell',
                avatar: '🎨',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'Kevin Powell',
                totalNotes: 90,
                totalCourseNotes: 15,
                averageRating: 4.9,
                followerCount: 150000,
                reputation: 3000
            },
            'Veritasium': {
                id: 'creator_veritasium',
                name: 'Veritasium',
                avatar: '🔬',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'Veritasium',
                totalNotes: 60,
                totalCourseNotes: 5,
                averageRating: 4.9,
                followerCount: 800000,
                reputation: 6000
            },
            'Professor Dave': {
                id: 'creator_professor_dave',
                name: 'Professor Dave',
                avatar: '🧪',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'Professor Dave Explains',
                totalNotes: 120,
                totalCourseNotes: 20,
                averageRating: 4.7,
                followerCount: 200000,
                reputation: 3500
            },
            '3Blue1Brown': {
                id: 'creator_3blue1brown',
                name: '3Blue1Brown',
                avatar: '📐',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: '3Blue1Brown',
                totalNotes: 40,
                totalCourseNotes: 10,
                averageRating: 5.0,
                followerCount: 600000,
                reputation: 5500
            },
            'TechWorld with Nana': {
                id: 'creator_techworld_nana',
                name: 'TechWorld with Nana',
                avatar: '🐳',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'TechWorld with Nana',
                totalNotes: 85,
                totalCourseNotes: 25,
                averageRating: 4.8,
                followerCount: 250000,
                reputation: 4000
            },
            'Physics Wallah': {
                id: 'creator_physics_wallah',
                name: 'Physics Wallah',
                avatar: '🎯',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'Physics Wallah',
                totalNotes: 500,
                totalCourseNotes: 150,
                averageRating: 4.8,
                followerCount: 1000000,
                reputation: 8000
            },
            'Gate Smashers': {
                id: 'creator_gate_smashers',
                name: 'Gate Smashers',
                avatar: '🚪',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'medium',
                channelName: 'Gate Smashers',
                totalNotes: 200,
                totalCourseNotes: 60,
                averageRating: 4.6,
                followerCount: 180000,
                reputation: 3200
            },
            'IIT Madras CSE': {
                id: 'creator_iit_madras',
                name: 'IIT Madras CSE',
                avatar: '🏛️',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'IIT Madras',
                totalNotes: 300,
                totalCourseNotes: 300,
                averageRating: 4.9,
                followerCount: 50000,
                reputation: 7000
            },
            'BITS Pilani CSE': {
                id: 'creator_bits_pilani',
                name: 'BITS Pilani CSE',
                avatar: '🏛️',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'BITS Pilani',
                totalNotes: 250,
                totalCourseNotes: 250,
                averageRating: 4.8,
                followerCount: 40000,
                reputation: 6500
            },
            'Neso Academy': {
                id: 'creator_neso_academy',
                name: 'Neso Academy',
                avatar: '📚',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'Neso Academy',
                totalNotes: 400,
                totalCourseNotes: 100,
                averageRating: 4.7,
                followerCount: 450000,
                reputation: 5200
            },
            'StatQuest': {
                id: 'creator_statquest',
                name: 'StatQuest with Josh Starmer',
                avatar: '📊',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'StatQuest',
                totalNotes: 75,
                totalCourseNotes: 15,
                averageRating: 4.9,
                followerCount: 220000,
                reputation: 3800
            },
            'Bret Fisher': {
                id: 'creator_bret_fisher',
                name: 'Bret Fisher',
                avatar: '🐳',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'Docker Captain',
                totalNotes: 50,
                totalCourseNotes: 20,
                averageRating: 4.8,
                followerCount: 80000,
                reputation: 2500
            },
            'Dr. Angela Yu': {
                id: 'creator_angela_yu',
                name: 'Dr. Angela Yu',
                avatar: '👩‍⚕️',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'App Brewery',
                totalNotes: 120,
                totalCourseNotes: 45,
                averageRating: 4.9,
                followerCount: 400000,
                reputation: 6200
            },
            'Academind': {
                id: 'creator_academind',
                name: 'Academind',
                avatar: '🎓',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'Academind',
                totalNotes: 150,
                totalCourseNotes: 55,
                averageRating: 4.8,
                followerCount: 350000,
                reputation: 5800
            },
            'Kirill Eremenko': {
                id: 'creator_kirill_eremenko',
                name: 'Kirill Eremenko',
                avatar: '🤖',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'SuperDataScience',
                totalNotes: 80,
                totalCourseNotes: 30,
                averageRating: 4.7,
                followerCount: 150000,
                reputation: 3100
            },
            'Andrew NG': {
                id: 'creator_andrew_ng',
                name: 'Andrew Ng',
                avatar: '🧠',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'Stanford University',
                totalNotes: 45,
                totalCourseNotes: 15,
                averageRating: 5.0,
                followerCount: 900000,
                reputation: 9000
            },
            'Jenny\'s Lectures': {
                id: 'creator_jennys_lectures',
                name: 'Jenny\'s Lectures',
                avatar: '👩‍🏫',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'Jenny\'s Lectures CS/IT',
                totalNotes: 220,
                totalCourseNotes: 80,
                averageRating: 4.7,
                followerCount: 380000,
                reputation: 4800
            },
            'Abdul Bari': {
                id: 'creator_abdul_bari',
                name: 'Abdul Bari',
                avatar: '👨‍🏫',
                role: 'teacher',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                institution: 'Udemy/YouTube',
                totalNotes: 110,
                totalCourseNotes: 40,
                averageRating: 4.9,
                followerCount: 420000,
                reputation: 5400
            },
            'CodeBasics': {
                id: 'creator_codebasics',
                name: 'CodeBasics',
                avatar: '📊',
                role: 'online_educator',
                verificationStatus: 'verified',
                verificationLevel: 'strong',
                channelName: 'CodeBasics',
                totalNotes: 95,
                totalCourseNotes: 25,
                averageRating: 4.8,
                followerCount: 280000,
                reputation: 3900
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

    // Get all followable creators from provided content
    getAllFollowableCreators(allContent: DemoContent[]): FollowableCreator[] {
        const uniqueUploaders = Array.from(
            new Set(allContent.map(c => c.uploadedBy))
        );

        const creators = uniqueUploaders
            .map(uploader => this.getCreatorFromUploader(uploader))
            .filter((creator): creator is FollowableCreator => creator !== null);

        // Update follower counts (mock)
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

    // Get subscription view for a user, computed from subscriptions and all content
    getSubscriptions(subscriptions: Subscription[], allContent: DemoContent[]): SubscriptionCreatorView[] {
        const followedCreatorIds = subscriptions.map(sub => sub.creatorId);
        const allCreators = this.getAllFollowableCreators(allContent);

        return followedCreatorIds
            .map(creatorId => {
                const creator = allCreators.find(c => c.id === creatorId);
                if (!creator) return null;

                // Get all content from this creator
                const creatorContent = allContent.filter(
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

    // Get creator by uploader name (for demo content integration)
    getCreatorByUploaderName(uploaderName: string): FollowableCreator | null {
        return this.getCreatorFromUploader(uploaderName);
    }
}

export const subscriptionService = new SubscriptionService();
