import React from 'react';
import { Globe, Lock, Upload, Download } from 'lucide-react';

interface UploadTypeSelectorProps {
    onSelect: (type: 'community' | 'course') => void;
}

export const UploadTypeSelector: React.FC<UploadTypeSelectorProps> = ({ onSelect }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-gray-900 mb-4">Upload Your Notes</h1>
                    <p className="text-xl text-gray-600 font-medium">Choose how you want to share your knowledge</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Community Upload */}
                    <button
                        onClick={() => onSelect('community')}
                        className="group bg-white rounded-[3rem] p-12 border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                                <Globe size={40} className="text-white" />
                            </div>

                            <div className="mb-6">
                                <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider mb-4">
                                    Public
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-3">Upload for Community</h2>
                                <p className="text-gray-600 font-medium leading-relaxed">
                                    Share with everyone. Your notes will be publicly accessible and downloadable by all users.
                                </p>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center space-x-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="font-medium">Anyone can download</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="font-medium">Freely shareable</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="font-medium">Build your reputation</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Like a public library 📚</span>
                                <Upload size={20} className="text-blue-500 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </button>

                    {/* Course Upload */}
                    <button
                        onClick={() => onSelect('course')}
                        className="group bg-white rounded-[3rem] p-12 border-2 border-gray-200 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                                <Lock size={40} className="text-white" />
                            </div>

                            <div className="mb-6">
                                <div className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-black uppercase tracking-wider mb-4">
                                    Protected
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-3">Upload for My Course</h2>
                                <p className="text-gray-600 font-medium leading-relaxed">
                                    Restrict access to enrolled students only. Protected with unique links and view-only mode.
                                </p>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center space-x-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="font-medium">Link-based authentication</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="font-medium">View-only protection</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-700">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="font-medium">One-time Drive save</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Like a private class 🎓</span>
                                <Lock size={20} className="text-purple-500 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        💡 Tip: Choose Community for open sharing, Course for controlled access
                    </p>
                </div>
            </div>
        </div>
    );
};
