import React from 'react';
import { X, ExternalLink, Lock, BookOpen } from 'lucide-react';

interface CourseGatekeeperModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseName: string;
    provider: string;
}

export const CourseGatekeeperModal: React.FC<CourseGatekeeperModalProps> = ({
    isOpen,
    onClose,
    courseName,
    provider
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Lock size={120} />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                    >
                        <X size={20} className="text-white" />
                    </button>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 ring-4 ring-white/10">
                            <Lock size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">Course Enrollment Required</h2>
                        <p className="text-blue-100 font-medium">This content is exclusive to enrolled students.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Target Course</h3>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-lg font-black text-gray-900">{courseName}</p>
                                <p className="text-gray-600 font-medium">{provider}</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                <BookOpen size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <a
                            href={(() => {
                                const query = encodeURIComponent(courseName);
                                switch (provider.toLowerCase()) {
                                    case 'udemy':
                                        return `https://www.udemy.com/courses/search/?q=${query}`;
                                    case 'coursera':
                                        return `https://www.coursera.org/search?query=${query}`;
                                    case 'youtube':
                                        return `https://www.youtube.com/results?search_query=${query}`;
                                    case 'nptel':
                                    case 'swayam':
                                        return `https://onlinecourses.nptel.ac.in/noc/search?q=${query}`;
                                    case 'edx':
                                        return `https://www.edx.org/search?q=${query}`;
                                    default:
                                        return `https://www.coursera.org/search?query=${query}`;
                                }
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full group flex items-center justify-between p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
                        >
                            <span className="flex items-center">
                                <ExternalLink size={20} className="mr-3" />
                                Buy / Enroll on {provider}
                            </span>
                            <span className="bg-white/20 px-2 py-1 rounded text-xs font-black uppercase">Recommended</span>
                        </a>

                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                            <p className="text-sm text-yellow-800 font-medium flex items-start">
                                <span className="mr-2">💡</span>
                                Already enrolled? Access these notes directly via the tracking link provided by your instructor in the {provider} course dashboard.
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-center text-gray-400 mt-6 font-medium">
                        OpenLearn Hub is a community platform and is not affiliated with {provider}.
                    </p>
                </div>
            </div>
        </div>
    );
};
