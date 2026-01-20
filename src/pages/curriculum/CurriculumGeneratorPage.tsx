import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Target, Clock, Brain, Sparkles,
    ChevronRight, Loader2, AlertCircle, Plus, X,
    GraduationCap, Code, Layers, Lightbulb
} from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { curriculumService, defaultFormData, CurriculumFormData } from '@/services/curriculum/curriculumService';

const FOCUS_AREA_SUGGESTIONS: Record<string, string[]> = {
    'Web Development': ['React', 'Vue.js', 'Node.js', 'TypeScript', 'CSS', 'APIs', 'Databases', 'Authentication'],
    'Data Science': ['Python', 'Machine Learning', 'SQL', 'Visualization', 'Statistics', 'Pandas', 'TensorFlow'],
    'Mobile Development': ['React Native', 'Flutter', 'iOS', 'Android', 'UI/UX', 'APIs', 'State Management'],
    'AI/ML': ['Deep Learning', 'NLP', 'Computer Vision', 'PyTorch', 'TensorFlow', 'LLMs', 'MLOps'],
    'App Development': ['Frontend', 'Backend', 'Full Stack', 'Testing', 'CI/CD', 'Architecture'],
    'Default': ['Fundamentals', 'Best Practices', 'Projects', 'Advanced Topics']
};

const TIME_COMMITMENTS = [
    { value: 'Less than 5 hours/week', label: '< 5 hours/week', icon: '🕐' },
    { value: '5-10 hours/week', label: '5-10 hours/week', icon: '⏰' },
    { value: '10-20 hours/week', label: '10-20 hours/week', icon: '📚' },
    { value: 'More than 20 hours/week', label: '20+ hours/week', icon: '🚀' }
];

const LEARNING_STYLES = [
    { value: 'video-heavy', label: 'Video Tutorials', icon: '🎥', description: 'Learn by watching explanations' },
    { value: 'hands-on', label: 'Hands-On Projects', icon: '💻', description: 'Learn by building things' },
    { value: 'reading', label: 'Reading & Docs', icon: '📖', description: 'Learn from documentation' },
    { value: 'mixed', label: 'Mixed Approach', icon: '🎯', description: 'Balanced learning style' }
];

