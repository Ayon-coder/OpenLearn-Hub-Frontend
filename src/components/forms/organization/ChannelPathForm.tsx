import React, { useState, useEffect } from 'react';
import { Youtube } from 'lucide-react';
import { ChannelPath } from '@/types';
import { POPULAR_CHANNELS } from '@/constants';

interface ChannelPathFormProps {
    initialData?: ChannelPath;
    onPathChange: (path: ChannelPath | null) => void;
}

export const ChannelPathForm: React.FC<ChannelPathFormProps> = ({
    initialData,
    onPathChange
}) => {
    const [channelName, setChannelName] = useState(initialData?.channelName || '');
    const [playlistName, setPlaylistName] = useState(initialData?.playlistName || '');
    const [topic, setTopic] = useState(initialData?.topic || '');
    const [resourceTitle, setResourceTitle] = useState(initialData?.resourceTitle || '');

    // Update parent when any field changes
    useEffect(() => {
        if (channelName && playlistName && topic && resourceTitle) {
            onPathChange({
                channelName,
                playlistName,
                topic,
                resourceTitle
            });
        } else {
            onPathChange(null);
        }
    }, [channelName, playlistName, topic, resourceTitle]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Youtube className="text-red-600" size={24} />
                </div>
                <div>
                    <h3 className="font-black text-gray-900 text-lg">Channel-Based Organization</h3>
                    <p className="text-sm text-gray-600">Educator / YouTube playlist style</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Channel Name */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Channel / Educator Name *
                    </label>
                    <select
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none font-medium"
                    >
                        <option value="">Select channel...</option>
                        {POPULAR_CHANNELS.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {channelName === 'Other' && (
                        <input
                            type="text"
                            placeholder="Enter channel/educator name"
                            onChange={(e) => setChannelName(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none font-medium mt-2"
                        />
                    )}
                </div>

                {/* Playlist Name */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Playlist / Course Name *
                    </label>
                    <input
                        type="text"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder="e.g., DSA Full Course, Python Tutorial Series"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none font-medium"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        The name of the playlist or course series this content belongs to
                    </p>
                </div>

                {/* Topic */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Topic *
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Arrays, Loops, Functions"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none font-medium"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        The specific topic covered in this video/lesson
                    </p>
                </div>

                {/* Resource Title */}
                <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                        Resource Title *
                    </label>
                    <input
                        type="text"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        placeholder="e.g., Array Implementation Notes, Lecture 5 Summary"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none font-medium"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        Your notes/summary title for this content
                    </p>
                </div>
            </div>

            {/* Preview */}
            {channelName && playlistName && topic && resourceTitle && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <p className="text-xs font-black text-red-700 uppercase tracking-widest mb-3">Path Preview:</p>
                    <div className="flex items-center space-x-2 text-sm font-bold text-red-900 flex-wrap">
                        <span>{channelName}</span>
                        <span className="text-red-400">›</span>
                        <span>{playlistName}</span>
                        <span className="text-red-400">›</span>
                        <span>{topic}</span>
                        <span className="text-red-400">›</span>
                        <span>{resourceTitle}</span>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-800 font-medium">
                    💡 <strong>Tip:</strong> This helps organize content like YouTube playlists, making it easy for others
                    to find all notes from the same educator or course series.
                </p>
            </div>
        </div>
    );
};
