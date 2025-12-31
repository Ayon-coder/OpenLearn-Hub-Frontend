import React, { useState } from 'react';
import { ProtectedNoteViewer } from '@/components/content/ProtectedNoteViewer';
import { authService } from '@/services/auth/authService';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, AlertTriangle, CheckCircle } from 'lucide-react';

import { DEMO_CONTENTS } from '@/data/demoContents';

export const CourseNoteAccessPage: React.FC = () => {
    const { courseNoteId } = useParams<{ courseNoteId: string }>();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const user = authService.getUser();
    const navigate = useNavigate();

    // Find the actual demo content from navigation
    const foundContent = DEMO_CONTENTS.find(c => c.id === courseNoteId);

    // Mock validation (in real app, this would validate JWT)
    const [isValidating, setIsValidating] = useState(false);
    // Auto-grant access if the user is the uploader
    const [accessGranted, setAccessGranted] = useState(
        user && foundContent ? user.name === foundContent.uploadedBy : false
    );

    // Redirect if not found (or show not found access page)
    if (!foundContent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
                    <h1 className="text-2xl font-black text-gray-900 mb-4">Content Not Found</h1>
                    <button onClick={() => navigate('/trending')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Back to Trending</button>
                </div>
            </div>
        );
    }

    // Dynamic course note data
    const mockCourseNote = {
        id: foundContent.id,
        title: foundContent.title,
        platform: foundContent.organization.coursePath?.provider || 'External Platform',
        instructor: foundContent.organization.coursePath?.instructor || foundContent.uploadedBy,
        courseName: foundContent.organization.coursePath?.courseName || foundContent.title,
        chapter: foundContent.organization.coursePath?.topic || 'General',
        content: 'Course content here...'
    };

    if (!user) {
        // ... (Keep existing Login Required view or update if needed, but "Access Denied" is the focus)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                {/* Simplified Login Prompt matching style */}
                <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
                    <h1 className="text-2xl font-black text-gray-900 mb-4">Login to OpenLearn Hub</h1>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Login / Sign Up</button>
                </div>
            </div>
        )
    }

    if (!accessGranted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden relative">
                    {/* Close Button Mock */}
                    <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors" onClick={() => window.history.back()}>
                        <span className="font-bold text-lg">×</span>
                    </button>

                    {/* Gradient Header */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center relative overflow-hidden">
                        {/* Background Lock Decoration */}
                        <div className="absolute -top-6 -right-6 text-white/5 transform rotate-12">
                            <Lock size={140} />
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg border border-white/20">
                                <Lock size={32} />
                            </div>
                            <h1 className="text-2xl font-black text-white mb-2 leading-tight">Course Enrollment Required</h1>
                            <p className="text-blue-100 font-medium text-sm">This content is exclusive to enrolled students.</p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        {/* Target Course Card */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Course</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{mockCourseNote.courseName}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{mockCourseNote.platform}</p>
                                </div>
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-600">
                                    <div className="font-black text-xs">C</div> {/* Mock Logo */}
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-2xl shadow-lg shadow-blue-200 transition-all group">
                            <div className="flex items-center justify-between px-6 py-3.5">
                                <div className="flex items-center space-x-3">
                                    <span className="font-black">Buy / Enroll on {mockCourseNote.platform}</span>
                                </div>
                                <span className="bg-blue-500 text-[10px] px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider group-hover:bg-blue-400 transition-colors">Recommended</span>
                            </div>
                        </button>

                        {/* Info Box */}
                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start space-x-3">
                            <div className="text-amber-500 mt-0.5 text-lg">💡</div>
                            <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                <span className="font-bold">Already enrolled?</span> Access these notes directly via the tracking link provided by your instructor in the {mockCourseNote.platform} course dashboard.
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] text-gray-400 font-medium">OpenLearn Hub is a community platform and is not affiliated with {mockCourseNote.platform}.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <ProtectedNoteViewer
                courseNote={mockCourseNote}
                user={{
                    name: user.name,
                    email: user.email
                }}
            />
        </div>
    );
};
