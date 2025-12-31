import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Filter,
    ChevronDown,
    BookOpen,
    Users,
    Clock,
    GraduationCap,
    ShieldCheck
} from 'lucide-react';
import { DEMO_CONTENTS, DemoContent } from '@/data/demoContents';
import { EnhancedContentCard } from '@/components/content/EnhancedContentCard';
import { CourseGatekeeperModal } from '@/components/modals/CourseGatekeeperModal';

type TabType = 'community' | 'course';
type SortType = 'recent' | 'popular' | 'rating' | 'downloads';

export const TrendingNotesPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('community');
    const [sortFilter, setSortFilter] = useState<SortType>('recent');
    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [selectedInstitution, setSelectedInstitution] = useState<string>('All');
    const [selectedBadge, setSelectedBadge] = useState<string>('All');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [minRating, setMinRating] = useState<number>(0);

    // Gatekeeper modal state
    const [gatekeeperOpen, setGatekeeperOpen] = useState(false);
    const [selectedGatedContent, setSelectedGatedContent] = useState<DemoContent | null>(null);

    // Close dropdown on navigation/click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (activeDropdown && !target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };

        if (activeDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeDropdown]);

    // Filter Logic
    const filterContent = (content: DemoContent) => {
        // Tab Filter - match the badge logic (universityPath or coursePath = Course)
        const isCourse = !!(content.organization.universityPath || content.organization.coursePath);
        if (activeTab === 'course' && !isCourse) return false;
        if (activeTab === 'community' && isCourse) return false;

        // Tag Filter (Subject)
        if (selectedTag !== 'All') {
            const subject = content.organization.subjectPath?.subject;
            if (subject !== selectedTag) return false;
        }

        // Institution Filter
        if (selectedInstitution !== 'All') {
            const uni = content.organization.universityPath?.university;
            if (uni !== selectedInstitution) return false;
        }

        // Badge Filter
        if (selectedBadge === 'Free') {
            // All content is theoretically "Free" in this demo unless marked otherwise, but let's assume badge 'Free' logic
            // For demo: Course-linked items have the 'Course' badge, others are just 'Free'
            if (content.organization.universityPath || content.organization.coursePath) return false;
        }
        if (selectedBadge === 'Course-linked') {
            if (!content.organization.universityPath && !content.organization.coursePath) return false;
        }

        return true;
    };

    const sortContent = (a: DemoContent, b: DemoContent) => {
        if (sortFilter === 'recent') {
            return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        }
        if (sortFilter === 'popular') {
            return (b.views || 0) - (a.views || 0);
        }
        if (sortFilter === 'rating') {
            return (b.likes || 0) - (a.likes || 0);
        }
        if (sortFilter === 'downloads') {
            return (b.downloads || 0) - (a.downloads || 0);
        }
        return 0;
    };

    const displayedContent = DEMO_CONTENTS
        .filter(filterContent)
        .sort(sortContent);

    // Extract unique subjects for the tag filter
    const subjects = Array.from(new Set(DEMO_CONTENTS.map(c => c.organization.subjectPath?.subject).filter(Boolean)));
    // Extract unique institutions
    const institutions = Array.from(new Set(DEMO_CONTENTS.map(c => c.organization.universityPath?.university).filter(Boolean)));

    return (
        <div className="space-y-8 pb-12 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <TrendingUp className="text-violet-200" />
                        Trending Notes
                    </h1>
                    <p className="text-violet-100 font-medium max-w-xl">
                        Discover the most popular community contributions and top-rated course materials updated in real-time.
                    </p>
                </div>
            </div>

            {/* Navigation & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-10 bg-gray-50/95 backdrop-blur py-2">
                {/* Horizontal Menu (Tabs) */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex shrink-0 overflow-x-auto max-w-full">
                    <button
                        onClick={() => setActiveTab('community')}
                        className={`flex items-center space-x-2 px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'community'
                            ? 'bg-violet-100 text-violet-700 shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                    >
                        <Users size={16} />
                        <span>Community Notes</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('course')}
                        className={`flex items-center space-x-2 px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'course'
                            ? 'bg-violet-100 text-violet-700 shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                    >
                        <BookOpen size={16} />
                        <span>Course Notes</span>
                    </button>
                </div>

                {/* Filters Dropdown */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Sort Dropdown */}
                    <div className="relative dropdown-container">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                            className={`flex items-center justify-between bg-white border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm min-w-[160px] ${activeDropdown === 'sort' ? 'border-violet-500 ring-2 ring-violet-100 text-violet-700' : 'border-gray-200 text-gray-700 hover:border-violet-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Clock size={16} className={activeDropdown === 'sort' ? 'text-violet-500' : 'text-gray-400'} />
                                {sortFilter === 'recent' ? 'Most Recent' : sortFilter === 'popular' ? 'Most Popular' : sortFilter === 'rating' ? 'Highest Rated' : 'Most Downloaded'}
                            </span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'sort' ? 'text-violet-500 rotate-180' : 'text-gray-400'}`} />
                        </button>

                        {activeDropdown === 'sort' && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => { setSortFilter('recent'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">Most Recent</button>
                                <button onClick={() => { setSortFilter('popular'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">Most Popular</button>
                                <button onClick={() => { setSortFilter('rating'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">Highest Rated</button>
                                <button onClick={() => { setSortFilter('downloads'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">Most Downloaded</button>
                            </div>
                        )}
                    </div>

                    {/* Tags Dropdown (Subject) */}
                    <div className="relative dropdown-container">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'subject' ? null : 'subject')}
                            className={`flex items-center justify-between bg-white border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm min-w-[160px] ${activeDropdown === 'subject' ? 'border-violet-500 ring-2 ring-violet-100 text-violet-700' : 'border-gray-200 text-gray-700 hover:border-violet-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Filter size={16} className={activeDropdown === 'subject' ? 'text-violet-500' : 'text-gray-400'} />
                                {selectedTag === 'All' ? 'All Subjects' : selectedTag}
                            </span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'subject' ? 'text-violet-500 rotate-180' : 'text-gray-400'}`} />
                        </button>

                        {activeDropdown === 'subject' && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => { setSelectedTag('All'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">All Subjects</button>
                                {subjects.map(subject => (
                                    <button
                                        key={subject}
                                        onClick={() => { setSelectedTag(subject as string); setActiveDropdown(null); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors"
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Institution Dropdown */}
                    <div className="relative dropdown-container">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'institution' ? null : 'institution')}
                            className={`flex items-center justify-between bg-white border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm min-w-[160px] ${activeDropdown === 'institution' ? 'border-violet-500 ring-2 ring-violet-100 text-violet-700' : 'border-gray-200 text-gray-700 hover:border-violet-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                <GraduationCap size={16} className={activeDropdown === 'institution' ? 'text-violet-500' : 'text-gray-400'} />
                                {selectedInstitution === 'All' ? 'All Institutions' : selectedInstitution}
                            </span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'institution' ? 'text-violet-500 rotate-180' : 'text-gray-400'}`} />
                        </button>

                        {activeDropdown === 'institution' && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => { setSelectedInstitution('All'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">All Institutions</button>
                                {institutions.map(inst => (
                                    <button
                                        key={inst}
                                        onClick={() => { setSelectedInstitution(inst as string); setActiveDropdown(null); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors truncate"
                                    >
                                        {inst}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Badge/Type Dropdown */}
                    <div className="relative dropdown-container">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'badge' ? null : 'badge')}
                            className={`flex items-center justify-between bg-white border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm min-w-[140px] ${activeDropdown === 'badge' ? 'border-violet-500 ring-2 ring-violet-100 text-violet-700' : 'border-gray-200 text-gray-700 hover:border-violet-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={16} className={activeDropdown === 'badge' ? 'text-violet-500' : 'text-gray-400'} />
                                {selectedBadge === 'All' ? 'Any Type' : selectedBadge === 'Free' ? 'Free Only' : 'Course Only'}
                            </span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'badge' ? 'text-violet-500 rotate-180' : 'text-gray-400'}`} />
                        </button>

                        {activeDropdown === 'badge' && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <button onClick={() => { setSelectedBadge('All'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">Any Type</button>
                                <button onClick={() => { setSelectedBadge('Free'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">Free Only</button>
                                <button onClick={() => { setSelectedBadge('Course-linked'); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg font-medium transition-colors">Course-Linked Only</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedContent.length > 0 ? (
                    displayedContent.map(content => (
                        <div key={content.id} className="transform transition-all duration-300 hover:-translate-y-1">
                            <EnhancedContentCard
                                content={content}
                                onClick={() => {
                                    if (content.organization.coursePath) {
                                        // Show gatekeeper modal for course content
                                        setSelectedGatedContent(content);
                                        setGatekeeperOpen(true);
                                    } else if (content.organization.universityPath) {
                                        // Navigate to course access page for university content
                                        navigate(`/course/access/${content.id}`);
                                    } else {
                                        // Navigate to note with 'trending' context for proper My Drive organization
                                        navigate(`/note/${content.id}?browseContext=trending`);
                                    }
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Filter size={24} />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">No notes found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your filters to see more results.</p>
                    </div>
                )}
            </div>

            <CourseGatekeeperModal
                isOpen={gatekeeperOpen}
                onClose={() => setGatekeeperOpen(false)}
                courseName={selectedGatedContent?.organization.coursePath?.courseName || ''}
                provider={selectedGatedContent?.organization.coursePath?.provider || 'Coursera'}
            />
        </div>
    );
};
