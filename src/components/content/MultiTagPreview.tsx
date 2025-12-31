import React from 'react';
import { BookOpen, GraduationCap, Youtube, Edit2, AlertCircle } from 'lucide-react';
import { ContentOrganization } from '@/types';

interface MultiTagPreviewProps {
    organization: ContentOrganization;
    onEdit?: (path: 'subject' | 'university' | 'channel') => void;
}

export const MultiTagPreview: React.FC<MultiTagPreviewProps> = ({
    organization,
    onEdit
}) => {
    const { subjectPath, universityPath, channelPath, primaryPath } = organization;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h3 className="font-black text-blue-900 text-lg mb-2">Content Organization Preview</h3>
                        <p className="text-sm text-blue-700 font-medium">
                            Your content will be discoverable through the following paths.
                            Primary path: <strong>{primaryPath.charAt(0).toUpperCase() + primaryPath.slice(1)}-based</strong>
                        </p>
                    </div>
                </div>
            </div>

            {/* Path Cards */}
            <div className="space-y-4">
                {/* Subject Path */}
                {subjectPath && (
                    <div className="bg-white border-2 border-blue-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <BookOpen className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">Subject Path</h4>
                                    <p className="text-xs text-gray-500">Academic structure</p>
                                </div>
                            </div>
                            {onEdit && (
                                <button
                                    onClick={() => onEdit('subject')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} className="text-gray-400" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-bold text-blue-900 flex-wrap">
                            <span className="px-3 py-1 bg-blue-50 rounded-lg">{subjectPath.subject}</span>
                            <span className="text-blue-400">›</span>
                            <span className="px-3 py-1 bg-blue-50 rounded-lg">{subjectPath.coreTopic}</span>
                            <span className="text-blue-400">›</span>
                            <span className="px-3 py-1 bg-blue-50 rounded-lg">{subjectPath.subtopic}</span>
                            <span className="text-blue-400">›</span>
                            <span className="px-3 py-1 bg-blue-50 rounded-lg">{subjectPath.resourceTitle}</span>
                        </div>
                    </div>
                )}

                {/* University Path */}
                {universityPath && (
                    <div className="bg-white border-2 border-purple-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="text-purple-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">University Path</h4>
                                    <p className="text-xs text-gray-500">Curriculum structure</p>
                                </div>
                            </div>
                            {onEdit && (
                                <button
                                    onClick={() => onEdit('university')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} className="text-gray-400" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-bold text-purple-900 flex-wrap">
                            <span className="px-3 py-1 bg-purple-50 rounded-lg">{universityPath.university}</span>
                            <span className="text-purple-400">›</span>
                            <span className="px-3 py-1 bg-purple-50 rounded-lg">Semester {universityPath.semester}</span>
                            <span className="text-purple-400">›</span>
                            <span className="px-3 py-1 bg-purple-50 rounded-lg">{universityPath.department}</span>
                            <span className="text-purple-400">›</span>
                            <span className="px-3 py-1 bg-purple-50 rounded-lg">{universityPath.subject}</span>
                            <span className="text-purple-400">›</span>
                            <span className="px-3 py-1 bg-purple-50 rounded-lg">{universityPath.topic}</span>
                        </div>
                    </div>
                )}

                {/* Channel Path */}
                {channelPath && (
                    <div className="bg-white border-2 border-red-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <Youtube className="text-red-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">Channel Path</h4>
                                    <p className="text-xs text-gray-500">Educator / Playlist style</p>
                                </div>
                            </div>
                            {onEdit && (
                                <button
                                    onClick={() => onEdit('channel')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} className="text-gray-400" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-bold text-red-900 flex-wrap">
                            <span className="px-3 py-1 bg-red-50 rounded-lg">{channelPath.channelName}</span>
                            <span className="text-red-400">›</span>
                            <span className="px-3 py-1 bg-red-50 rounded-lg">{channelPath.playlistName}</span>
                            <span className="text-red-400">›</span>
                            <span className="px-3 py-1 bg-red-50 rounded-lg">{channelPath.topic}</span>
                            <span className="text-red-400">›</span>
                            <span className="px-3 py-1 bg-red-50 rounded-lg">{channelPath.resourceTitle}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Transparency Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-medium text-center">
                    ℹ️ Content is community-contributed and organized for structured learning.
                </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                    <h5 className="font-black text-blue-900 text-sm mb-2">Better Discovery</h5>
                    <p className="text-xs text-blue-700">Users can find your content through multiple paths</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                    <h5 className="font-black text-purple-900 text-sm mb-2">No Duplication</h5>
                    <p className="text-xs text-purple-700">Same content, multiple access points</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                    <h5 className="font-black text-red-900 text-sm mb-2">Flexible Browsing</h5>
                    <p className="text-xs text-red-700">Users choose how they want to explore</p>
                </div>
            </div>
        </div>
    );
};
