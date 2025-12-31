
import React, { useState } from 'react';
import { PlusCircle, X, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { Quiz, QuizQuestion, User, Difficulty } from '@/types';
import { quizPublishingService } from '@/services/quiz/quizPublishingService';
import { ChatbotVerificationModal } from '@/components/modals/ChatbotVerificationModal';

interface QuizAttachmentProps {
    user: User;
    subject: string;
    topic: string;
    subtopic?: string;
    onQuizAttached?: (quiz: Quiz) => void;
    onSkip?: () => void;
    compact?: boolean;
}

export const QuizAttachment: React.FC<QuizAttachmentProps> = ({
    user,
    subject,
    topic,
    subtopic,
    onQuizAttached,
    onSkip,
    compact = false
}) => {
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

    // Quiz form state
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Intermediate);
    const [questions, setQuestions] = useState<QuizQuestion[]>([
        {
            id: 'q1',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: ''
        }
    ]);

    const publishingInfo = quizPublishingService.getPublishingInfo(user);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: `q${questions.length + 1}`,
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                explanation: ''
            }
        ]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const handleCreateQuiz = () => {
        const quiz: Quiz = {
            id: `quiz_${Date.now()}`,
            title: quizTitle,
            description: quizDescription,
            subject,
            topic,
            difficulty,
            questions: questions.filter(q => q.question.trim() !== ''),
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            metadata: {
                role: user.role,
                trustLevel: user.communityMetrics?.trustLevel || user.verificationLevel,
                quizVerification: publishingInfo.requiresVerification ? 'chatbot' : 'none',
                authorType: publishingInfo.authorType,
                published: false
            },
            status: 'draft'
        };

        setCurrentQuiz(quiz);

        // Check if verification needed
        if (publishingInfo.requiresVerification) {
            setShowVerificationModal(true);
        } else {
            handleAttachQuiz(quiz);
        }
    };

    const handleAttachQuiz = (quiz: Quiz) => {
        if (onQuizAttached) {
            onQuizAttached(quiz);
        }
        setShowQuizForm(false);
        setShowVerificationModal(false);
    };

    const handleVerified = (result: any) => {
        if (currentQuiz) {
            const updatedQuiz = {
                ...currentQuiz,
                metadata: {
                    ...currentQuiz.metadata,
                    published: true,
                    verifiedAt: new Date().toISOString(),
                    overallScore: result.score
                },
                status: 'published' as const
            };
            handleAttachQuiz(updatedQuiz);
        }
    };

    if (!showQuizForm) {
        return (
            <div className={`${compact ? 'p-4' : 'p-6'} bg-purple-50 border-2 border-purple-200 rounded-2xl`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                            <BookOpen className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <h3 className={`font-black text-purple-900 ${compact ? 'text-sm' : 'text-base'}`}>
                                Add a Quiz (Optional)
                            </h3>
                            <p className={`text-purple-700 ${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                                Help learners test their knowledge
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowQuizForm(true)}
                            className={`${compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'} bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700 transition-all`}
                        >
                            Create Quiz
                        </button>
                        {onSkip && (
                            <button
                                onClick={onSkip}
                                className={`${compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'} bg-white text-purple-600 rounded-xl font-black hover:bg-purple-50 transition-all border-2 border-purple-200`}
                            >
                                Skip
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">Create Quiz</h3>
                <button
                    onClick={() => setShowQuizForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Quiz Details */}
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                        Quiz Title
                    </label>
                    <input
                        type="text"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="e.g., Operating Systems Fundamentals"
                        className="w-full px-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium placeholder:text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                        Description
                    </label>
                    <textarea
                        value={quizDescription}
                        onChange={(e) => setQuizDescription(e.target.value)}
                        placeholder="Brief description of what this quiz covers"
                        rows={2}
                        className="w-full px-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium placeholder:text-gray-500 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                        Difficulty Level
                    </label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="w-full px-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium"
                    >
                        <option value={Difficulty.Beginner}>Beginner</option>
                        <option value={Difficulty.Intermediate}>Intermediate</option>
                        <option value={Difficulty.Advanced}>Advanced</option>
                    </select>
                </div>

                {/* Questions */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">
                            Questions ({questions.length})
                        </label>
                        <button
                            onClick={addQuestion}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition-all text-sm"
                        >
                            <PlusCircle size={16} />
                            <span>Add Question</span>
                        </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {questions.map((q, qIndex) => (
                            <div key={q.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-black text-gray-700">Question {qIndex + 1}</span>
                                    {questions.length > 1 && (
                                        <button
                                            onClick={() => removeQuestion(qIndex)}
                                            className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <X size={16} className="text-red-500" />
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={q.question}
                                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                    placeholder="Enter your question"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium text-sm mb-3"
                                />

                                <div className="space-y-2 mb-3">
                                    {q.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                checked={q.correctAnswer === oIndex}
                                                onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                                className="w-4 h-4 text-purple-600"
                                            />
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                placeholder={`Option ${oIndex + 1}`}
                                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <input
                                    type="text"
                                    value={q.explanation || ''}
                                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                    placeholder="Explanation (optional but recommended)"
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleCreateQuiz}
                        disabled={!quizTitle.trim() || questions.filter(q => q.question.trim()).length === 0}
                        className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        <CheckCircle size={20} />
                        <span>{publishingInfo.requiresVerification ? 'Submit for Verification' : 'Attach Quiz'}</span>
                    </button>
                    <button
                        onClick={() => setShowQuizForm(false)}
                        className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Verification Modal */}
            {showVerificationModal && currentQuiz && (
                <ChatbotVerificationModal
                    quiz={currentQuiz}
                    onClose={() => setShowVerificationModal(false)}
                    onVerified={handleVerified}
                    onEdit={() => setShowVerificationModal(false)}
                />
            )}
        </div>
    );
};
