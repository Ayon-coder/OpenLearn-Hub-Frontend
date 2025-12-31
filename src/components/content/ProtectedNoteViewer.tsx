import React, { useState } from 'react';
import { Lock, AlertCircle, Eye, EyeOff, Download, Share2, Copy, Check } from 'lucide-react';

interface ProtectedNoteViewerProps {
    courseNote: {
        id: string;
        title: string;
        platform: string;
        instructor: string;
        courseName: string;
        chapter: string;
        content: string;
    };
    user: {
        name: string;
        email: string;
    };
}

export const ProtectedNoteViewer: React.FC<ProtectedNoteViewerProps> = ({ courseNote, user }) => {
    const [savedToDrive, setSavedToDrive] = useState(false);
    const [showWatermark, setShowWatermark] = useState(true);

    const handleSaveToDrive = () => {
        setSavedToDrive(true);
        setTimeout(() => {
            alert('Note saved to Drive → Course Downloads → ' +
                `${courseNote.platform}/${courseNote.instructor}/${courseNote.courseName}/${courseNote.chapter}`);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
                                <Lock size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white">{courseNote.title}</h1>
                                <p className="text-sm text-gray-400 font-medium">
                                    {courseNote.platform} • {courseNote.instructor} • {courseNote.courseName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl flex items-center space-x-2 border border-red-500/30">
                                <Eye size={16} />
                                <span className="text-sm font-black uppercase tracking-wider">View-Only</span>
                            </div>

                            {!savedToDrive ? (
                                <button
                                    onClick={handleSaveToDrive}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700 transition-colors flex items-center space-x-2"
                                >
                                    <Download size={18} />
                                    <span>Save to Drive</span>
                                </button>
                            ) : (
                                <div className="px-6 py-2 bg-green-600 text-white rounded-xl font-black flex items-center space-x-2">
                                    <Check size={18} />
                                    <span>Saved to Drive</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Protection Notice */}
            <div className="bg-amber-900/20 border-y border-amber-700/30">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-200">
                                This content is protected. Screenshots, downloads, and sharing are disabled.
                            </p>
                            <p className="text-xs text-amber-400 mt-1">
                                You can save this note to your Drive once for offline viewing within the app.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                    {/* Watermark Overlay */}
                    {showWatermark && (
                        <div
                            className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
                            style={{ userSelect: 'none' }}
                        >
                            <div
                                className="text-gray-900/5 font-black text-6xl transform -rotate-45 whitespace-nowrap"
                                style={{
                                    textShadow: '0 0 20px rgba(0,0,0,0.1)',
                                    letterSpacing: '0.5em'
                                }}
                            >
                                {user.name} | {user.email} | {courseNote.courseName}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="p-16 prose prose-lg max-w-none relative z-10"
                        style={{ userSelect: 'none' }}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <h1 className="text-4xl font-black text-gray-900 mb-8">{courseNote.title}</h1>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-xl font-medium">
                                This is a protected course note. The content is displayed in view-only mode with the following protections:
                            </p>

                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3">
                                    <span className="text-purple-600 font-black">•</span>
                                    <span>Right-click is disabled</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-purple-600 font-black">•</span>
                                    <span>Text selection is disabled</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-purple-600 font-black">•</span>
                                    <span>Screenshot detection active</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-purple-600 font-black">•</span>
                                    <span>Watermark overlay with your credentials</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-purple-600 font-black">•</span>
                                    <span>One-time save to personal Drive</span>
                                </li>
                            </ul>

                            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 my-8">
                                <h3 className="text-xl font-black text-purple-900 mb-3">Sample Course Content</h3>
                                <p className="text-purple-800 font-medium">
                                    This is where the actual course content would appear. In a real implementation,
                                    this would contain the full notes, diagrams, code examples, and other educational materials
                                    uploaded by the instructor.
                                </p>
                            </div>

                            <p className="text-gray-600 italic">
                                Note: This is a mock UI demonstration. In production, the content would be dynamically loaded
                                and all protection mechanisms would be fully implemented.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="bg-gray-900 p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Viewing As</p>
                                <p className="text-lg font-black">{user.name} ({user.email})</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    disabled
                                    className="px-6 py-3 bg-gray-800 text-gray-500 rounded-xl font-bold cursor-not-allowed flex items-center space-x-2"
                                >
                                    <Share2 size={18} />
                                    <span>Share (Disabled)</span>
                                </button>
                                <button
                                    disabled
                                    className="px-6 py-3 bg-gray-800 text-gray-500 rounded-xl font-bold cursor-not-allowed flex items-center space-x-2"
                                >
                                    <Download size={18} />
                                    <span>Download (Disabled)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Watermark Toggle (Dev Only) */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => setShowWatermark(!showWatermark)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors flex items-center space-x-2 shadow-2xl"
                >
                    {showWatermark ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="text-xs">{showWatermark ? 'Hide' : 'Show'} Watermark</span>
                </button>
            </div>
        </div>
    );
};
