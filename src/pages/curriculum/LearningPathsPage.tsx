import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Clock, ChevronRight, Filter, Search,
    Play, ExternalLink, GraduationCap, Target, Sparkles,
    User, Trash2, Loader2, Calendar, CheckCircle2
} from 'lucide-react';
import {
    LEARNING_PATHS,
    LEARNING_CATEGORIES,
    DOMAINS_BY_CATEGORY,
    LEVELS,
    LearningCategory,
    LearningLevel,
    LearningPath,
    LearningResource
} from '@/data/learningPathsData';
import {
    resolveResource,
    getPlatformIcon,
    getPlatformLabel,
    getPlatformColor
} from '@/services/curriculum/resourceMappingService';
import { curriculumService, SavedCurriculum } from '@/services/curriculum/curriculumService';
import { authService } from '@/services/auth/authService';

// ============================================
// COMPONENTS
// ============================================

interface ResourceCardProps {
    resource: LearningResource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    const resolved = resolveResource(resource);
    const platformColor = getPlatformColor(resource.platform);
    const platformLabel = getPlatformLabel(resource.platform);
    const platformIcon = getPlatformIcon(resource.platform);

    const handleClick = () => {
        if (resolved.isInternal) {
            window.location.hash = resolved.viewUrl;
        } else {
            window.open(resolved.viewUrl, '_blank');
        }
    };

