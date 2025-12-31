import React from 'react';
import { Users, BookOpen, Lock, ChevronDown } from 'lucide-react';
import { SubscriptionCreatorView } from '@/types';
import { NoteTopicGroup } from './NoteTopicGroup';
import { FollowButton } from '@/components/ui/FollowButton';
import { FollowEligibilityBadge } from '@/components/ui/FollowEligibilityBadge';
import { subscriptionService } from '@/services/user/subscriptionService';

interface SubscriptionCreatorRowProps {
    view: SubscriptionCreatorView;
    onCourseNoteClick?: (noteId: string) => void;
}

export const SubscriptionCreatorRow: React.FC<SubscriptionCreatorRowProps> = ({ view, onCourseNoteClick }) => {
    const { creator, communityNotes, courseNotes, totalCommunityNotes, totalCourseNotes } = view;

    // State for expanded topics
    const [expandedCommunityTopics, setExpandedCommunityTopics] = React.useState<Set<number>>(new Set());
    const [expandedCourseTopics, setExpandedCourseTopics] = React.useState<Set<number>>(new Set());

    const toggleCommunityTopic = (idx: number) => {
        setExpandedCommunityTopics(prev => {
            const newSet = new Set(prev);
            if (newSet.has(idx)) {
                newSet.delete(idx);
            } else {
                newSet.add(idx);
            }
            return newSet;
        });
    };

    const toggleCourseTopic = (idx: number) => {
        setExpandedCourseTopics(prev => {
            const newSet = new Set(prev);
            if (newSet.has(idx)) {
                newSet.delete(idx);
            } else {
                newSet.add(idx);
            }
            return newSet;
        });
    };

    const eligibility = subscriptionService.getFollowEligibility({
        id: creator.id,
        name: creator.name,
        email: '',
        role: creator.role,
        verificationStatus: creator.verificationStatus,
        verificationLevel: creator.verificationLevel,
        communityMetrics: creator.communityMetrics,
        joinedDate: '',
        reputation: creator.reputation,
        badges: []
    });

    const getRoleDisplay = () => {
        if (creator.role === 'teacher') {
            return `Teacher • ${creator.institution}`;
        }
        if (creator.role === 'online_educator') {
            return `Online Educator • ${creator.channelName}`;
        }
        if (creator.role === 'community_contributor') {
            return 'Community Contributor';
        }
        return creator.role;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
            {/* Creator Header Row */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-md">
                            {creator.avatar || creator.name.charAt(0)}
                        </div>

                        {/* Creator Info */}
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-black text-gray-900">{creator.name}</h3>
                                <FollowEligibilityBadge eligibility={eligibility} size="sm" />
                            </div>
                            <p className="text-xs text-gray-600 font-medium">{getRoleDisplay()}</p>
                        </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                                <BookOpen size={14} className="text-blue-600" />
                                <span className="font-bold">{creator.totalNotes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Users size={14} className="text-purple-600" />
                                <span className="font-bold">{creator.followerCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-amber-500">⭐</span>
                                <span className="font-bold">{creator.averageRating.toFixed(1)}</span>
                            </div>
                        </div>
                        <FollowButton
                            creatorId={creator.id}
                            creatorName={creator.name}
                            variant="compact"
                        />
                    </div>
                </div>
            </div>

            {/* Notes Content Row */}
            <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                    {/* Community Notes Column */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                <Users size={14} className="text-blue-600" />
                            </div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                Community Notes
                            </h4>
                            <span className="text-xs text-gray-400 font-bold">• {totalCommunityNotes}</span>
                        </div>

                        {totalCommunityNotes > 0 ? (
                            <div className="space-y-2">
                                {communityNotes.slice(0, 5).map((group, idx) => {
                                    const isExpanded = expandedCommunityTopics.has(idx);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <button
                                                onClick={() => toggleCommunityTopic(idx)}
                                                className="flex items-center justify-between w-full text-left hover:bg-blue-50 rounded-lg px-2 py-1.5 transition-colors group"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <ChevronDown
                                                        size={14}
                                                        className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">
                                                        {group.topic}
                                                    </span>
                                                    <span className="text-xs text-gray-400">({group.notes.length})</span>
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="flex flex-wrap gap-1.5 ml-6 mt-1.5">
                                                    {group.notes.map(note => (
                                                        <button
                                                            key={note.id}
                                                            onClick={() => {
                                                                if (note.isCourseNote && onCourseNoteClick) {
                                                                    onCourseNoteClick(note.id);
                                                                } else {
                                                                    window.location.href = `#/note/${note.id}`;
                                                                }
                                                            }}
                                                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                                                        >
                                                            {note.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {communityNotes.length > 5 && (
                                    <button className="text-xs text-blue-600 hover:text-blue-700 font-bold mt-2">
                                        View all {communityNotes.length} topics →
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No community notes yet</p>
                        )}
                    </div>

                    {/* Course Notes Column */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="p-1.5 bg-amber-50 rounded-lg">
                                <Lock size={14} className="text-amber-600" />
                            </div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                Course Notes
                            </h4>
                            <span className="text-xs text-gray-400 font-bold">• {totalCourseNotes}</span>
                        </div>

                        {totalCourseNotes > 0 ? (
                            <div className="space-y-2">
                                {courseNotes.slice(0, 5).map((group, idx) => {
                                    const isExpanded = expandedCourseTopics.has(idx);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <button
                                                onClick={() => toggleCourseTopic(idx)}
                                                className="flex items-center justify-between w-full text-left hover:bg-amber-50 rounded-lg px-2 py-1.5 transition-colors group"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <ChevronDown
                                                        size={14}
                                                        className={`text-amber-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                    <Lock size={12} className="text-amber-600" />
                                                    <span className="text-sm font-bold text-gray-700 group-hover:text-amber-700">
                                                        {group.topic}
                                                    </span>
                                                    <span className="text-xs text-gray-400">({group.notes.length})</span>
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="flex flex-wrap gap-1.5 ml-6 mt-1.5">
                                                    {group.notes.map(note => (
                                                        <button
                                                            key={note.id}
                                                            onClick={() => {
                                                                if (onCourseNoteClick) {
                                                                    onCourseNoteClick(note.id);
                                                                } else {
                                                                    window.location.href = `#/course/access/${note.id}`;
                                                                }
                                                            }}
                                                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                                                        >
                                                            <span>{note.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {courseNotes.length > 5 && (
                                    <button className="text-xs text-amber-600 hover:text-amber-700 font-bold mt-2">
                                        View all {courseNotes.length} topics →
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No course notes yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
