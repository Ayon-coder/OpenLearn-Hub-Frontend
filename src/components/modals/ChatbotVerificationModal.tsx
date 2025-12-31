
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, AlertTriangle, TrendingUp, X } from 'lucide-react';
import { Quiz, ChatbotVerificationResult } from '@/types';
import { chatbotQuizVerifier } from '@/services/quiz/chatbotQuizVerifier';

interface ChatbotVerificationModalProps {
    quiz: Quiz;
    onClose: () => void;
    onVerified: (result: ChatbotVerificationResult) => void;
    onEdit: () => void;
}

export const ChatbotVerificationModal: React.FC<ChatbotVerificationModalProps> = ({
    quiz,
    onClose,
    onVerified,
    onEdit
}) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [result, setResult] = useState<ChatbotVerificationResult | null>(null);

    useEffect(() => {
        verifyQuiz();
    }, []);

    const verifyQuiz = async () => {
        setIsVerifying(true);
        const verificationResult = await chatbotQuizVerifier.verifyQuiz(quiz);
        setResult(verificationResult);
        setIsVerifying(false);
    };

    const handlePublish = () => {
        if (result) {
            onVerified(result);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-2xl font-black text-gray-900">Quiz Verification</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Verifying State */}
                    {isVerifying && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <Loader2 className="text-blue-600 animate-spin" size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Analyzing Your Quiz...</h3>
                            <p className="text-gray-600 font-medium mb-6">
                                Our AI is checking your quiz for quality and accuracy
                            </p>

                            {/* Progress Indicators */}
                            <div className="space-y-3 max-w-md mx-auto">
                                {['Conceptual Correctness', 'Question Clarity', 'Plagiarism Check', 'Subject Alignment'].map((check, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                                        <Loader2 className="text-blue-600 animate-spin" size={16} />
                                        <span className="text-sm font-bold text-gray-700">{check}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Verification Results */}
                    {!isVerifying && result && (
                        <div>
                            {/* Overall Result Banner */}
                            <div className={`${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2 rounded-2xl p-6 mb-6`}>
                                <div className="flex items-center space-x-4">
                                    <div className={`w-16 h-16 ${result.passed ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                                        {result.passed ? (
                                            <CheckCircle className="text-green-600" size={32} />
                                        ) : (
                                            <XCircle className="text-red-600" size={32} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-2xl font-black ${result.passed ? 'text-green-900' : 'text-red-900'} mb-1`}>
                                            {result.passed ? '✅ Verification Passed!' : '❌ Verification Failed'}
                                        </h3>
                                        <p className={`${result.passed ? 'text-green-700' : 'text-red-700'} font-medium`}>
                                            {result.passed
                                                ? 'Your quiz meets all quality standards'
                                                : 'Your quiz needs improvement before publishing'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-4xl font-black ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                            {result.score}
                                        </div>
                                        <div className="text-xs text-gray-500 font-bold">Score</div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Feedback */}
                            <div className="space-y-4 mb-6">
                                <h4 className="font-black text-gray-900 text-lg">Detailed Feedback</h4>

                                {Object.entries(result.feedback).map(([key, value]) => {
                                    const labels = {
                                        conceptualCorrectness: { title: 'Conceptual Correctness', weight: '30%' },
                                        questionClarity: { title: 'Question Clarity', weight: '25%' },
                                        plagiarismCheck: { title: 'Plagiarism Check', weight: '25%' },
                                        subjectAlignment: { title: 'Subject Alignment', weight: '20%' }
                                    };
                                    const label = labels[key as keyof typeof labels];

                                    return (
                                        <div key={key} className={`p-4 rounded-xl border-2 ${value.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {value.passed ? (
                                                        <CheckCircle className="text-green-600" size={20} />
                                                    ) : (
                                                        <XCircle className="text-red-600" size={20} />
                                                    )}
                                                    <span className={`font-black ${value.passed ? 'text-green-900' : 'text-red-900'}`}>
                                                        {label.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xs font-bold text-gray-500">{label.weight}</span>
                                                    <span className={`text-lg font-black ${value.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                        {value.score}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className={`text-sm ${value.passed ? 'text-green-700' : 'text-red-700'} font-medium`}>
                                                {value.message}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Suggestions */}
                            {result.suggestions.length > 0 && (
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <TrendingUp className="text-blue-600" size={20} />
                                        <h4 className="font-black text-blue-900">Suggestions for Improvement</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {result.suggestions.map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start space-x-2 text-sm text-blue-700">
                                                <span className="text-blue-600 font-bold">•</span>
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-4">
                                {result.passed ? (
                                    <>
                                        <button
                                            onClick={handlePublish}
                                            className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                                        >
                                            Publish Quiz
                                        </button>
                                        <button
                                            onClick={onEdit}
                                            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all"
                                        >
                                            Edit Anyway
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={onEdit}
                                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                        >
                                            Edit Quiz
                                        </button>
                                        <button
                                            onClick={verifyQuiz}
                                            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all"
                                        >
                                            Retry Verification
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Transparency Notice */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-xs text-gray-600 font-medium">
                                    <AlertTriangle size={14} className="inline mr-1" />
                                    This verification ensures high-quality educational content. You can retry verification after making improvements.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