export const CurriculumGeneratorPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CurriculumFormData>(defaultFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [newFocusArea, setNewFocusArea] = useState('');
    const currentUser = authService.getUser();

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const getSuggestions = (): string[] => {
        const goal = formData.learning_goal.toLowerCase();
        for (const [key, values] of Object.entries(FOCUS_AREA_SUGGESTIONS)) {
            if (goal.includes(key.toLowerCase())) {
                return values;
            }
        }
        return FOCUS_AREA_SUGGESTIONS.Default;
    };

    const addFocusArea = (area: string) => {
        if (area && !formData.focus_areas.includes(area)) {
            setFormData(prev => ({
                ...prev,
                focus_areas: [...prev.focus_areas, area]
            }));
        }
        setNewFocusArea('');
    };

    const removeFocusArea = (area: string) => {
        setFormData(prev => ({
            ...prev,
            focus_areas: prev.focus_areas.filter(a => a !== area)
        }));
    };

    const handleSubmit = async () => {
        if (!formData.learning_goal.trim()) {
            setError('Please specify what you want to learn');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const result = await curriculumService.generate(currentUser?.id || '', formData);

            if (!result.success) {
                setError(result.message);
                setIsLoading(false);
                return;
            }

            // Navigate to result page with curriculum ID
            navigate(`/curriculum/${result.curriculum?.id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to generate curriculum');
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && !formData.learning_goal.trim()) {
            setError('Please specify your learning goal');
            return;
        }
        setError('');
        setStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    if (!currentUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-1/3 h-1/3 bg-purple-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/3 h-1/3 bg-blue-100/50 rounded-full blur-[120px]" />

            <div className="max-w-3xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl text-white mb-6 shadow-xl">
                        <GraduationCap size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-3">Create Your Learning Path</h1>
                    <p className="text-gray-500 font-medium">AI-powered personalized curriculum just for you</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-10">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3, 4].map((s) => (
                            <React.Fragment key={s}>
                                <button
                                    onClick={() => s < step && setStep(s)}
                                    className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all ${step === s
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : step > s
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {step > s ? '✓' : s}
                                </button>
                                {s < 4 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-green-300' : 'bg-gray-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-10">
                        {/* Step 1: Learning Goal */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center space-x-3 text-purple-600 mb-6">
                                    <Target size={24} />
                                    <h2 className="text-xl font-bold">What do you want to learn?</h2>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Learning Goal
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium placeholder:text-gray-500"
                                        placeholder="e.g., Web Development, Data Science, Machine Learning"
                                        value={formData.learning_goal}
                                        onChange={(e) => setFormData(prev => ({ ...prev, learning_goal: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Current Level
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setFormData(prev => ({ ...prev, current_level: level }))}
                                                className={`py-4 px-6 rounded-xl font-bold transition-all ${formData.current_level === level
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Focus Areas */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center space-x-3 text-blue-600 mb-6">
                                    <Layers size={24} />
                                    <h2 className="text-xl font-bold">Focus Areas</h2>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.focus_areas.map((area) => (
                                        <span
                                            key={area}
                                            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                                        >
                                            {area}
                                            <button onClick={() => removeFocusArea(area)} className="ml-2 hover:text-blue-900">
                                                <X size={16} />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        className="flex-1 px-6 py-4 bg-gray-100 border-none rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium placeholder:text-gray-400"
                                        placeholder="Add a focus area..."
                                        value={newFocusArea}
                                        onChange={(e) => setNewFocusArea(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusArea(newFocusArea))}
                                    />
                                    <button
                                        onClick={() => addFocusArea(newFocusArea)}
                                        className="px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Suggestions
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {getSuggestions().filter(s => !formData.focus_areas.includes(s)).map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => addFocusArea(suggestion)}
                                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200 transition-all"
                                            >
                                                + {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Background & Goals */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center space-x-3 text-green-600 mb-6">
                                    <Brain size={24} />
                                    <h2 className="text-xl font-bold">Your Background</h2>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Prior Knowledge
                                    </label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-gray-100 border-none rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition-all font-medium placeholder:text-gray-400 resize-none"
                                        rows={3}
                                        placeholder="What do you already know? e.g., Basic HTML/CSS, some Python..."
                                        value={formData.prior_knowledge}
                                        onChange={(e) => setFormData(prev => ({ ...prev, prior_knowledge: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Learning Objectives
                                    </label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-gray-100 border-none rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition-all font-medium placeholder:text-gray-400 resize-none"
                                        rows={3}
                                        placeholder="What do you want to achieve? e.g., Build a portfolio site, get a job..."
                                        value={formData.learning_objectives}
                                        onChange={(e) => setFormData(prev => ({ ...prev, learning_objectives: e.target.value }))}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Preferences */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center space-x-3 text-orange-600 mb-6">
                                    <Clock size={24} />
                                    <h2 className="text-xl font-bold">Learning Preferences</h2>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Time Commitment
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {TIME_COMMITMENTS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setFormData(prev => ({ ...prev, time_commitment: option.value }))}
                                                className={`py-4 px-6 rounded-xl font-bold transition-all flex items-center space-x-3 ${formData.time_commitment === option.value
                                                    ? 'bg-orange-500 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <span className="text-xl">{option.icon}</span>
                                                <span>{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                                        Learning Style
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {LEARNING_STYLES.map((style) => (
                                            <button
                                                key={style.value}
                                                onClick={() => setFormData(prev => ({ ...prev, learning_style: style.value as any }))}
                                                className={`py-4 px-6 rounded-xl font-bold transition-all text-left ${formData.learning_style === style.value
                                                    ? 'bg-orange-500 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <span className="text-xl">{style.icon}</span>
                                                    <span>{style.label}</span>
                                                </div>
                                                <p className={`text-xs ${formData.learning_style === style.value ? 'text-orange-100' : 'text-gray-400'}`}>
                                                    {style.description}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-in fade-in">
                                <AlertCircle className="text-red-500" size={20} />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-10">
                            <button
                                onClick={step === 1 ? () => navigate(-1) : prevStep}
                                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </button>

                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-2"
                                >
                                    <span>Continue</span>
                                    <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center space-x-3 shadow-xl disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={20} />
                                            <span>Generate Curriculum</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Preview */}
                {step === 4 && (
                    <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center space-x-2">
                            <Lightbulb size={18} className="text-yellow-500" />
                            <span>Curriculum Summary</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-400">Goal:</span> <span className="font-medium">{formData.learning_goal || 'Not specified'}</span></div>
                            <div><span className="text-gray-400">Level:</span> <span className="font-medium">{formData.current_level}</span></div>
                            <div><span className="text-gray-400">Focus:</span> <span className="font-medium">{formData.focus_areas.join(', ') || 'None selected'}</span></div>
                            <div><span className="text-gray-400">Time:</span> <span className="font-medium">{formData.time_commitment}</span></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
