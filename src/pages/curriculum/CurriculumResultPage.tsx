import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronDown, ChevronUp, BookOpen, Clock, Target,
    CheckCircle, PlayCircle, Award, Briefcase, ArrowLeft,
    Loader2, AlertCircle, GraduationCap, Code, Layers,
    ChevronRight, FileText, Lightbulb, ExternalLink, Play, Youtube
} from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { curriculumService, SavedCurriculum, Course, LearningTier } from '@/services/curriculum/curriculumService';
import { DEMO_CONTENTS, DemoContent } from '@/data/demoContents';

// Helper to find matching platform content by topic keywords
function findPlatformContent(topics: string[], title: string): DemoContent[] {
    const keywords = [...topics, ...title.toLowerCase().split(' ')].map(k => k.toLowerCase());
    return DEMO_CONTENTS.filter(content => {
        const searchText = `${content.title} ${content.description}`.toLowerCase();
        return keywords.some(keyword => keyword.length > 3 && searchText.includes(keyword));
    }).slice(0, 3); // Max 3 matches
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
}

const CourseCard: React.FC<CourseCardProps> = ({ course, tierColor }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-all"
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

                    <div className="mb-4">
                        <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Topics</h5>
                        <div className="flex flex-wrap gap-2">
                            {course.topics.map((topic, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Learning Outcomes</h5>
                        <ul className="space-y-2">
                            {course.learning_outcomes.map((outcome, i) => (
                                <li key={i} className="flex items-start space-x-2 text-gray-600">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                        <h5 className="font-bold text-blue-700 mb-1 flex items-center space-x-2">
                            <Code size={16} />
                            <span>Hands-on Project</span>
                        </h5>
                        <p className="text-blue-600 text-sm">{course.hands_on_project}</p>
                    </div>

                    {/* Learning Materials Section */}
                    <div className="mb-4">
                        <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center space-x-2">
                            <span className="text-base">📚</span>
                            <span>Learning Materials</span>
                        </h5>

                        {/* Platform Content */}
                        {(() => {
                            const platformContent = findPlatformContent(course.topics, course.title);
                            const externalResources = generateExternalResources(course);

                            return (
                                <div className="space-y-4">
                                    {platformContent.length > 0 && (
                                        <div className="space-y-3">
                                            {platformContent.map((content) => (
                                                <a
                                                    key={content.id}
                                                    href={`#/note/${content.id}`}
                                                    className="group relative block bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl border border-gray-100 p-5 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                                >
                                                    {/* Animated gradient border */}
                                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />

                                                    <div className="relative flex items-center justify-between">
                                                        <div className="flex-1">
                                                            {/* Badge */}
                                                            <div className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-green-200/50 mb-3">
                                                                <span>✓</span>
                                                                <span>On Platform</span>
                                                            </div>

                                                            {/* Title */}
                                                            <h6 className="font-black text-gray-900 text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                                                {content.title}
                                                            </h6>

                                                            {/* Description */}
                                                            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{content.description}</p>

                                                            {/* Stats */}
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

                                                        {/* Play button with glow */}
                                                        <div className="relative ml-5">
                                                            <div className="p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-300/50 group-hover:shadow-blue-400/70 group-hover:scale-110 transition-all duration-300">
                                                                <Play size={24} className="text-white" fill="white" />
                                                            </div>
                                                            {/* Glow effect */}
                                                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl" />
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* External Resources */}
                                    <div className="pt-3">
                                        <p className="text-xs font-bold text-gray-400 mb-3 flex items-center space-x-1">
                                            <span>🔗</span>
                                            <span>External Resources</span>
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {externalResources.map((resource, i) => (
                                                <a
                                                    key={i}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden relative"
                                                >
                                                    {/* Hover gradient */}
                                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${resource.platform === 'YouTube'
                                                            ? 'bg-gradient-to-br from-red-50 to-orange-50'
                                                            : 'bg-gradient-to-br from-green-50 to-emerald-50'
                                                        }`} />

                                                    <div className={`relative p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 ${resource.platform === 'YouTube'
                                                            ? 'bg-gradient-to-br from-red-500 to-orange-500'
                                                            : 'bg-gradient-to-br from-green-500 to-emerald-500'
                                                        }`}>
                                                        {resource.platform === 'YouTube' ? (
                                                            <Youtube size={18} className="text-white" />
                                                        ) : (
                                                            <Code size={18} className="text-white" />
                                                        )}
                                                    </div>
                                                    <div className="relative flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-700 truncate group-hover:text-gray-900">{resource.platform}</p>
                                                        <p className="text-xs text-gray-400 truncate">Search tutorials</p>
                                                    </div>
                                                    <ExternalLink size={16} className="relative text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                </a>
                                            ))}
                                        </div>
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
                                {course.quiz.map((q, i) => (
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
                        <p className="text-2xl font-black">{tier.estimated_hours}h</p>
                        <p className="text-white/70 text-xs">duration</p>
                    </div>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    {tier.courses.map((course) => (
                        <CourseCard key={course.position} course={course} tierColor={tierColor} />
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
                const data = await curriculumService.getById(id);
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
    }, [id, currentUser, navigate]);

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
                                <h1 className="text-3xl font-black">{formData.learning_goal}</h1>
                            </div>
                            <p className="text-white/80 max-w-2xl">{data.student_analysis.profile_summary}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black">{data.student_analysis.estimated_completion_weeks}</p>
                            <p className="text-white/70">weeks</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/20">
                        <div>
                            <p className="text-white/70 text-sm">Starting Level</p>
                            <p className="font-bold text-lg">{data.student_analysis.starting_tier}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Weekly Hours</p>
                            <p className="font-bold text-lg">{data.student_analysis.weekly_hours_needed}h</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Learning Style</p>
                            <p className="font-bold text-lg capitalize">{formData.learning_style}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Total Videos</p>
                            <p className="font-bold text-lg">
                                {data.learning_path.beginner.total_videos +
                                    data.learning_path.intermediate.total_videos +
                                    data.learning_path.advanced.total_videos}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Personalization */}
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
                        {data.personalization.emphasized_areas.length > 0 && (
                            <div className="col-span-2">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Emphasized Topics</p>
                                <div className="flex flex-wrap gap-2">
                                    {data.personalization.emphasized_areas.map((area, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Learning Path Tiers */}
                <h2 className="text-2xl font-black text-gray-900 mb-6">Learning Path</h2>

                <TierSection
                    tier={data.learning_path.beginner}
                    tierName="Beginner"
                    tierColor="bg-gradient-to-r from-green-500 to-emerald-600"
                    tierIcon={<BookOpen size={28} />}
                />

                <TierSection
                    tier={data.learning_path.intermediate}
                    tierName="Intermediate"
                    tierColor="bg-gradient-to-r from-blue-500 to-cyan-600"
                    tierIcon={<Layers size={28} />}
                />

                <TierSection
                    tier={data.learning_path.advanced}
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
                            {data.progress_milestones.map((milestone, i) => (
                                <div key={i} className="relative flex items-start space-x-6 pl-10">
                                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${milestone.tier === 'beginner' ? 'bg-green-500' :
                                        milestone.tier === 'intermediate' ? 'bg-blue-500' : 'bg-purple-500'
                                        }`}>
                                        {milestone.percentage}%
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{milestone.milestone_name}</h4>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {milestone.videos_completed} videos completed • {milestone.skills_unlocked.join(', ')}
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
                            {data.final_project.deliverables.map((d, i) => (
                                <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">{d}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Career Outcomes */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <Briefcase className="text-indigo-500" size={20} />
                        <span>Career Outcomes</span>
                    </h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Job Titles</p>
                            <ul className="space-y-2">
                                {data.career_outcomes.job_titles.map((title, i) => (
                                    <li key={i} className="flex items-center space-x-2 text-gray-700">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>{title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Portfolio Pieces</p>
                            <ul className="space-y-2">
                                {data.career_outcomes.portfolio_pieces.map((piece, i) => (
                                    <li key={i} className="flex items-center space-x-2 text-gray-700">
                                        <CheckCircle size={14} className="text-blue-500" />
                                        <span>{piece}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Next Steps</p>
                            <ul className="space-y-2">
                                {data.career_outcomes.next_learning_paths.map((path, i) => (
                                    <li key={i} className="flex items-center space-x-2 text-gray-700">
                                        <ChevronRight size={14} className="text-purple-500" />
                                        <span>{path}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

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
