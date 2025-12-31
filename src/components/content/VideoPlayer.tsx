import React, { useState } from 'react';
import { Play, ExternalLink, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
    url: string;
    title?: string;
    className?: string;
    autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    url,
    title = 'Video',
    className = '',
    autoPlay = false
}) => {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [hasError, setHasError] = useState(false);

    // Extract Video ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

    if (!videoId || !embedUrl) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center p-4 text-center ${className}`}>
                <div className="text-gray-500">
                    <AlertCircle className="mx-auto mb-2" size={24} />
                    <p className="text-sm">Invalid Video URL</p>
                </div>
            </div>
        );
    }

    if (!isPlaying) {
        return (
            <div
                className={`relative group bg-gray-900 cursor-pointer overflow-hidden ${className}`}
                onClick={() => setIsPlaying(true)}
            >
                {/* Thumbnail */}
                <div className="absolute inset-0">
                    <img
                        src={thumbnailUrl || ''}
                        alt={title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        onError={(e) => {
                            // Fallback to hqdefault if maxres doesn't exist
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }}
                    />
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl border border-white/50">
                        <Play size={32} className="text-white fill-white ml-1" />
                    </div>
                </div>

                {/* Title & Fallback Link */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
                    <span className="text-white font-bold text-sm line-clamp-1">{title}</span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-200 hover:text-white flex items-center space-x-1 bg-white/10 px-2 py-1 rounded backdrop-blur-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span>Watch on YouTube</span>
                        <ExternalLink size={10} />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative bg-black group ${className}`}>
            <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full absolute inset-0"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setHasError(true)}
            />
            {/* Fallback Link Overlay (Visible on Hover/Pause) */}
            <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-bold pointer-events-auto hover:bg-red-600 transition-colors"
                >
                    <span>Open in YouTube</span>
                    <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};
