
import React, { useState } from 'react';
import { Link as LinkIcon, Youtube, Linkedin, Globe, Plus, X } from 'lucide-react';

interface EducatorVerificationFormProps {
    onSubmit: (data: {
        credibilityLinks: string[];
    }) => void;
}

export const EducatorVerificationForm: React.FC<EducatorVerificationFormProps> = ({ onSubmit }) => {
    const [links, setLinks] = useState<string[]>(['']);
    const [error, setError] = useState('');

    const handleAddLink = () => {
        if (links.length < 5) {
            setLinks([...links, '']);
        }
    };

    const handleRemoveLink = (index: number) => {
        if (links.length > 1) {
            setLinks(links.filter((_, i) => i !== index));
        }
    };

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const getLinkIcon = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return <Youtube size={18} className="text-red-500" />;
        }
        if (url.includes('linkedin.com')) {
            return <Linkedin size={18} className="text-blue-600" />;
        }
        if (url.includes('udemy.com') || url.includes('coursera.org')) {
            return <Globe size={18} className="text-purple-500" />;
        }
        return <LinkIcon size={18} className="text-gray-400" />;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Filter out empty links
        const validLinks = links.filter(link => link.trim() !== '');

        // Validate at least one link
        if (validLinks.length === 0) {
            setError('Please provide at least one credibility link');
            return;
        }

        // Validate all links are valid URLs
        const invalidLinks = validLinks.filter(link => !isValidUrl(link));
        if (invalidLinks.length > 0) {
            setError('Please enter valid URLs (including http:// or https://)');
            return;
        }

        onSubmit({
            credibilityLinks: validLinks
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-bold text-green-800 mb-2">
                    🌐 Verify Your Teaching Credibility
                </p>
                <p className="text-xs text-green-700">
                    Provide at least one public link to verify your teaching experience or online presence.
                </p>
            </div>

            <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                    Credibility Links *
                </label>

                {links.map((link, index) => (
                    <div key={index} className="relative">
                        <div className="relative flex items-center space-x-2">
                            <div className="flex-1 relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                    {link ? getLinkIcon(link) : <LinkIcon size={18} className="text-gray-400" />}
                                </div>
                                <input
                                    type="url"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-900 text-white border-none rounded-2xl focus:ring-4 focus:ring-green-100 outline-none transition-all font-medium placeholder:text-gray-500"
                                    placeholder="https://youtube.com/@yourchannel or https://linkedin.com/in/yourprofile"
                                    value={link}
                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                />
                            </div>
                            {links.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLink(index)}
                                    className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-red-500" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {links.length < 5 && (
                    <button
                        type="button"
                        onClick={handleAddLink}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Add Another Link</span>
                    </button>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-800 mb-2">Accepted Platforms:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                    <div className="flex items-center space-x-2">
                        <Youtube size={14} />
                        <span>YouTube Channel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Linkedin size={14} />
                        <span>LinkedIn Profile</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Globe size={14} />
                        <span>Udemy Profile</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Globe size={14} />
                        <span>Coursera Profile</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Globe size={14} />
                        <span>Personal Website</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Globe size={14} />
                        <span>Portfolio</span>
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm font-bold ml-2 animate-in fade-in">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="w-full py-5 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all"
            >
                Submit for Verification
            </button>

            <p className="text-xs text-gray-500 text-center">
                Links will be validated within 24 hours
            </p>
        </form>
    );
};
