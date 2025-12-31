import React, { useState } from 'react';
import { UploadTypeSelector } from '@/components/forms/organization/UploadTypeSelector';
import { ProtectedNoteViewer } from '@/components/content/ProtectedNoteViewer';
import { DriveExplorer } from '@/components/drive/DriveExplorer';
import { authService } from '@/services/auth/authService';

export const MockUIDemo: React.FC = () => {
    const [currentDemo, setCurrentDemo] = useState<'selector' | 'drive' | 'viewer'>('selector');
    const user = authService.getUser();

    const mockCourseNote = {
        id: '1',
        title: 'Python Introduction - Variables and Data Types',
        platform: 'Coursera',
        instructor: 'Code with Harry',
        courseName: 'Python Zero to Hero',
        chapter: 'Chapter 1: Python Basics',
        content: 'Course content here...'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Demo Switcher */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-2 flex space-x-2">
                <button
                    onClick={() => setCurrentDemo('selector')}
                    className={`px-6 py-3 rounded-xl font-black transition-all ${currentDemo === 'selector'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Upload Type Selector
                </button>
                <button
                    onClick={() => setCurrentDemo('drive')}
                    className={`px-6 py-3 rounded-xl font-black transition-all ${currentDemo === 'drive'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Drive Explorer
                </button>
                <button
                    onClick={() => setCurrentDemo('viewer')}
                    className={`px-6 py-3 rounded-xl font-black transition-all ${currentDemo === 'viewer'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Protected Viewer
                </button>
            </div>

            {/* Demo Content */}
            <div className="pt-24">
                {currentDemo === 'selector' && (
                    <UploadTypeSelector onSelect={(type) => alert(`Selected: ${type}`)} />
                )}

                {currentDemo === 'drive' && user && (
                    <DriveExplorer userId={user.id} />
                )}

                {currentDemo === 'viewer' && user && (
                    <ProtectedNoteViewer
                        courseNote={mockCourseNote}
                        user={{
                            name: user.name,
                            email: user.email
                        }}
                    />
                )}
            </div>
        </div>
    );
};
