
import React from 'react';
import { GraduationCap, BookOpen, Globe, Users, Check } from 'lucide-react';
import { UserRole } from '@/types';

interface RoleSelectorProps {
    selectedRole: UserRole | null;
    onRoleSelect: (role: UserRole) => void;
}

const roles = [
    {
        id: 'student' as UserRole,
        icon: GraduationCap,
        title: 'Student',
        description: 'Access learning materials, take quizzes, and chat with PDFs',
        features: ['Upload notes', 'Take quizzes', 'Chat with PDFs', 'Access all content'],
        color: 'blue'
    },
    {
        id: 'teacher' as UserRole,
        icon: BookOpen,
        title: 'Teacher',
        description: 'Create quizzes, upload content, and help students learn',
        features: ['Create quizzes', 'Upload content', 'Publish materials', 'Manage courses'],
        color: 'purple',
        requiresVerification: true
    },
    {
        id: 'online_educator' as UserRole,
        icon: Globe,
        title: 'Online Educator',
        description: 'Share your expertise and create educational content',
        features: ['Create courses', 'Upload materials', 'Build portfolio', 'Reach students'],
        color: 'green',
        requiresVerification: true
    },
    {
        id: 'community_contributor' as UserRole,
        icon: Users,
        title: 'Community Contributor',
        description: 'Share knowledge without professional credentials. Build trust through quality contributions.',
        features: ['No documents required', 'Start immediately', 'Earn trust', 'Auto upgrades'],
        color: 'orange'
    }
];

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        selectedBorder: 'border-blue-500',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
        check: 'bg-blue-600'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        selectedBorder: 'border-purple-500',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100',
        check: 'bg-purple-600'
    },
    green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        selectedBorder: 'border-green-500',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
        check: 'bg-green-600'
    },
    orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        selectedBorder: 'border-orange-500',
        icon: 'text-orange-600',
        iconBg: 'bg-orange-100',
        check: 'bg-orange-600'
    }
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
    return (
        <div className="space-y-4">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Choose Your Role</h2>
                <p className="text-gray-500 font-medium">Select how you'll be using OpenLearn Hub</p>
            </div>

            <div className="grid gap-4">
                {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    const colors = colorClasses[role.color];
                    const Icon = role.icon;

                    return (
                        <button
                            key={role.id}
                            onClick={() => onRoleSelect(role.id)}
                            className={`
                relative p-6 rounded-2xl border-2 text-left transition-all duration-200
                hover:shadow-lg hover:-translate-y-1
                ${isSelected
                                    ? `${colors.selectedBorder} ${colors.bg} shadow-lg`
                                    : `${colors.border} bg-white hover:${colors.bg}`
                                }
              `}
                        >
                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className={`absolute top-4 right-4 w-6 h-6 ${colors.check} rounded-full flex items-center justify-center animate-in zoom-in-50`}>
                                    <Check size={14} className="text-white" />
                                </div>
                            )}

                            <div className="flex items-start space-x-4">
                                <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={colors.icon} size={28} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-gray-900 mb-1">
                                        {role.title}
                                        {role.requiresVerification && (
                                            <span className="ml-2 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                                Requires Verification
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-600 font-medium mb-3">
                                        {role.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {role.features.map((feature, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs font-bold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
