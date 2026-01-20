import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronDown, ChevronUp, BookOpen, Clock, Target, Calendar,
    CheckCircle2, PlayCircle, Award, Briefcase, ArrowLeft,
    Loader2, AlertCircle, GraduationCap, Code, Layers,
    ChevronRight, FileText, Lightbulb, ExternalLink, Play, Youtube,
    Library, Scale, Crosshair, Link
} from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { curriculumService, SavedCurriculum, Course, LearningTier } from '@/services/curriculum/curriculumService';
import { DEMO_CONTENTS, DemoContent } from '@/data/demoContents';



// Helper to find matching platform content - USES BACKEND VALIDATION FIRST
function findPlatformContent(topics: string[], title: string, level?: string, matchingCriteria?: any): DemoContent[] {
    // PRIORITY 1: If backend already matched content, use that directly!
    if (matchingCriteria?.matched_content_id) {
        const matchedContent = DEMO_CONTENTS.find(c => c.id === matchingCriteria.matched_content_id);
        if (matchedContent) {
            return [matchedContent];
        }
    }

    // PRIORITY 2: If backend marked as "available" with content_url, try to extract ID
    if (matchingCriteria?.validation_status === 'available' && matchingCriteria?.content_url) {
        const urlMatch = matchingCriteria.content_url.match(/\/notes?\/([^/]+)$/);
        if (urlMatch) {
            const contentId = urlMatch[1];
            const matchedContent = DEMO_CONTENTS.find(c => c.id === contentId);
            if (matchedContent) {
                return [matchedContent];
            }
        }
    }

    // PRIORITY 3: If backend marked as "alternative", return empty (let UI show external resources)
    if (matchingCriteria?.validation_status === 'alternative' ||
        matchingCriteria?.validation_status === 'external_platform_fallback') {
        return [];
    }

    // FALLBACK: Strict title-based matching (old curricula without new validation)
    // Only match if title is VERY similar (not just keyword overlap)
    const courseTitleLower = title.toLowerCase().trim();

    const exactMatches = DEMO_CONTENTS.filter(content => {
        const contentTitleLower = content.title.toLowerCase().trim();

        // Exact match
        if (contentTitleLower === courseTitleLower) return true;

        // One contains the other (but must be significant portion)
        const shorter = contentTitleLower.length < courseTitleLower.length ? contentTitleLower : courseTitleLower;
        const longer = contentTitleLower.length >= courseTitleLower.length ? contentTitleLower : courseTitleLower;

        // Must be at least 60% of the longer title
        if (longer.includes(shorter) && shorter.length / longer.length > 0.6) {
            return true;
        }

        return false;
    });

    // If we found strict matches, return them
    if (exactMatches.length > 0) {
        // Filter by level if available
        const levelFiltered = level
            ? exactMatches.filter(c => c.level?.toLowerCase() === level.toLowerCase())
            : exactMatches;
        return levelFiltered.length > 0 ? levelFiltered.slice(0, 1) : exactMatches.slice(0, 1);
    }

    // No match found - return empty, let UI show external resources
    return [];
}

// Generate external resource suggestions based on course topic
function generateExternalResources(course: Course): { title: string; url: string; platform: string }[] {
    const topic = encodeURIComponent(course.title);
    return [
        {
            title: `${course.title} - Complete Tutorial`,
            url: `https://www.youtube.com/results?search_query=${topic}+tutorial`,
            platform: 'YouTube'
        },
        {
            title: `${course.title} - freeCodeCamp`,
            url: `https://www.freecodecamp.org/news/search/?query=${topic}`,
            platform: 'freeCodeCamp'
        }
    ];
}

interface CourseCardProps {
    course: Course;
    tierColor: string;
    level: string; // Added level prop
}

