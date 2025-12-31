import React from 'react';
import { BookOpen, GraduationCap, Youtube } from 'lucide-react';
import { OrganizationPath } from '@/types';

interface OrganizationPathSelectorProps {
    selectedPath: OrganizationPath | null;
    onSelectPath: (path: OrganizationPath) => void;
}

export const OrganizationPathSelector: React.FC<OrganizationPathSelectorProps> = ({
    selectedPath,
    onSelectPath
}) => {
    const paths = [
        {
            id: 'subject' as OrganizationPath,
            icon: BookOpen,
            title: 'Subject-Based',
            description: 'Organize by academic subjects and topics',
            example: 'Computer Science › Data Structures › Arrays',
            color: 'blue'
        },
        {
            id: 'university' as OrganizationPath,
            icon: GraduationCap,
            title: 'University-Based',
            description: 'Organize by university curriculum structure',
            example: 'IIT Bombay › Sem 3 › CSE › Data Structures',
            color: 'purple'
        },
        {
            id: 'channel' as OrganizationPath,
            icon: Youtube,
            title: 'Channel-Based',
            description: 'Organize by educator or YouTube playlist',
            example: 'CodeWithHarry › DSA Course › Arrays',
            color: 'red'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                <h3 className="font-black text-blue-900 text-lg mb-2">Choose Organization Path</h3>
                <p className="text-sm text-blue-700 font-medium">
                    Select how you want to organize this content. You can add multiple paths later.
                </p>
            </div>

            {/* Path Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {paths.map((path) => {
                    const Icon = path.icon;
                    const isSelected = selectedPath === path.id;

                    return (
                        <button
                            key={path.id}
                            onClick={() => onSelectPath(path.id)}
                            className={`p-6 rounded-2xl border-2 transition-all text-left ${isSelected
                                    ? `border-${path.color}-500 bg-${path.color}-50 ring-4 ring-${path.color}-100 scale-105`
                                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
                                }`}
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? `bg-${path.color}-100` : 'bg-gray-100'
                                    }`}>
                                    <Icon className={isSelected ? `text-${path.color}-600` : 'text-gray-400'} size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">{path.title}</h4>
                                    {isSelected && (
                                        <span className="text-xs font-bold text-green-600">✓ Selected</span>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 font-medium mb-3">
                                {path.description}
                            </p>

                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Example:</p>
                                <p className="text-xs text-gray-700 font-medium">{path.example}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-800 font-medium">
                    💡 <strong>Tip:</strong> Choose the path that best matches your content source.
                    You can add additional organization paths in the preview step.
                </p>
            </div>
        </div>
    );
};
