import React, { useState, useEffect } from 'react';
import { Users, Filter, ChevronDown, BookOpen } from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { subscriptionService } from '@/services/user/subscriptionService';
import { SubscriptionCreatorView } from '@/types';
import { SubscriptionCreatorRow } from '@/components/content/SubscriptionCreatorRow';
import { EmptySubscriptions } from '@/components/ui/EmptySubscriptions';
import { useNavigate, useLocation } from 'react-router-dom';
import { CourseGatekeeperModal } from '@/components/modals/CourseGatekeeperModal';
import { DEMO_CONTENTS } from '@/data/demoContents';

type SortType = 'recent' | 'alphabetical' | 'most_notes';

export const SubscriptionsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getUser();
    const [subscriptions, setSubscriptions] = useState<SubscriptionCreatorView[]>([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionCreatorView[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('All');
    const [sortBy, setSortBy] = useState<SortType>('recent');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Gatekeeper modal state
    const [gatekeeperOpen, setGatekeeperOpen] = useState(false);
    const [selectedCourseName, setSelectedCourseName] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('');

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Load subscriptions
    useEffect(() => {
        if (user) {
            const subs = subscriptionService.getSubscriptions(user.id);
            setSubscriptions(subs);
            setFilteredSubscriptions(subs);
        }
    }, [user?.id]);

    // Listen for subscription changes
    useEffect(() => {
        const handleSubscriptionChange = () => {
            if (user) {
                const subs = subscriptionService.getSubscriptions(user.id);
                setSubscriptions(subs);
            }
        };

        window.addEventListener('subscription-change', handleSubscriptionChange);
        return () => window.removeEventListener('subscription-change', handleSubscriptionChange);
    }, [user?.id]);

    // Extract unique subjects from all notes
    const subjects = Array.from(
        new Set(
            subscriptions.flatMap(sub => [
                ...sub.communityNotes.map(g => g.notes).flat(),
                ...sub.courseNotes.map(g => g.notes).flat()
            ].map(note => note.subject))
        )
    ).filter(Boolean);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...subscriptions];

        // Filter by subject
        if (selectedSubject !== 'All') {
            filtered = filtered.map(sub => ({
                ...sub,
                communityNotes: sub.communityNotes.map(group => ({
                    ...group,
                    notes: group.notes.filter(note => note.subject === selectedSubject)
                })).filter(group => group.notes.length > 0),
                courseNotes: sub.courseNotes.map(group => ({
                    ...group,
                    notes: group.notes.filter(note => note.subject === selectedSubject)
                })).filter(group => group.notes.length > 0),
            })).filter(sub => sub.communityNotes.length > 0 || sub.courseNotes.length > 0);
        }

        // Sort creators
        filtered.sort((a, b) => {
            if (sortBy === 'alphabetical') {
                return a.creator.name.localeCompare(b.creator.name);
            }
            if (sortBy === 'most_notes') {
                return (b.totalCommunityNotes + b.totalCourseNotes) - (a.totalCommunityNotes + a.totalCourseNotes);
            }
            // Default: most recent (by first note date)
            const aLatest = Math.max(
                ...a.communityNotes.flatMap(g => g.notes).map(n => new Date(n.uploadedAt).getTime()),
                ...a.courseNotes.flatMap(g => g.notes).map(n => new Date(n.uploadedAt).getTime())
            );
            const bLatest = Math.max(
                ...b.communityNotes.flatMap(g => g.notes).map(n => new Date(n.uploadedAt).getTime()),
                ...b.courseNotes.flatMap(g => g.notes).map(n => new Date(n.uploadedAt).getTime())
            );
            return bLatest - aLatest;
        });

        setFilteredSubscriptions(filtered);
    }, [subscriptions, selectedSubject, sortBy]);


    // Close dropdown on navigation
    useEffect(() => {
        setActiveDropdown(null);
    }, [location.pathname]);

    // Handle course note click to show gatekeeper modal
    const handleCourseNoteClick = (noteId: string) => {
        // Find the content in DEMO_CONTENTS to get course info
        const content = DEMO_CONTENTS.find(c => c.id === noteId);
        if (content?.organization.coursePath) {
            setSelectedCourseName(content.organization.coursePath.courseName);
            setSelectedProvider(content.organization.coursePath.provider);
            setGatekeeperOpen(true);
        } else {
            // Fallback to course access page if no coursePath
            navigate(`/course/access/${noteId}`);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Users size={120} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <Users className="text-violet-200" />
                        My Subscriptions
                    </h1>
                    <p className="text-violet-100 font-medium max-w-xl">
                        Track content from educators you trust. All notes organized by topic for easy navigation.
                    </p>
                    {subscriptions.length > 0 && (
                        <div className="mt-4 flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-violet-200 rounded-full"></div>
                                <span className="font-bold">{subscriptions.length} creator{subscriptions.length !== 1 ? 's' : ''} followed</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-violet-200 rounded-full"></div>
                                <span className="font-bold">
                                    {subscriptions.reduce((sum, s) => sum + s.totalCommunityNotes + s.totalCourseNotes, 0)} total notes
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters Bar */}
            {subscriptions.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                    <div className="flex items-center space-x-3">
                        {/* Subject Filter */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'subject' ? null : 'subject')}
                                className={`flex items-center justify-between bg-white border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm min-w-[180px] ${activeDropdown === 'subject'
                                    ? 'border-violet-500 ring-2 ring-violet-100 text-violet-700'
                                    : 'border-gray-200 text-gray-700 hover:border-violet-300'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <BookOpen size={16} className={activeDropdown === 'subject' ? 'text-violet-500' : 'text-gray-400'} />
                                    {selectedSubject === 'All' ? 'All Subjects' : selectedSubject}
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${activeDropdown === 'subject' ? 'text-violet-500 rotate-180' : 'text-gray-400'
                                        }`}
                                />
                            </button>

                            {activeDropdown === 'subject' && (
                                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-10 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => { setSelectedSubject('All'); setActiveDropdown(null); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors"
                                    >
                                        All Subjects
                                    </button>
                                    {subjects.map(subject => (
                                        <button
                                            key={subject}
                                            onClick={() => { setSelectedSubject(subject); setActiveDropdown(null); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors"
                                        >
                                            {subject}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sort Filter */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                                className={`flex items-center justify-between bg-white border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm min-w-[180px] ${activeDropdown === 'sort'
                                    ? 'border-violet-500 ring-2 ring-violet-100 text-violet-700'
                                    : 'border-gray-200 text-gray-700 hover:border-violet-300'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Filter size={16} className={activeDropdown === 'sort' ? 'text-violet-500' : 'text-gray-400'} />
                                    {sortBy === 'recent' ? 'Most Recent' : sortBy === 'alphabetical' ? 'A-Z' : 'Most Notes'}
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${activeDropdown === 'sort' ? 'text-violet-500 rotate-180' : 'text-gray-400'
                                        }`}
                                />
                            </button>

                            {activeDropdown === 'sort' && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => { setSortBy('recent'); setActiveDropdown(null); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors"
                                    >
                                        Most Recent
                                    </button>
                                    <button
                                        onClick={() => { setSortBy('alphabetical'); setActiveDropdown(null); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors"
                                    >
                                        Alphabetical (A-Z)
                                    </button>
                                    <button
                                        onClick={() => { setSortBy('most_notes'); setActiveDropdown(null); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors"
                                    >
                                        Most Notes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Subscriptions List */}
            <div className="space-y-6">
                {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((view, index) => (
                        <SubscriptionCreatorRow
                            key={view.creator.id || index}
                            view={view}
                            onCourseNoteClick={handleCourseNoteClick}
                        />
                    ))
                ) : subscriptions.length > 0 ? (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Filter size={24} />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">No notes found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your filters to see more results.</p>
                    </div>
                ) : (
                    <EmptySubscriptions />
                )}
            </div>

            <CourseGatekeeperModal
                isOpen={gatekeeperOpen}
                onClose={() => setGatekeeperOpen(false)}
                courseName={selectedCourseName}
                provider={selectedProvider}
            />
        </div>
    );
};