const CourseCard: React.FC<CourseCardProps> = ({ course, tierColor, level }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-offset-2 ring-blue-500/20' : 'hover:shadow-md'}`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors"
            >
                <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl ${tierColor} flex items-center justify-center text-white font-bold`}>
                        {course.position}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">{course.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center space-x-1">
                                <PlayCircle size={14} />
                                <span>{course.video_count} videos</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{course.duration_hours}h</span>
                            </span>
                        </div>
                    </div>
                </div>
                {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>

            {isExpanded && (
                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-gray-600 mb-4">{course.description}</p>

                    {/* Exam & Relevance Badges */}
                    {(course.weightage || course.exam_relevance) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {course.weightage && (
                                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200 shadow-sm flex items-center gap-1">
                                    <Scale size={12} /> {course.weightage} Weightage
                                </span>
                            )}
                            {course.exam_relevance && (
                                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-200 shadow-sm flex items-center gap-1">
                                    <Crosshair size={12} /> {course.exam_relevance}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="mb-4">
                        <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Topics</h5>
                        <div className="flex flex-wrap gap-2">
                            {(course.topics || []).map((topic, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Learning Outcomes</h5>
                        <ul className="space-y-2">
                            {(course.learning_outcomes || []).map((outcome, i) => (
                                <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span>{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hands-on Project */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <h5 className="text-blue-700 font-bold text-sm mb-1 flex items-center space-x-2">
                            <Code size={16} />
                            <span>Hands-on Project</span>
                        </h5>
                        <p className="text-blue-600 text-sm">{course.hands_on_project}</p>
                    </div>

                    {/* Learning Materials */}
                    <div>
                        <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center space-x-1">
                            <Library size={14} />
                            <span>Learning Materials</span>
                        </h5>

                        {/* Check validation_status from matching_criteria */}
                        {(() => {
                            const validationStatus = course.matching_criteria?.validation_status;
                            const isAlternative = validationStatus === 'alternative' || validationStatus === 'external_platform_fallback';

                            // For AVAILABLE content - show platform content
                            if (!isAlternative) {
                                const platformContent = findPlatformContent(course.topics || [], course.title, level, course.matching_criteria);

                                if (platformContent.length > 0) {
                                    return (
                                        <div className="space-y-3">
                                            {platformContent.map((content) => (
                                                <a
                                                    key={content.id}
                                                    href={`#/note/${content.id}`}
                                                    className="group relative block bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl border border-gray-100 p-5 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                                >
                                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
                                                    <div className="relative flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-green-200/50 mb-3">
                                                                <CheckCircle2 size={12} />
                                                                <span>Available on Platform</span>
                                                            </div>
                                                            <h6 className="font-black text-gray-900 text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                                                {content.title}
                                                            </h6>
                                                            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{content.description}</p>
                                                            <div className="flex items-center space-x-4 mt-3">
                                                                <div className="flex items-center space-x-1.5 text-sm text-gray-500">
                                                                    <div className="p-1 bg-blue-100 rounded-lg">
                                                                        <PlayCircle size={12} className="text-blue-600" />
                                                                    </div>
                                                                    <span className="font-semibold">{content.views} views</span>
                                                                </div>
                                                                <span className="text-sm text-gray-400">by <span className="font-medium text-gray-600">{content.uploadedBy}</span></span>
                                                            </div>
                                                        </div>
                                                        <div className="relative ml-5">
                                                            <div className="p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-300/50 group-hover:shadow-blue-400/70 group-hover:scale-110 transition-all duration-300">
                                                                <Play size={24} className="text-white" fill="white" />
                                                            </div>
                                                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl" />
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    );
                                }
                            }

                            // For ALTERNATIVE content - show external resources with clear badge
                            const externalLinks = course.matching_criteria?.external_links || [];
                            const defaultExternalResources = generateExternalResources(course);

                            return (
                                <div className="space-y-4">
                                    {/* Alternative Path Badge */}
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="p-2 bg-amber-100 rounded-xl">
                                                <AlertCircle size={20} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <h6 className="font-bold text-amber-800 text-sm">Alternative Learning Path</h6>
                                                <p className="text-amber-600 text-xs mt-1">
                                                    This topic isn't available on our platform yet. Here are recommended external resources:
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* External Resources Grid */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {(externalLinks.length > 0 ? externalLinks : defaultExternalResources).map((resource: any, i: number) => (
                                            <a
                                                key={i}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden relative"
                                            >
                                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${resource.platform === 'YouTube' ? 'bg-gradient-to-br from-red-50 to-orange-50' :
                                                    resource.platform === 'Coursera' ? 'bg-gradient-to-br from-blue-50 to-indigo-50' :
                                                        'bg-gradient-to-br from-green-50 to-emerald-50'
                                                    }`} />
                                                <div className={`relative p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 ${resource.platform === 'YouTube' ? 'bg-gradient-to-br from-red-500 to-orange-500' :
                                                    resource.platform === 'Coursera' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                                                        'bg-gradient-to-br from-green-500 to-emerald-500'
                                                    }`}>
                                                    {resource.platform === 'YouTube' ? (
                                                        <Youtube size={20} className="text-white" />
                                                    ) : resource.platform === 'Coursera' ? (
                                                        <GraduationCap size={20} className="text-white" />
                                                    ) : (
                                                        <Code size={20} className="text-white" />
                                                    )}
                                                </div>
                                                <p className="relative text-sm font-bold text-gray-700 mt-2 group-hover:text-gray-900">{resource.platform}</p>
                                                <ExternalLink size={12} className="relative text-gray-300 mt-1 group-hover:text-blue-500 transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Quiz Section */}
                    <div className="border-t border-gray-100 pt-4">
                        <button
                            onClick={() => setShowQuiz(!showQuiz)}
                            className="flex items-center space-x-2 text-purple-600 font-bold hover:text-purple-700 transition-all"
                        >
                            <FileText size={16} />
                            <span>{showQuiz ? 'Hide Quiz' : 'View Quiz Questions'}</span>
                        </button>

                        {showQuiz && (
                            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                                {(course.quiz || []).map((q, i) => (
                                    <QuizQuestion key={i} question={q} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

interface QuizQuestionProps {
    question: { question: string; options: string[]; correct_answer: string; explanation: string };
    index: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, index }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleAnswer = (option: string) => {
        setSelectedAnswer(option);
        setShowExplanation(true);
    };

    return (
        <div className="p-4 bg-gray-50 rounded-xl">
            <p className="font-bold text-gray-900 mb-3">Q{index + 1}. {question.question}</p>
            <div className="space-y-2">
                {question.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(option)}
                        disabled={showExplanation}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${showExplanation
                            ? option === question.correct_answer
                                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                : selectedAnswer === option
                                    ? 'bg-red-100 text-red-700 border-2 border-red-500'
                                    : 'bg-white text-gray-500'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {showExplanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg animate-in fade-in">
                    <p className="text-blue-700 text-sm">
                        <strong>Explanation:</strong> {question.explanation}
                    </p>
                </div>
            )}
        </div>
    );
};

interface TierSectionProps {
    tier: LearningTier;
    tierName: string;
    tierColor: string;
    tierIcon: React.ReactNode;
}

const TierSection: React.FC<TierSectionProps> = ({ tier, tierName, tierColor, tierIcon }) => {
    const [isExpanded, setIsExpanded] = useState(tierName === 'Beginner');
    if (!tier) return null;

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full p-6 ${tierColor} rounded-2xl flex items-center justify-between text-white shadow-lg hover:opacity-95 transition-all`}
            >
                <div className="flex items-center space-x-4">
                    {tierIcon}
                    <div className="text-left">
                        <h3 className="text-xl font-black">{tierName}</h3>
                        <p className="text-white/80 text-sm">{tier.tier_description}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="text-right">
                        <p className="text-2xl font-black">{tier.total_videos}</p>
                        <p className="text-white/70 text-xs">videos</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black">{tier.total_estimated_hours || (tier as any).estimated_hours}h</p>
                        <p className="text-white/70 text-xs">duration</p>
                    </div>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    {(tier.courses || []).map((course) => (
                        <CourseCard key={course.position} course={course} tierColor={tierColor} level={tierName} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const CurriculumResultPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [curriculum, setCurriculum] = useState<SavedCurriculum | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const currentUser = authService.getUser();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchCurriculum = async () => {
            if (!id) {
                setError('No curriculum ID provided');
                setIsLoading(false);
                return;
            }

            try {
                const data = await curriculumService.getById(currentUser.id, id);
                if (!data) {
                    setError('Curriculum not found');
                } else {
                    setCurriculum(data);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load curriculum');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurriculum();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, currentUser?.id, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                    <p className="text-gray-500 font-medium">Loading your curriculum...</p>
                </div>
            </div>
        );
    }

    if (error || !curriculum) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md text-center">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
                    <p className="text-gray-500 mb-6">{error || 'Curriculum not found'}</p>
                    <button
                        onClick={() => navigate('/curriculum/generate')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                        Create New Curriculum
                    </button>
                </div>
            </div>
        );
    }

    const { curriculum: data, formData } = curriculum;

    console.log('Rendering CurriculumResultPage', { curriculum });

    // Defensive check: Ensure inner data structure exists
    if (!data) {
        console.error('Curriculum data structure is missing or malformed', curriculum);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md text-center">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Error</h2>
                    <p className="text-gray-500 mb-6">This learning path data seems to be corrupted or in an old format.</p>
                    <button
                        onClick={() => navigate('/curriculum/generate')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                        Create New Curriculum
                    </button>
                </div>
            </div>
        );
    }

    // Data Normalization (Handle Legacy vs New Schema)
    const profile = {
        summary: (data.student_analysis && data.student_analysis.profile_summary) || (data.student_profile && data.student_profile.summary) || 'Standard Learning Path',
        starting_tier: (data.student_analysis && data.student_analysis.starting_tier) || (data.student_profile && data.student_profile.recommended_start_tier) || 'Beginner',
        weekly_hours: (data.student_analysis && data.student_analysis.weekly_hours_needed) || (data.student_profile && data.student_profile.weekly_hours) || 0,
        weeks: (data.student_analysis && data.student_analysis.estimated_completion_weeks) || (data.student_profile && data.student_profile.estimated_weeks) || 4
    };
    const tiers = data.learning_path || data.curriculum || {} as any;

    // Use formData with generic fallback to prevent crashes
    const safeFormData = formData || { learning_goal: 'Learning Path', current_level: 'Beginner' };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 font-medium mb-8 transition-all"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <GraduationCap size={32} />
                                <h1 className="text-3xl font-black">{safeFormData.learning_goal || 'Generic Learning Path'}</h1>
                            </div>
                            <p className="text-white/80 max-w-2xl">{profile.summary}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black">{profile.weeks}</p>
                            <p className="text-white/70">weeks</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/20">
                        <div>
                            <p className="text-white/70 text-sm">Starting Level</p>
                            <p className="font-bold text-lg">{profile.starting_tier}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Weekly Hours</p>
                            <p className="font-bold text-lg">{profile.weekly_hours}h</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Duration</p>
                            <p className="font-bold text-lg">{profile.weeks} weeks</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Total Hours</p>
                            <p className="font-bold text-lg">
                                {(tiers.beginner?.total_estimated_hours || 0) +
                                    (tiers.intermediate?.total_estimated_hours || 0) +
                                    (tiers.advanced?.total_estimated_hours || 0)}h
                            </p>
                        </div>
                    </div>
                </div>

                {/* Personalization (Legacy Only) */}
                {data.personalization && (
                    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <Lightbulb className="text-yellow-500" size={20} />
                            <span>Personalized for You</span>
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Recommended Pace</p>
                                <p className="text-gray-700 font-medium">{data.personalization.recommended_pace}</p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Style Adaptations</p>
                                <p className="text-gray-700 font-medium">{data.personalization.learning_style_adaptations}</p>
                            </div>
                            {(data.personalization.emphasized_areas || []).length > 0 && (
                                <div className="col-span-2">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Emphasized Topics</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(data.personalization.emphasized_areas || []).map((area, i) => (
                                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Exam Strategy (If Applicable) */}
                {data.exam_strategy?.if_exam_prep && (
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 mb-8 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center space-x-2">
                                <Target className="text-yellow-400" size={24} />
                                <span>Exam Strategy & Timeline</span>
                            </h2>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                                {data.exam_strategy.if_exam_prep.study_schedule.weeks_until_exam} Weeks to Exam
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {['phase_1', 'phase_2', 'phase_3', 'phase_4'].map((phase, i) => {
                                const phaseData = data.exam_strategy?.if_exam_prep?.study_schedule[phase];
                                if (!phaseData) return null;
                                return (
                                    <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center space-x-2 mb-2 text-indigo-300">
                                            <Calendar size={16} />
                                            <span className="text-xs uppercase tracking-wider font-bold">Phase {i + 1}</span>
                                        </div>
                                        <p className="font-medium text-sm">{phaseData}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {data.exam_strategy.if_exam_prep.topic_prioritization && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h3 className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-3">High Priority Topics</h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.exam_strategy.if_exam_prep.topic_prioritization.map((topic, i) => (
                                        <div key={i} className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1.5 rounded-lg border border-yellow-500/30">
                                            <span className="text-yellow-200 font-bold text-sm">{topic.topic}</span>
                                            <span className="text-yellow-100/60 text-xs">({topic.recommended_hours}h)</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Learning Path Tiers */}
                <h2 className="text-2xl font-black text-gray-900 mb-6">Learning Path</h2>

                <TierSection
                    tier={tiers.beginner}
                    tierName="Beginner"
                    tierColor="bg-gradient-to-r from-green-500 to-emerald-600"
                    tierIcon={<BookOpen size={28} />}
                />

                <TierSection
                    tier={tiers.intermediate}
                    tierName="Intermediate"
                    tierColor="bg-gradient-to-r from-blue-500 to-cyan-600"
                    tierIcon={<Layers size={28} />}
                />

                <TierSection
                    tier={tiers.advanced}
                    tierName="Advanced"
                    tierColor="bg-gradient-to-r from-purple-500 to-pink-600"
                    tierIcon={<Award size={28} />}
                />

                {/* Milestones */}
                <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <Target className="text-green-500" size={20} />
                        <span>Progress Milestones</span>
                    </h2>
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                        <div className="space-y-6">
                            {(data.progress_milestones || []).map((milestone, i) => (
                                <div key={i} className="relative flex items-start space-x-6 pl-10">
                                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${milestone.tier === 'beginner' ? 'bg-green-500' :
                                        milestone.tier === 'intermediate' ? 'bg-blue-500' : 'bg-purple-500'
                                        }`}>
                                        {milestone.percentage}%
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{milestone.milestone_name}</h4>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {milestone.videos_completed} videos completed • {(milestone.skills_unlocked || []).join(', ')}
                                        </p>
                                        <p className="text-blue-600 text-sm mt-2 font-medium flex items-center space-x-1">
                                            <ChevronRight size={14} />
                                            <span>{milestone.next_step}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final Project */}
                {data.final_project && (
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
                        <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
                            <Code size={20} />
                            <span>Capstone Project: {data.final_project.title}</span>
                        </h2>
                        <p className="text-white/90 mb-4">{data.final_project.description}</p>
                        <div className="flex items-center space-x-6 text-sm">
                            <span className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{data.final_project.estimated_hours}h estimated</span>
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Deliverables</p>
                            <div className="flex flex-wrap gap-2">
                                {(data.final_project.deliverables || []).map((d, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">{d}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Career Outcomes */}
                {data.career_outcomes && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                            <Briefcase className="text-indigo-500" size={20} />
                            <span>Career Outcomes</span>
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Job Titles</p>
                                <ul className="space-y-2">
                                    {(data.career_outcomes.job_titles || []).map((title, i) => (
                                        <li key={i} className="flex items-center space-x-2 text-gray-700">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            <span>{title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Portfolio Pieces</p>
                                <ul className="space-y-2">
                                    {(data.career_outcomes.portfolio_pieces || []).map((piece, i) => (
                                        <li key={i} className="flex items-center space-x-2 text-gray-700">
                                            <CheckCircle2 size={14} className="text-blue-500" />
                                            <span>{piece}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Next Steps</p>
                                <ul className="space-y-2">
                                    {(data.career_outcomes.next_learning_paths || []).map((path, i) => (
                                        <li key={i} className="flex items-center space-x-2 text-gray-700">
                                            <ChevronRight size={14} className="text-purple-500" />
                                            <span>{path}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Generate Another */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/curriculum/generate')}
                        className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        Generate Another Curriculum
                    </button>
                </div>
            </div>
        </div>
    );
};
