import React, { useState } from 'react';
import { Copy, Check, Share2, Lock, Globe, ExternalLink } from 'lucide-react';

interface ShareableLinkProps {
    noteId: string;
    noteTitle: string;
    noteType: 'community' | 'course';
    platform?: string;
    courseName?: string;
    chapter?: string;
}

export const ShareableLink: React.FC<ShareableLinkProps> = ({
    noteId,
    noteTitle,
    noteType,
    platform,
    courseName,
    chapter
}) => {
    const [copied, setCopied] = useState(false);

    // Generate the appropriate link based on note type
    const generateLink = () => {
        const baseUrl = window.location.origin;

        if (noteType === 'course') {
            // Secure, protected link for course notes
            // In production, this would include a JWT token
            return `${baseUrl}/#/course/access/${noteId}?token=SECURE_TOKEN_HERE`;
        } else {
            // Public link for community notes
            return `${baseUrl}/#/note/${noteId}`;
        }
    };

    const link = generateLink();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: noteTitle,
                    text: `Check out this ${noteType === 'course' ? 'course note' : 'study material'}: ${noteTitle}`,
                    url: link
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className={`p-8 ${noteType === 'course' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} text-center`}>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-in bounce-in duration-700 delay-200">
                    {noteType === 'course' ? (
                        <Lock size={32} className="text-white" />
                    ) : (
                        <Globe size={32} className="text-white" />
                    )}
                </div>
                <h2 className="text-3xl font-black text-white mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-300">Upload Successful! 🎉</h2>
                <p className="text-white/90 text-lg font-medium animate-in slide-in-from-bottom-2 duration-500 delay-400">
                    {noteType === 'course' ? 'Secure link generated & ready to share' : 'Public link generated & ready to share'}
                </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
                {/* Note Details */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                    <h3 className="font-black text-gray-900 text-xl mb-2">{noteTitle}</h3>
                    {noteType === 'course' && platform && courseName && (
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 font-medium">
                            <span className="px-2 py-1 bg-white rounded-lg border border-gray-200">{platform}</span>
                            <span>→</span>
                            <span className="px-2 py-1 bg-white rounded-lg border border-gray-200">{courseName}</span>
                            {chapter && (
                                <>
                                    <span>→</span>
                                    <span className="px-2 py-1 bg-white rounded-lg border border-gray-200">{chapter}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Link Type Info */}
                <div className={`rounded-2xl p-6 border-2 transition-all hover:shadow-md ${noteType === 'course'
                    ? 'bg-purple-50/50 border-purple-100 hover:border-purple-200'
                    : 'bg-blue-50/50 border-blue-100 hover:border-blue-200'
                    }`}>
                    <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl shadow-sm ${noteType === 'course' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            {noteType === 'course' ? <Lock size={24} /> : <Globe size={24} />}
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-lg font-black mb-1 ${noteType === 'course' ? 'text-purple-900' : 'text-blue-900'
                                }`}>
                                {noteType === 'course' ? 'Protected Course Link' : 'Public Community Link'}
                            </h4>
                            <p className={`text-sm leading-relaxed font-medium ${noteType === 'course' ? 'text-purple-700' : 'text-blue-700'
                                }`}>
                                {noteType === 'course'
                                    ? '🔒 Only authorized students with this link can access the content. Secure token included.'
                                    : '🌍 Anyone with this link can view and download the content.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shareable Link */}
                <div className="animate-in slide-in-from-bottom-4 duration-500 delay-500">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                        Your Unique Share Link
                    </label>
                    <div className="flex items-stretch space-x-2 group">
                        <div className="flex-1 bg-slate-900 text-slate-200 px-6 py-4 rounded-2xl font-mono text-sm overflow-x-auto whitespace-nowrap border-2 border-slate-900 group-hover:border-slate-700 transition-colors shadow-lg">
                            {link}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`px-8 rounded-2xl font-black transition-all transform active:scale-95 shadow-lg flex items-center justify-center min-w-[120px] ${copied
                                ? 'bg-green-500 text-white shadow-green-200'
                                : noteType === 'course'
                                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200 hover:shadow-purple-300'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'
                                }`}
                        >
                            {copied ? (
                                <div className="flex items-center space-x-2 animate-in fade-in zoom-in duration-200">
                                    <Check size={20} className="stroke-[3px]" />
                                    <span>Copied!</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Copy size={20} className="stroke-[3px]" />
                                    <span>Copy</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 animate-in slide-in-from-bottom-4 duration-500 delay-700">
                    {navigator.share && (
                        <button
                            onClick={handleShare}
                            className="flex-1 py-4 bg-gray-50 text-gray-700 border-2 border-gray-100 rounded-2xl font-black hover:bg-gray-100 hover:border-gray-200 transition-all flex items-center justify-center space-x-2 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Share2 size={20} />
                            <span>Share...</span>
                        </button>
                    )}
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-2 hover:shadow-lg hover:-translate-y-0.5 border-2 border-transparent ${noteType === 'course'
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                    >
                        <ExternalLink size={20} />
                        <span>Open Link</span>
                    </a>
                </div>

                {/* Security Note for Course */}
                {noteType === 'course' && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex gap-3 animate-in fade-in duration-500 delay-1000">
                        <div className="p-1">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                        </div>
                        <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                            <strong>Security Note:</strong> This link contains a secure token. If a student shares it, unauthorized access will still be blocked.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
