
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Clock, XCircle, AlertCircle,
    Upload, ArrowLeft, Trash2
} from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { User, VerificationStatus } from '@/types';
import { TrustLevelIndicator } from '@/components/ui/TrustLevelIndicator';

export const VerificationPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = authService.getUser();
        setUser(currentUser);

        const handleAuthChange = () => {
            setUser(authService.getUser());
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    if (!user) {
        return null;
    }

    const getStatusConfig = (status: VerificationStatus) => {
        switch (status) {
            case 'verified':
                return {
                    icon: CheckCircle,
                    color: 'green',
                    title: 'Verified',
                    message: 'Your account has been verified successfully!',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800',
                    iconColor: 'text-green-600'
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'yellow',
                    title: 'Pending Review',
                    message: 'Your verification is being reviewed. This usually takes 24-48 hours.',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-800',
                    iconColor: 'text-yellow-600'
                };
            case 'rejected':
                return {
                    icon: XCircle,
                    color: 'red',
                    title: 'Verification Rejected',
                    message: 'Your verification was rejected. Please review the feedback and resubmit.',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800',
                    iconColor: 'text-red-600'
                };
            default:
                return {
                    icon: AlertCircle,
                    color: 'gray',
                    title: 'Not Verified',
                    message: 'Please complete your verification to access all features.',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-800',
                    iconColor: 'text-gray-600'
                };
        }
    };

    const statusConfig = getStatusConfig(user.verificationStatus);
    const StatusIcon = statusConfig.icon;

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'student': return 'Student';
            case 'teacher': return 'Teacher';
            case 'online_educator': return 'Online Educator';
            case 'community_contributor': return 'Community Contributor';
            default: return role;
        }
    };

    const handleDeleteDocument = (docId: string) => {
        // Mock delete - in production, this would call an API
        console.log('Delete document:', docId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 font-bold text-sm mb-6"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Profile</span>
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Status Banner */}
                    <div className={`${statusConfig.bgColor} border-b ${statusConfig.borderColor} p-8`}>
                        <div className="flex items-center space-x-4">
                            <div className={`w-16 h-16 ${statusConfig.bgColor} rounded-full flex items-center justify-center border-2 ${statusConfig.borderColor}`}>
                                <StatusIcon className={statusConfig.iconColor} size={32} />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-black text-gray-900 mb-1">
                                    Verification Status: {statusConfig.title}
                                </h1>
                                <p className={`font-medium ${statusConfig.textColor}`}>
                                    {statusConfig.message}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="p-8 space-y-6">
                        <div>
                            <h2 className="text-lg font-black text-gray-900 mb-4">Account Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                        Name
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                        Email
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">{user.email}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                        Role
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">{getRoleLabel(user.role)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                        Verification Level
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 capitalize">{user.verificationLevel}</p>
                                </div>
                            </div>
                        </div>

                        {/* Verification Data */}
                        {user.verificationData && (
                            <div>
                                <h2 className="text-lg font-black text-gray-900 mb-4">Submitted Information</h2>

                                {user.verificationData.institutionName && (
                                    <div className="bg-blue-50 rounded-xl p-4 mb-3">
                                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
                                            Institution
                                        </p>
                                        <p className="text-sm font-bold text-blue-900">
                                            {user.verificationData.institutionName}
                                        </p>
                                    </div>
                                )}

                                {user.verificationData.department && (
                                    <div className="bg-blue-50 rounded-xl p-4 mb-3">
                                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
                                            Department
                                        </p>
                                        <p className="text-sm font-bold text-blue-900">
                                            {user.verificationData.department}
                                        </p>
                                    </div>
                                )}

                                {user.verificationData.year && (
                                    <div className="bg-blue-50 rounded-xl p-4 mb-3">
                                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
                                            Year of Study
                                        </p>
                                        <p className="text-sm font-bold text-blue-900">
                                            {user.verificationData.year}
                                        </p>
                                    </div>
                                )}

                                {user.verificationData.proofDocuments && user.verificationData.proofDocuments.length > 0 && (
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                            Uploaded Documents
                                        </p>
                                        <div className="space-y-2">
                                            {user.verificationData.proofDocuments.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {user.verificationStatus === 'verified' && (
                                                        <button
                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete document (verified users can delete)"
                                                        >
                                                            <Trash2 size={16} className="text-red-500" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {user.verificationData.credibilityLinks && user.verificationData.credibilityLinks.length > 0 && (
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                            Credibility Links
                                        </p>
                                        <div className="space-y-2">
                                            {user.verificationData.credibilityLinks.map((link, idx) => (
                                                <a
                                                    key={idx}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                                >
                                                    <p className="text-sm font-bold text-blue-600 truncate">{link}</p>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {user.verificationData.submittedAt && (
                                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                                            Submitted On
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {new Date(user.verificationData.submittedAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {user.verificationData.reviewNotes && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                                        <p className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-2">
                                            Review Notes
                                        </p>
                                        <p className="text-sm font-medium text-yellow-800">
                                            {user.verificationData.reviewNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Community Contributor Trust Level */}
                        {user.role === 'community_contributor' && user.communityMetrics && (
                            <div>
                                <h2 className="text-lg font-black text-gray-900 mb-4">Trust Level & Metrics</h2>
                                <TrustLevelIndicator metrics={user.communityMetrics} showDetails={true} />

                                {/* Tips for Improving Trust */}
                                <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
                                    <h3 className="font-black text-gray-900 mb-3">💡 Tips to Improve Your Trust Score</h3>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 font-bold">•</span>
                                            <span>Upload high-quality, well-organized notes that help others learn</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 font-bold">•</span>
                                            <span>Engage positively with the community through helpful comments</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 font-bold">•</span>
                                            <span>Ensure your content is accurate and properly cited</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 font-bold">•</span>
                                            <span>Respond to feedback and improve your contributions over time</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {user.verificationStatus === 'rejected' && (
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                            >
                                <Upload size={20} />
                                <span>Resubmit Verification</span>
                            </button>
                        )}

                        {user.verificationStatus === 'unverified' && (
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                            >
                                <Upload size={20} />
                                <span>Complete Verification</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h3 className="font-black text-gray-900 mb-2">What happens next?</h3>
                        <p className="text-sm text-gray-600">
                            {user.verificationStatus === 'pending' &&
                                'Our team will review your submission within 24-48 hours. You\'ll receive an email notification once the review is complete.'}
                            {user.verificationStatus === 'verified' &&
                                'You now have full access to all features based on your role. Start creating and sharing content!'}
                            {user.verificationStatus === 'rejected' &&
                                'Please review the feedback above and resubmit your verification with the correct information.'}
                            {user.verificationStatus === 'unverified' &&
                                'Complete your verification to unlock all features and start contributing to the community.'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h3 className="font-black text-gray-900 mb-2">Privacy & Security</h3>
                        <p className="text-sm text-gray-600">
                            Your verification documents are stored securely and only accessible to authorized administrators.
                            Once verified, you can delete your uploaded documents.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
