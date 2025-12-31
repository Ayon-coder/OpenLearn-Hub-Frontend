
import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Quiz, QuizQuestion, Difficulty } from '@/types';

interface QuizEditorProps {
    noteTitle: string;
    subject: string;
    topic: string;
    onSave: (quiz: Quiz) => void;
    onCancel: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({
    noteTitle,
    subject,
    topic,
    onSave,
    onCancel
}) => {
    const [quizTitle, setQuizTitle] = useState(`Quiz: ${noteTitle}`);
    const [quizDescription, setQuizDescription] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Intermediate);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(true);

    // AI-suggested questions (mock)
    const suggestedQuestions: QuizQuestion[] = [
        {
            id: 'suggested_1',
            question: `What is the primary concept in ${topic}?`,
            options: [
                'Core principle A',
                'Core principle B',
                'Core principle C',
                'Core principle D'
            ],
            correctAnswer: 0,
            explanation: 'This is the fundamental concept.'
        },
        {
            id: 'suggested_2',
            question: `Which technique is most commonly used in ${topic}?`,
            options: [
                'Technique 1',
                'Technique 2',
                'Technique 3',
                'Technique 4'
            ],
            correctAnswer: 1,
            explanation: 'This technique is widely adopted.'
        },
        {
            id: 'suggested_3',
            question: `How does ${topic} relate to practical applications?`,
            options: [
                'Application method A',
                'Application method B',
                'Application method C',
                'Application method D'
            ],
            correctAnswer: 0,
            explanation: 'This is the most practical approach.'
        },
        {
            id: 'suggested_4',
            question: `What are the key benefits of understanding ${topic}?`,
            options: [
                'Benefit 1: Improved efficiency',
                'Benefit 2: Better understanding',
                'Benefit 3: Enhanced skills',
                'All of the above'
            ],
            correctAnswer: 3,
            explanation: 'Understanding this topic provides multiple benefits.'
        }
    ];

    const addBlankQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: `custom_${Date.now()}`,
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: ''
        };
        setQuestions([...questions, newQuestion]);
    };

    const addSuggestedQuestion = (suggested: QuizQuestion) => {
        const newQuestion = { ...suggested, id: `added_${Date.now()}` };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
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

    const handleSave = () => {
        const validQuestions = questions.filter(q => q.question.trim() !== '');
        if (validQuestions.length === 0) {
            alert('Please add at least one question!');
            return;
        }

        const quiz: Quiz = {
            id: `quiz_${Date.now()}`,
            title: quizTitle,
            description: quizDescription,
            subject,
            topic,
            difficulty,
            questions: validQuestions,
            createdBy: 'current_user',
            createdAt: new Date().toISOString(),
            metadata: {
                role: 'student',
                quizVerification: 'none',
                authorType: 'student_verified',
                published: false
            },
            status: 'draft'
        };

        onSave(quiz);
    };

    const addedSuggestionIds = new Set(
        questions.filter(q => q.id.startsWith('suggested_')).map(q => q.question)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Quiz Editor</h2>
                        <p className="text-sm text-gray-600 font-medium mt-1">Create questions for: {noteTitle}</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Quiz Details */}
                        <div className="lg:col-span-1 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Quiz Title
                                </label>
                                <input
                                    type="text"
                                    value={quizTitle}
                                    onChange={(e) => setQuizTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Description
                                </label>
                                <textarea
                                    value={quizDescription}
                                    onChange={(e) => setQuizDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none font-medium resize-none"
                                    placeholder="Brief description..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Difficulty
                                </label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                                    className="w-full px-4 py-3 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none font-medium"
                                >
                                    <option value={Difficulty.Beginner}>Beginner</option>
                                    <option value={Difficulty.Intermediate}>Intermediate</option>
                                    <option value={Difficulty.Advanced}>Advanced</option>
                                </select>
                            </div>

                            {/* AI Suggestions Toggle */}
                            <div className="pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-all"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Sparkles className="text-purple-600" size={20} />
                                        <span className="font-black text-purple-900">AI Suggestions</span>
                                    </div>
                                    <span className="text-sm font-bold text-purple-600">
                                        {showSuggestions ? 'Hide' : 'Show'}
                                    </span>
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                                <h3 className="font-black text-blue-900 text-sm mb-3">Quiz Stats</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Questions:</span>
                                        <span className="font-bold text-blue-900">{questions.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Subject:</span>
                                        <span className="font-bold text-blue-900">{subject}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Topic:</span>
                                        <span className="font-bold text-blue-900">{topic}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Questions */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* AI Suggested Questions */}
                            {showSuggestions && (
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Sparkles className="text-purple-600" size={20} />
                                        <h3 className="font-black text-purple-900">AI-Suggested Questions</h3>
                                    </div>
                                    <p className="text-sm text-purple-700 mb-4">Click to add these questions to your quiz</p>

                                    <div className="space-y-3">
                                        {suggestedQuestions.map((suggested, idx) => {
                                            const isAdded = addedSuggestionIds.has(suggested.question);
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`p-4 rounded-xl border-2 transition-all ${isAdded
                                                            ? 'bg-green-50 border-green-200'
                                                            : 'bg-white border-purple-200 hover:border-purple-300 cursor-pointer'
                                                        }`}
                                                    onClick={() => !isAdded && addSuggestedQuestion(suggested)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <p className="text-sm font-bold text-gray-900 flex-1">{suggested.question}</p>
                                                        {isAdded ? (
                                                            <Check className="text-green-600 flex-shrink-0 ml-2" size={20} />
                                                        ) : (
                                                            <Plus className="text-purple-600 flex-shrink-0 ml-2" size={20} />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Custom Questions */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-black text-gray-900">Your Questions ({questions.length})</h3>
                                    <button
                                        onClick={addBlankQuestion}
                                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
                                    >
                                        <Plus size={16} />
                                        <span>Add Question</span>
                                    </button>
                                </div>

                                {questions.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 font-medium mb-4">No questions added yet</p>
                                        <p className="text-sm text-gray-400">Add questions manually or select from AI suggestions</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {questions.map((q, qIndex) => (
                                            <div key={q.id} className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-sm font-black text-gray-700">Question {qIndex + 1}</span>
                                                    <button
                                                        onClick={() => removeQuestion(qIndex)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} className="text-red-500" />
                                                    </button>
                                                </div>

                                                <input
                                                    type="text"
                                                    value={q.question}
                                                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                    placeholder="Enter your question..."
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none font-medium mb-4"
                                                />

                                                <div className="space-y-2 mb-4">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Options (select correct answer)</label>
                                                    {q.options.map((option, oIndex) => (
                                                        <div key={oIndex} className="flex items-center space-x-3">
                                                            <input
                                                                type="radio"
                                                                checked={q.correctAnswer === oIndex}
                                                                onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                                                className="w-5 h-5 text-purple-600"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                placeholder={`Option ${oIndex + 1}`}
                                                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none font-medium"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <input
                                                    type="text"
                                                    value={q.explanation || ''}
                                                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                                    placeholder="Explanation (optional but recommended)"
                                                    className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none font-medium text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={questions.length === 0}
                        className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>Save Quiz</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
