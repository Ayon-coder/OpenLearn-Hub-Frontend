
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { UploadTypeSelector } from '@/components/forms/organization/UploadTypeSelector';
import { CourseUploadForm } from '@/components/forms/upload/CourseUploadForm';
import { ShareableLink } from '@/components/ui/ShareableLink';
import { UploadWizard } from '@/components/forms/upload/UploadWizard';
import { UploadedDocument } from '@/types';
import { addDemoContent, DEMO_CONTENTS } from '@/data/demoContents';
import { driveSyncService } from '@/services/drive/driveSyncService';

export const NoteUploadPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getUser();

    // Get initial type and edit data from navigation state if available
    const initialType = location.state?.initialType as 'community' | 'course' | undefined;
    const editMode = location.state?.editMode || false;
    const initialData = location.state?.initialData || null;

    const [uploadType, setUploadType] = useState<'community' | 'course' | null>(initialType || null);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [generatedNoteId, setGeneratedNoteId] = useState('');
    const [noteTitle, setNoteTitle] = useState('');

    if (!user) return null;

    // Check if community contributor has permission to upload notes
    if (user.role === 'community_contributor' && !authService.canUploadNotes(user)) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-8 text-white">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Upload size={32} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black">🥉 Bronze Level</h1>
                                    <p className="text-orange-100 font-medium">Note uploads locked</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 mb-4">
                                Build Your Trust to Unlock Uploads
                            </h2>
                            <p className="text-gray-700 font-medium mb-6">
                                As a Bronze level contributor, you need to reach <span className="font-black text-gray-900">Silver level (40+ trust score)</span> to upload notes.
                            </p>

                            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
                                <h3 className="font-black text-orange-900 mb-3">How to Reach Silver Level:</h3>
                                <ul className="space-y-2 text-sm text-orange-800 font-medium">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-orange-600 font-black">•</span>
                                        <span>Browse and comment on existing notes</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-orange-600 font-black">•</span>
                                        <span>Provide helpful feedback to other contributors</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-orange-600 font-black">•</span>
                                        <span>Receive upvotes on your comments and contributions</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-orange-600 font-black">•</span>
                                        <span>Engage positively with the community</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-900 rounded-2xl p-4 mb-6 text-white">
                                <div className="flex items-start space-x-3">
                                    <span className="text-2xl">💡</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-300">
                                            Your current trust score: <span className="font-black text-white">{user.communityMetrics?.trustScore || 0}</span>/100
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            You need 40+ to unlock note uploads
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all"
                                >
                                    Back to Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/browse')}
                                    className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 transition-all"
                                >
                                    Browse Notes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [isGenerating, setIsGenerating] = useState(false);

    const handleCommunityWizardComplete = async (data: any) => {
        setIsGenerating(true);
        // Simulate network delay for "generation" effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        // data.title has the title from the wizard
        setNoteTitle(data.title || 'Untitled Note');
        const noteId = `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setGeneratedNoteId(noteId);

        setIsGenerating(false);
        setUploadComplete(true);
    };

    const handleCourseUploadComplete = (data: any) => {
        console.log('Course upload completed:', data);
        setNoteTitle(data.title);

        const newNoteId = data.noteId || `course_${Date.now()}`;
        setGeneratedNoteId(newNoteId);

        // Add to demo contents for immediate access
        addDemoContent({
            id: newNoteId,
            title: data.title,
            description: data.description || `${data.platform} course notes for ${data.courseName} - ${data.chapter}`,
            organization: {
                primaryPath: 'course',
                coursePath: {
                    provider: data.platform || 'Course Platform',
                    instructor: user.name,
                    courseName: data.courseName || 'General Course',
                    topic: data.chapter || 'General Topic',
                    resourceTitle: data.title
                }
            },
            uploadedBy: user.name,
            uploadedAt: new Date().toISOString(),
            views: 0,
            likes: 0,
            downloads: 0,
            videoUrl: data.verificationLink || data.videoUrl,  // Use verificationLink for thumbnail extraction
            coverImage: data.coverImage  // Fallback if no video URL
        });

        // Sync to My Drive - Course Captures section
        driveSyncService.syncContribution({
            subject: { id: data.platform?.toLowerCase() || 'course', name: data.platform || 'Course' },
            topic: { id: data.courseName?.toLowerCase().replace(/\s+/g, '_') || 'general', title: data.courseName || 'General Course' },
            subtopic: { id: data.chapter?.toLowerCase().replace(/\s+/g, '_') || 'chapter', title: data.chapter || 'Chapter 1' },
            title: data.title,
            description: data.description || '',
            videoUrl: data.verificationLink || '',  // Use verification link for thumbnail extraction
            coverImage: data.coverImage,  // Fallback image when no video URL
            contentId: newNoteId,
            quiz: data.quiz,
            isCourseContent: true  // This marks it as course content for the Course Captures tab
        });

        setUploadComplete(true);
    };

    // Show upload type selector first
    if (!uploadType) {
        return <UploadTypeSelector onSelect={(type) => setUploadType(type)} />;
    }

    // Show course upload form if course type selected
    if (uploadType === 'course') {
        return (
            <CourseUploadForm
                onComplete={handleCourseUploadComplete}
                onBack={() => setUploadType(null)}
                initialData={initialData}
            />
        );
    }

    // Loading State
    if (isGenerating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8 flex items-center justify-center">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 animate-pulse"></div>
                        <Upload size={40} className="text-blue-600 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Publishing Note...</h2>
                    <p className="text-gray-500 font-medium">Generating public link and updating library</p>
                </div>
            </div>
        );
    }

    // Show shareable link after community upload complete
    if (uploadComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8 flex items-center justify-center">
                <div className="max-w-2xl w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <ShareableLink
                        noteId={generatedNoteId}
                        noteTitle={noteTitle}
                        noteType="community"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setUploadComplete(false);
                                setUploadType(null); // Reset to type selector or wizard
                            }}
                            className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                        >
                            <Upload size={20} />
                            <span>Upload Another</span>
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center space-x-2"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show community wizard (replacing previous manual form)
    if (uploadType === 'community' && !uploadComplete) {
        return (
            <UploadWizard
                onClose={() => {
                    if (initialType) {
                        navigate(-1);
                    } else {
                        setUploadType(null);
                    }
                }}
                onComplete={handleCommunityWizardComplete}
                initialData={initialData}
            />
        );
    }

    // Fallback: If for some reason we aren't in community mode but got here
    return null;
};
