import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Share2, Download, CheckCircle2, FileText, ArrowLeft, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { driveSyncService } from '@/services/drive/driveSyncService';
import { Subject, Topic, Subtopic, Difficulty } from '@/types';
import { Toast, ToastType } from '@/components/ui/Toast';

import { DEMO_CONTENTS } from '@/data/demoContents';

export const SharedNotePage: React.FC = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const user = authService.getUser();

    // Toast State
    const [toast, setToast] = useState<{ visible: boolean; message: string; subMessage?: string; type: ToastType }>({
        visible: false,
        message: '',
        type: 'success'
    });

    const showToast = (message: string, subMessage?: string, type: ToastType = 'success') => {
        setToast({ visible: true, message, subMessage, type });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Find the actual demo content
    const foundContent = DEMO_CONTENTS.find(c => c.id === noteId);

    // Default fallback if not found or for the body text (since demo data doesn't have full text)
    const noteData = {
        title: foundContent?.title || "Understanding Process Synchronization",
        author: foundContent?.uploadedBy || "User_" + noteId?.slice(-4) || "Anonymous",
        subject: foundContent?.organization.subjectPath?.subject || "Computer Science",
        topic: foundContent?.organization.subjectPath?.coreTopic || "Operating Systems",
        uploadedAt: foundContent?.uploadedAt ? new Date(foundContent.uploadedAt).toLocaleDateString() : "Just now",
        content: foundContent ? `
## Description
${foundContent.description}

## Introduction
(This is placeholder text for the demo note view). Process synchronization is the task of coordinating the execution of processes in a way that no two processes can have access to the same shared data and resources.

## Critical Section Problem
The critical section is a code segment where the shared variables can be accessed. An atomic action is required in a critical section i.e. only one process can execute in its critical section at a time. All the other processes have to wait to execute in their critical sections.

### Solution Requirements
1. **Mutual Exclusion**: If process Pi is executing in its critical section, then no other processes can be executing in their critical sections.
2. **Progress**: If no process is executing in its critical section and there exist some processes that wish to enter their critical section, then the selection of the processes that will enter the critical section next cannot be postponed indefinitely.
3. **Bounded Waiting**: A bound must exist on the number of times that other processes are allowed to enter their critical sections after a process has made a request to enter its critical section and before that request is granted.
        `.trim() : `
## Introduction
Process synchronization is the task of coordinating the execution of processes in a way that no two processes can have access to the same shared data and resources.
        `.trim()
    };

    const handleDownload = async () => {
        if (!user) {
            showToast('Authentication Required', 'Please log in to download content.', 'error');
            return;
        }

        if (!foundContent) {
            showToast('Error', 'Content details not found.', 'error');
            return;
        }

        // 1. Extract FULL breadcrumb hierarchy based on browseContext
        const org = foundContent.organization;

        // Get browse context from URL (which browse tab user was on)
        const searchParams = new URLSearchParams(window.location.search);
        const browseContext = searchParams.get('browseContext') || org.primaryPath;

        // Build FULL folder path array matching browse breadcrumb
        let folderPath: string[] = [];

        // Use browseContext to determine which hierarchical path to mirror
        switch (browseContext) {
            case 'trending':
                // For trending, use the content's primary path classification
                // This ensures trending downloads use the most appropriate folder structure
                const trendingContext = org.primaryPath;
                switch (trendingContext) {
                    case 'university':
                        if (org.universityPath) {
                            folderPath = [
                                org.universityPath.university,
                                `Semester ${org.universityPath.semester}`,
                                org.universityPath.department,
                                org.universityPath.subject,
                                org.universityPath.topic
                            ];
                        }
                        break;
                    case 'channel':
                        if (org.channelPath) {
                            folderPath = [
                                org.channelPath.channelName,
                                org.channelPath.playlistName,
                                org.channelPath.topic
                            ];
                        }
                        break;
                    case 'competitive_exam':
                        if (org.competitiveExamPath) {
                            folderPath = [
                                org.competitiveExamPath.exam,
                                org.competitiveExamPath.year,
                                org.competitiveExamPath.subject,
                                org.competitiveExamPath.topic
                            ];
                        }
                        break;
                    case 'course':
                        if (org.coursePath) {
                            folderPath = [
                                org.coursePath.provider,
                                org.coursePath.instructor,
                                org.coursePath.courseName,
                                org.coursePath.topic
                            ];
                        }
                        break;
                    case 'subject':
                    default:
                        if (org.subjectPath) {
                            folderPath = [
                                org.subjectPath.subject,
                                org.subjectPath.coreTopic,
                                org.subjectPath.subtopic
                            ];
                        }
                        break;
                }
                break;
            case 'university':
                if (org.universityPath) {
                    // Mirror: University → Semester → Department → Subject → Topic
                    folderPath = [
                        org.universityPath.university,
                        `Semester ${org.universityPath.semester}`,
                        org.universityPath.department,
                        org.universityPath.subject,
                        org.universityPath.topic
                    ];
                }
                break;
            case 'channel':
                if (org.channelPath) {
                    // Mirror: Channel → Playlist → Topic
                    folderPath = [
                        org.channelPath.channelName,
                        org.channelPath.playlistName,
                        org.channelPath.topic
                    ];
                }
                break;
            case 'competitive_exam':
                if (org.competitiveExamPath) {
                    // Mirror: Exam → Year → Subject → Topic
                    folderPath = [
                        org.competitiveExamPath.exam,
                        org.competitiveExamPath.year,
                        org.competitiveExamPath.subject,
                        org.competitiveExamPath.topic
                    ];
                }
                break;
            case 'course':
                if (org.coursePath) {
                    // Mirror: Provider → Instructor → Course → Topic
                    folderPath = [
                        org.coursePath.provider,
                        org.coursePath.instructor,
                        org.coursePath.courseName,
                        org.coursePath.topic
                    ];
                }
                break;
            case 'subject':
            default:
                if (org.subjectPath) {
                    // Mirror: Subject → CoreTopic → Subtopic
                    folderPath = [
                        org.subjectPath.subject,
                        org.subjectPath.coreTopic,
                        org.subjectPath.subtopic
                    ];
                }
                break;
        }

        // Fallback: If extraction failed
        if (folderPath.length === 0) {
            if (org.subjectPath) {
                folderPath = [
                    org.subjectPath.subject,
                    org.subjectPath.coreTopic,
                    org.subjectPath.subtopic
                ];
            } else if (org.universityPath) {
                folderPath = [
                    org.universityPath.university,
                    org.universityPath.subject,
                    org.universityPath.topic
                ];
            } else {
                folderPath = ["General", "Misc", "Resources"];
            }
        }

        // TODO: Pass folderPath array to driveSyncService for recursive folder creation
        // For now, use first 3 levels for compatibility with existing Subject/Topic/Subtopic structure
        const [subjectName = "General", topicName = "Misc", subtopicName = "Resources"] = folderPath;

        // Construct objects expected by driveSyncService
        const subject: Subject = {
            id: subjectName.toLowerCase().replace(/\s+/g, '-'),
            name: subjectName,
            icon: 'folder',
            description: 'Generated from download',
            status: 'verified'
        };

        const topic: Topic = {
            id: topicName.toLowerCase().replace(/\s+/g, '-'),
            subjectId: subject.id,
            title: topicName,
            description: 'Generated from download',
            status: 'verified',
            difficulty: Difficulty.Intermediate,
            votes: 0,
            lastUpdated: new Date().toISOString(),
            content: '',
            readiness: 100
        };

        const subtopic: Subtopic = {
            id: subtopicName.toLowerCase().replace(/\s+/g, '-'),
            topicId: topic.id,
            title: subtopicName,
            description: 'Generated from download',
            status: 'verified'
        };

        // 2. Trigger Smart Sync with full content metadata
        await driveSyncService.syncDownload({
            subject,
            topic,
            subtopic,
            title: foundContent.title,
            description: foundContent.description,
            videoUrl: foundContent.videoUrl,
            contentId: foundContent.id,
            isCourseContent: false, // It's community content validation
            uploadedBy: foundContent.uploadedBy
        });

        // Show full breadcrumb path in toast message
        const fullFolderPath = folderPath.join(' > ');
        showToast('Downloaded to My Drive!', `Organized into: ${fullFolderPath}`, 'success');
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-24 p-6">
            <Toast
                isVisible={toast.visible}
                message={toast.message}
                subMessage={toast.subMessage}
                type={toast.type}
                onClose={closeToast}
            />
            {/* Header Navigation */}
            <button
                onClick={() => navigate('/hub')}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors"
            >
                <ArrowLeft size={18} />
                <span>Back to Hub</span>
            </button>

            <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Top Meta Bar */}
                <div className="p-8 md:p-12 border-b border-gray-50 bg-gray-50/30 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100">
                            {noteData.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 text-xl leading-tight">{noteData.author}</h4>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Community Contributor • {noteData.uploadedAt}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex bg-gray-100 rounded-2xl p-1">
                            <button className="p-3 text-gray-500 hover:text-green-600 hover:bg-white rounded-xl transition-all">
                                <ThumbsUp size={20} />
                            </button>
                        </div>
                        <button className="p-3.5 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-2xl transition-all border border-gray-100 shadow-sm">
                            <Share2 size={20} />
                        </button>
                        <button className="p-3.5 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-2xl transition-all border border-gray-100 shadow-sm">
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content Body */}
                <div className="p-10 md:p-16">
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4 text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">
                            <span>{noteData.subject}</span>
                            <span>•</span>
                            <span>{noteData.topic}</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">{noteData.title}</h1>
                    </div>

                    {/* Video Player */}
                    {foundContent?.videoUrl && (
                        <div className="mb-12 rounded-[2rem] overflow-hidden bg-gray-900 aspect-video shadow-2xl shadow-blue-900/10 ring-4 ring-gray-50">
                            <iframe
                                src={foundContent.videoUrl}
                                className="w-full h-full"
                                title={noteData.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    <div className="prose prose-blue prose-xl max-w-none text-gray-700 font-medium leading-[1.8]">
                        {noteData.content.split('\n').map((line, i) => (
                            line.startsWith('##') ? <h2 key={i} className="text-3xl font-black mt-16 mb-8 text-gray-900 border-b-2 border-gray-50 pb-4">{line.replace('## ', '')}</h2> :
                                line.startsWith('###') ? <h3 key={i} className="text-2xl font-black mt-10 mb-6 text-gray-800">{line.replace('### ', '')}</h3> :
                                    <p key={i} className="mb-8 opacity-90">{line}</p>
                        ))}
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="p-10 bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 rounded-b-[4rem]">
                    <div className="flex items-center space-x-6">
                        <div className="p-5 bg-white/10 text-white rounded-[1.5rem] backdrop-blur-md border border-white/10">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-2xl tracking-tight">Community Verified</h4>
                            <p className="text-gray-400 font-medium text-sm mt-1">This content has been reviewed by the community.</p>
                        </div>
                    </div>
                    <div className="flex space-x-4 w-full md:w-auto">
                        <button
                            onClick={handleDownload}
                            className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                        >
                            <Download size={24} /> <span>Download</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
