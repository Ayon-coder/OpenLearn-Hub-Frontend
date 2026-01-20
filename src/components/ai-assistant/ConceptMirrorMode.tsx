import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { analyzeConceptExplanation, ConceptAnalysis } from '@/services/ai/aiAssistantService';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, FileText, Sparkles, ArrowRight, RefreshCw, Send, BookOpen, Zap } from 'lucide-react';

const EXAMPLE_CONCEPTS = [
    { name: 'Binary Search', description: 'Efficient search' },
    { name: 'Recursion', description: 'Self-calling functions' },
    { name: 'Hash Tables', description: 'Key-value maps' },
    { name: 'Big O', description: 'Complexity' },
    { name: 'REST APIs', description: 'Web architecture' },
];

export const ConceptMirrorMode: React.FC = () => {
    const [conceptName, setConceptName] = useState('');
    const [explanation, setExplanation] = useState('');
    const [analysis, setAnalysis] = useState<ConceptAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!conceptName.trim() || !explanation.trim() || isLoading) return;

        if (explanation.length < 20) {
            setError('Please provide a more detailed explanation (at least 20 characters).');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await analyzeConceptExplanation(conceptName.trim(), explanation.trim());
            setAnalysis(result);
        } catch (err) {
            console.error('Analysis error:', err);
            setError('Failed to analyze your explanation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setConceptName('');
        setExplanation('');
        setAnalysis(null);
        setError(null);
    };

    const handleExampleSelect = (concept: string) => {
        setConceptName(concept);
        setAnalysis(null);
        setError(null);
    };

    // If we have analysis, show results
    if (analysis) {
        return (
            <div className="flex flex-col h-full bg-gray-50/50">
                <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100/50 rounded-xl flex items-center justify-center text-xl">
                            <Zap className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Analysis Result</div>
                            <div className="font-bold text-gray-900 text-lg leading-none">{conceptName}</div>
                        </div>
                    </div>
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium border border-transparent hover:border-blue-100"
                        onClick={handleClear}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Another
                    </button>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto animate-in slide-in-from-bottom-4 duration-700">
                    {/* Summary Card */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Analysis Summary</h3>
                            </div>
                            <div className="text-gray-700 leading-relaxed text-lg prose prose-blue max-w-none">
                                <ReactMarkdown>{analysis.summary}</ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Understood */}
                        {analysis.understood.length > 0 && (
                            <div className="bg-white border border-green-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-50 rounded-xl text-green-600">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">What You Understand</h3>
                                </div>
                                <ul className="space-y-3">
                                    {analysis.understood.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors">
                                            <span className="text-green-600 mt-0.5">•</span>
                                            <div className="prose prose-sm max-w-none text-gray-700">
                                                <ReactMarkdown>{item}</ReactMarkdown>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Missing */}
                        {analysis.missing.length > 0 && (
                            <div className="bg-white border border-yellow-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Gaps in Understanding</h3>
                                </div>
                                <ul className="space-y-3">
                                    {analysis.missing.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50/50 hover:bg-yellow-50 transition-colors">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <div className="prose prose-sm max-w-none text-gray-700">
                                                <ReactMarkdown>{item}</ReactMarkdown>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Incorrect */}
                        {analysis.incorrect.length > 0 && (
                            <div className="bg-white border border-red-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-50 rounded-xl text-red-600">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Misconceptions</h3>
                                </div>
                                <ul className="space-y-3">
                                    {analysis.incorrect.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-50/50 hover:bg-red-50 transition-colors">
                                            <span className="text-red-600 mt-0.5">•</span>
                                            <div className="prose prose-sm max-w-none text-gray-700">
                                                <ReactMarkdown>{item}</ReactMarkdown>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Assumptions */}
                        {analysis.assumptions.length > 0 && (
                            <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Hidden Assumptions</h3>
                                </div>
                                <ul className="space-y-3">
                                    {analysis.assumptions.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50 hover:bg-purple-50 transition-colors">
                                            <span className="text-purple-600 mt-0.5">•</span>
                                            <div className="prose prose-sm max-w-none text-gray-700">
                                                <ReactMarkdown>{item}</ReactMarkdown>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {analysis.demo_mode && (
                        <div className="text-center py-4 text-sm text-gray-400 font-medium">
                            Demonstration Mode • Connect backend for full analysis capability
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Input form
    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/80 overflow-y-auto">
            <div className="flex-1 flex flex-col items-center p-8 animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm text-4xl">
                    <Zap className="w-10 h-10 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Concept Mirror</h1>
                <p className="text-gray-500 text-center max-w-md mb-10 text-lg">
                    Explain a concept in your own words. The AI will reflect back your understanding, gaps, and assumptions.
                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6">
                    {/* Concept Name */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300">
                        <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            What are you explaining?
                        </label>
                        <input
                            type="text"
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-medium"
                            placeholder="e.g., Recursion, REST APIs, Photosynthesis..."
                            value={conceptName}
                            onChange={(e) => setConceptName(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2 mt-4">
                            {EXAMPLE_CONCEPTS.map((c) => (
                                <button
                                    key={c.name}
                                    type="button"
                                    className="px-4 py-2 text-xs font-medium bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-700 rounded-xl border border-transparent hover:border-purple-200 transition-all"
                                    onClick={() => handleExampleSelect(c.name)}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300">
                        <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            Your Explanation
                        </label>
                        <textarea
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none"
                            placeholder="Start typing your explanation here. Be as detailed as you can..."
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            rows={8}
                        />
                        <div className="flex justify-between items-center mt-2 text-xs">
                            <span className={`font-medium ${explanation.length < 20 ? 'text-orange-500' : 'text-green-600'}`}>
                                {explanation.length < 20 ? 'Too short (min 20 chars)' : 'Length looks good'}
                            </span>
                            <span className="text-gray-400">{explanation.length} chars</span>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 text-red-700 px-5 py-4 rounded-2xl border border-red-100 animate-in slide-in-from-top-2">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-medium text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="group w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 disabled:shadow-none transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2"
                        disabled={!conceptName.trim() || !explanation.trim() || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Analyze My Understanding
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConceptMirrorMode;