    return (
        <div
            onClick={handleClick}
            className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    {/* Badges */}
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                        <span className={`px - 3 py - 1 rounded - xl text - xs font - black shadow - sm ${platformColor} `}>
                            {platformIcon} {platformLabel}
                        </span>
                        {resolved.isInternal && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1">
                                <CheckCircle2 size={12} /> On Platform
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h4 className="font-black text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-2">{resource.description}</p>

                    {/* Meta info */}
                    <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center space-x-1.5 text-sm text-gray-500">
                            <div className="p-1 bg-gray-100 rounded-lg">
                                <Clock size={12} className="text-gray-600" />
                            </div>
                            <span className="font-semibold">{resource.duration}</span>
                        </div>
                        <span className="capitalize px-3 py-1 bg-gray-100 rounded-xl text-xs font-bold text-gray-600">
                            {resource.type}
                        </span>
                    </div>
                </div>

                {/* Play button with glow */}
                <div className="relative ml-5">
                    <div className={`p - 4 rounded - 2xl transition - all duration - 300 ${resolved.isInternal
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg group-hover:shadow-blue-300/50 group-hover:scale-110'
                        : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-900 group-hover:scale-110'
                        } `}>
                        {resolved.isInternal ? (
                            <Play size={22} className="text-white" fill="white" />
                        ) : (
                            <ExternalLink size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                        )}
                    </div>
                    {/* Glow effect */}
                    {resolved.isInternal && (
                        <div className="absolute inset-0 bg-blue-400 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl" />
                    )}
                </div>
            </div>
        </div>
    );
};

interface PathCardProps {
    path: LearningPath;
    onSelect: () => void;
}

const PathCard: React.FC<PathCardProps> = ({ path, onSelect }) => {
    const levelColors = {
        beginner: 'from-green-400 via-emerald-500 to-teal-600',
        intermediate: 'from-blue-400 via-cyan-500 to-sky-600',
        advanced: 'from-purple-400 via-pink-500 to-rose-600'
    };

    const levelBgColors = {
        beginner: 'from-green-50 via-emerald-50 to-teal-50',
        intermediate: 'from-blue-50 via-cyan-50 to-sky-50',
        advanced: 'from-purple-50 via-pink-50 to-rose-50'
    };

    const levelBadgeColors = {
        beginner: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
        intermediate: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
        advanced: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
    };

    return (
        <div
            onClick={onSelect}
            className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
        >
            {/* Gradient top bar */}
            <div className={`h - 1.5 bg - gradient - to - r ${levelColors[path.level]} `} />

            {/* Gradient background on hover */}
            <div className={`absolute inset - 0 bg - gradient - to - br ${levelBgColors[path.level]} opacity - 0 group - hover: opacity - 100 transition - opacity duration - 500`} />

            <div className="relative p-7">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                            <BookOpen size={28} className="text-gray-600" />
                        </div>
                        {/* Glow effect */}
                        <div className={`absolute -inset-2 bg-gradient-to-r ${levelColors[path.level]} opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500`} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg ${levelBadgeColors[path.level]}`}>
                        {path.level.charAt(0).toUpperCase() + path.level.slice(1)}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                    {path.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-5 line-clamp-2">{path.description}</p>

                {/* Stats bar */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-transparent transition-colors">
                    <div className="flex items-center space-x-5">
                        <div className="flex items-center space-x-1.5 text-sm">
                            <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-white/70 transition-colors">
                                <Clock size={14} className="text-gray-600" />
                            </div>
                            <span className="font-bold text-gray-700">{path.totalHours}h</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-sm">
                            <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-white/70 transition-colors">
                                <BookOpen size={14} className="text-gray-600" />
                            </div>
                            <span className="font-bold text-gray-700">{path.totalResources}</span>
                        </div>
                    </div>

                    {/* Arrow button */}
                    <div className={`p - 2.5 rounded - xl bg - gray - 100 group - hover: bg - gradient - to - r ${levelColors[path.level]} transition - all duration - 300`}>
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PathDetailProps {
    path: LearningPath;
    onBack: () => void;
}

const PathDetail: React.FC<PathDetailProps> = ({ path, onBack }) => {
    const [expandedCourse, setExpandedCourse] = useState<string | null>(path.courses[0]?.id);

    const levelColors = {
        beginner: 'from-green-500 to-emerald-600',
        intermediate: 'from-blue-500 to-cyan-600',
        advanced: 'from-purple-500 to-pink-600'
    };

    return (
        <div>
            {/* Header */}
            <div className={`bg - gradient - to - r ${levelColors[path.level]} rounded - 3xl p - 8 text - white mb - 8`}>
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
                >
                    <ChevronRight size={20} className="rotate-180" />
                    <span>Back to paths</span>
                </button>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                            <BookOpen size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black mb-2">{path.title}</h1>
                        <p className="text-white/80">{path.description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-black">{path.totalHours}h</p>
                        <p className="text-white/70">total duration</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-white/20">
                    <div>
                        <p className="text-white/70 text-sm">Courses</p>
                        <p className="font-bold text-xl">{path.courses.length}</p>
                    </div>
                    <div>
                        <p className="text-white/70 text-sm">Resources</p>
                        <p className="font-bold text-xl">{path.totalResources}</p>
                    </div>
                    <div>
                        <p className="text-white/70 text-sm">Level</p>
                        <p className="font-bold text-xl capitalize">{path.level}</p>
                    </div>
                </div>
            </div>

            {/* Courses */}
            <div className="space-y-4">
                {path.courses.map((course, index) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                            className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-all"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w - 10 h - 10 rounded - xl bg - gradient - to - r ${levelColors[path.level]} flex items - center justify - center text - white font - bold`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                                    <p className="text-sm text-gray-500">{course.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-400">{course.resources.length} resources</span>
                                <ChevronRight
                                    size={20}
                                    className={`text - gray - 400 transition - transform ${expandedCourse === course.id ? 'rotate-90' : ''} `}
                                />
                            </div>
                        </button>

                        {expandedCourse === course.id && (
                            <div className="px-6 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                                {course.resources.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================
// MAIN PAGE
// ============================================

export const LearningPathsPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<LearningCategory>('tech');
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<LearningLevel | null>(null);
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // User's saved curricula
    const [showUserPaths, setShowUserPaths] = useState(false);
    const [userCurricula, setUserCurricula] = useState<SavedCurriculum[]>([]);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const user = authService.getUser();
    const userId = user?.id;

    // Fetch user's saved curricula when section is opened
    useEffect(() => {
        if (userId && showUserPaths && !hasFetched) {
            setIsLoadingUser(true);
            curriculumService.getUserCurricula(userId)
                .then(curricula => {
                    setUserCurricula(curricula);
                    setHasFetched(true);
                })
                .catch(err => {
                    console.error('Error fetching curricula:', err);
                    setHasFetched(true);
                })
                .finally(() => setIsLoadingUser(false));
        }
    }, [userId, showUserPaths, hasFetched]);

    const handleDeleteCurriculum = async (id: string) => {
        if (!user) return;
        if (confirm('Are you sure you want to delete this learning path?')) {
            const success = await curriculumService.delete(id, user.id);
            if (success) {
                setUserCurricula(prev => prev.filter(c => c.id !== id));
            }
        }
    };

    const domains = DOMAINS_BY_CATEGORY[selectedCategory];

    const filteredPaths = useMemo(() => {
        return LEARNING_PATHS.filter(path => {
            if (path.category !== selectedCategory) return false;
            if (selectedDomain && path.domain !== selectedDomain) return false;
            if (selectedLevel && path.level !== selectedLevel) return false;
            if (searchQuery) {
                const search = searchQuery.toLowerCase();
                return (
                    path.title.toLowerCase().includes(search) ||
                    path.description.toLowerCase().includes(search) ||
                    path.domain.toLowerCase().includes(search)
                );
            }
            return true;
        });
    }, [selectedCategory, selectedDomain, selectedLevel, searchQuery]);

    if (selectedPath) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-6">
                <div className="max-w-5xl mx-auto">
                    <PathDetail path={selectedPath} onBack={() => setSelectedPath(null)} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <GraduationCap size={32} className="text-blue-600" />
                            <h1 className="text-3xl font-black text-gray-900">Learning Paths</h1>
                        </div>
                        {user && (
                            <button
                                onClick={() => setShowUserPaths(!showUserPaths)}
                                className={`group flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${showUserPaths
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-200 scale-105'
                                    : 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 hover:scale-105'
                                    }`}
                            >
                                <User size={18} className={showUserPaths ? 'text-white' : 'text-purple-600 group-hover:text-purple-700'} />
                                <span>Your Learning Paths</span>
                                {userCurricula.length > 0 && (
                                    <span className={`ml-1 px-2 py-0.5 text-xs rounded-full font-black ${showUserPaths
                                        ? 'bg-white/20 text-white'
                                        : 'bg-purple-200 text-purple-700'
                                        }`}>
                                        {userCurricula.length}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                    <p className="text-gray-500">Pre-built curriculum paths to guide your learning journey</p>
                </div>

                {/* User's Saved Paths Section */}
                {showUserPaths && user && (
                    <div className="mb-10 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900 flex items-center space-x-2">
                                <User size={20} className="text-purple-600" />
                                <span>Your Saved Learning Paths</span>
                            </h2>
                            <span className="text-sm text-gray-400">{userCurricula.length} saved</span>
                        </div>

                        {isLoadingUser ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="animate-spin text-purple-600" size={32} />
                            </div>
                        ) : userCurricula.length === 0 ? (
                            <div className="text-center py-12">
                                <Target size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-600 mb-2">No saved paths yet</h3>
                                <p className="text-gray-400 mb-4">Generate a custom learning path with AI</p>
                                <button
                                    onClick={() => navigate('/curriculum/generate')}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
                                >
                                    Generate Custom Path
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {userCurricula.map((curriculum) => (
                                    <div
                                        key={curriculum.id}
                                        className="group bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100 hover:shadow-lg transition-all cursor-pointer"
                                        onClick={() => navigate(`/ curriculum / ${curriculum.id} `)}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-2 bg-purple-100 rounded-xl">
                                                <GraduationCap size={20} className="text-purple-600" />
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCurriculum(curriculum.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                                            {curriculum.formData.learning_goal}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3 capitalize">
                                            {curriculum.formData.current_level} • {curriculum.formData.learning_style}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span className="flex items-center space-x-1">
                                                <Calendar size={12} />
                                                <span>{new Date(curriculum.createdAt).toLocaleDateString()}</span>
                                            </span>
                                            <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Category Tabs */}
                <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
                    {LEARNING_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.id as LearningCategory);
                                setSelectedDomain(null);
                            }}
                            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${selectedCategory === cat.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    {/* Domain Filter */}
                    <div className="flex items-center space-x-2 overflow-x-auto">
                        <button
                            onClick={() => setSelectedDomain(null)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${!selectedDomain
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            All
                        </button>
                        {domains.map((domain) => (
                            <button
                                key={domain.id}
                                onClick={() => setSelectedDomain(domain.id)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedDomain === domain.id
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {domain.label}
                            </button>
                        ))}
                    </div>

                    {/* Level Filter */}
                    <div className="flex items-center space-x-2">
                        {LEVELS.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setSelectedLevel(
                                    selectedLevel === level.id ? null : level.id as LearningLevel
                                )}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedLevel === level.id
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {level.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search paths..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Paths Grid */}
                {filteredPaths.length === 0 ? (
                    <div className="text-center py-16">
                        <Target size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No paths found</h3>
                        <p className="text-gray-400">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPaths.map((path) => (
                            <PathCard
                                key={path.id}
                                path={path}
                                onSelect={() => setSelectedPath(path)}
                            />
                        ))}
                    </div>
                )}

                {/* Generate Custom */}
                <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Sparkles size={24} />
                                <h3 className="text-2xl font-black">Need something custom?</h3>
                            </div>
                            <p className="text-white/80">Generate a personalized curriculum with AI based on your goals</p>
                        </div>
                        <button
                            onClick={() => navigate('/curriculum/generate')}
                            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                        >
                            Generate Custom Path
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
