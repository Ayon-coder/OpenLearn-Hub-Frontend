import React, { useState } from 'react';
import { Upload, FileText, FileQuestion, Eye, Calendar, CheckCircle, Clock, XCircle, Plus, Lock, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth/authService';

export const ContributionPage: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getUser();
    const [activeTab, setActiveTab] = useState<'notes' | 'quizzes'>('notes');

    // Check upload permissions for community contributors
    const canUploadNotes = user ? authService.canUploadNotes(user) : false;
    const isCommunityCont = user?.role === 'community_contributor';
    const isBronze = isCommunityCont && user?.communityMetrics?.trustLevel === 'bronze';

    // Mock data for user's contributions
    // Bronze community contributors cannot upload, so they should have no contributions
    const myNotes = (isCommunityCont && isBronze) ? [] : [
        {
            id: '1',
            title: 'Array Implementation in C',
            subject: 'Computer Science',
            topic: 'Data Structures',
            uploadedAt: '2024-01-15',
            status: 'approved' as const,
            views: 1250,
            likes: 89
        },
        {
            id: '2',
            title: 'Binary Search Trees',
            subject: 'Computer Science',
            topic: 'Data Structures',
            uploadedAt: '2024-01-18',
            status: 'pending' as const,
            views: 0,
            likes: 0
        }
    ];

    const myQuizzes = (isCommunityCont && isBronze) ? [] : [
        {
            id: '1',
            title: 'Arrays Quiz',
            subject: 'Computer Science',
            topic: 'Data Structures',
            uploadedAt: '2024-01-16',
            status: 'approved' as const,
            attempts: 45
        }
    ];

    const getStatusBadge = (status: 'approved' | 'pending' | 'rejected') => {
        const config = {
            approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Approved' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending Review' },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejected' }
        };
        const { bg, text, icon: Icon, label } = config[status];

        return (
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${bg} ${text} text-xs font-bold`}>
                <Icon size={14} />
                <span>{label}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">My Contributions</h1>
                    <p className="text-gray-600 font-medium">Manage your uploaded notes and quizzes</p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <button
                        onClick={canUploadNotes ? () => navigate('/notes/upload') : undefined}
                        disabled={!canUploadNotes}
                        className={`group rounded-2xl p-8 text-left transition-all ${canUploadNotes
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-600 hover:shadow-2xl transform hover:scale-105 cursor-pointer'
                            : 'bg-gray-300 cursor-not-allowed opacity-75'
                            }`}
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm ${canUploadNotes ? 'bg-white/20' : 'bg-gray-400/30'
                                }`}>
                                {canUploadNotes ? (
                                    <Upload className="text-white" size={32} />
                                ) : (
                                    <Lock className="text-gray-600" size={32} />
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-1">
                                    Upload Notes {!canUploadNotes && '🔒'}
                                </h3>
                                <p className={canUploadNotes ? 'text-blue-100 font-medium' : 'text-gray-600 font-medium'}>
                                    {canUploadNotes ? 'Share your knowledge' : 'Locked - Silver+ only'}
                                </p>
                            </div>
                        </div>
                        <div className={`flex items-center space-x-2 text-sm font-medium ${canUploadNotes ? 'text-white/80' : 'text-gray-600'
                            }`}>
                            {canUploadNotes ? (
                                <>
                                    <Plus size={16} />
                                    <span>Start new contribution</span>
                                </>
                            ) : (
                                <span>Reach Silver level to unlock</span>
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/quiz/create')}
                        className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-left hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <FileQuestion className="text-white" size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-1">Create Quiz</h3>
                                <p className="text-purple-100 font-medium">Test learner knowledge</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-white/80 text-sm font-medium">
                            <Plus size={16} />
                            <span>Create new quiz</span>
                        </div>
                    </button>
                </div>

                {/* Bronze Level Info Banner */}
                {isBronze && (
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-start space-x-3">
                            <Info className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-black text-orange-900 mb-2">🥉 Bronze Level - Build Your Trust to Upload</h3>
                                <p className="text-sm text-orange-800 font-medium mb-3">
                                    You're currently at Bronze level (Trust Score: {user?.communityMetrics?.trustScore || 0}/100).
                                    To unlock note uploads, reach Silver level (40+ trust score) by:
                                </p>
                                <ul className="text-sm text-orange-800 space-y-1 font-medium mb-3">
                                    <li>• Browse and comment on existing notes</li>
                                    <li>• Provide helpful feedback to other contributors</li>
                                    <li>• Receive upvotes on your comments</li>
                                    <li>• Engage positively with the community</li>
                                </ul>
                                <p className="text-xs text-orange-700 font-bold">
                                    💡 Your trust score updates automatically based on community engagement!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl font-black text-blue-600 mb-1">{myNotes.length}</div>
                        <div className="text-sm text-gray-600 font-medium">Notes Uploaded</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl font-black text-purple-600 mb-1">{myQuizzes.length}</div>
                        <div className="text-sm text-gray-600 font-medium">Quizzes Created</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-3xl font-black text-green-600 mb-1">
                            {myNotes.reduce((sum, n) => sum + n.views, 0)}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Total Views</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-xl p-2 mb-6">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`p-4 rounded-xl font-black transition-all ${activeTab === 'notes'
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <FileText size={20} />
                                <span>My Notes ({myNotes.length})</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('quizzes')}
                            className={`p-4 rounded-xl font-black transition-all ${activeTab === 'quizzes'
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <FileQuestion size={20} />
                                <span>My Quizzes ({myQuizzes.length})</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {activeTab === 'notes' && (
                        <div className="space-y-4">
                            {myNotes.map((note) => (
                                <div key={note.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-gray-900 mb-2">{note.title}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span className="font-medium">{note.subject} › {note.topic}</span>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar size={14} />
                                                    <span>{note.uploadedAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {getStatusBadge(note.status)}
                                    </div>

                                    {note.status === 'approved' && (
                                        <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Eye size={16} />
                                                <span className="font-medium">{note.views} views</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <span className="font-medium">{note.likes} likes</span>
                                            </div>
                                        </div>
                                    )}

                                    {note.status === 'pending' && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                                            <p className="text-sm text-yellow-800 font-medium">
                                                ⏳ Your content is under review. This usually takes 24-48 hours.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {myNotes.length === 0 && (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                                    <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-900 mb-2">No notes yet</h3>
                                    <p className="text-gray-600 mb-6">
                                        {canUploadNotes
                                            ? 'Start contributing by uploading your first note!'
                                            : 'Reach Silver level to start uploading notes!'}
                                    </p>
                                    {canUploadNotes && (
                                        <button
                                            onClick={() => navigate('/notes/upload')}
                                            className="px-6 py-3 bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-black rounded-xl hover:shadow-lg transition-all"
                                        >
                                            Upload Your First Note
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'quizzes' && (
                        <div className="space-y-4">
                            {myQuizzes.map((quiz) => (
                                <div key={quiz.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-gray-900 mb-2">{quiz.title}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span className="font-medium">{quiz.subject} › {quiz.topic}</span>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar size={14} />
                                                    <span>{quiz.uploadedAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {getStatusBadge(quiz.status)}
                                    </div>

                                    {quiz.status === 'approved' && (
                                        <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <span className="font-medium">{quiz.attempts} attempts</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {myQuizzes.length === 0 && (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                                    <FileQuestion size={48} className="text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-900 mb-2">No quizzes yet</h3>
                                    <p className="text-gray-600 mb-6">Create your first quiz to help others learn!</p>
                                    <button
                                        onClick={() => navigate('/quiz/create')}
                                        className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black rounded-xl hover:shadow-lg transition-all"
                                    >
                                        Create Your First Quiz
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Info Notice */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h4 className="font-black text-blue-900 mb-2">📝 Contribution Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1 font-medium">
                        <li>• All uploads require admin verification before going live</li>
                        <li>• Provide accurate source references for better trust levels</li>
                        <li>• High-quality content gets featured and earns you reputation</li>
                        <li>• Community contributors can earn trust levels through consistent quality</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
