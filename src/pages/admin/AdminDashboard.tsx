
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Clock, CheckCircle, LogOut, Loader2, ExternalLink, Image, RefreshCw } from 'lucide-react';
import { adminService } from '@/services/admin/adminService';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    approved: boolean;
    createdAt: string;
    approvedAt?: string;
    verificationData?: Record<string, any>;
    [key: string]: any;
}

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [stats, setStats] = useState<{ total: number; pending: number; approved: number } | null>(null);
    const [error, setError] = useState('');

    // Check authentication
    useEffect(() => {
        if (!adminService.isLoggedIn()) {
            navigate('/admin/login');
            return;
        }
        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError('');

            const [pending, approved, statsData] = await Promise.all([
                adminService.getUsers('pending'),
                adminService.getUsers('approved'),
                adminService.getStats()
            ]);

            setPendingUsers(pending);
            setActiveUsers(approved);
            setStats(statsData);
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
            if (err.message === 'Session expired') {
                navigate('/admin/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        setApprovingId(userId);
        try {
            const result = await adminService.approveUser(userId);
            if (result.success) {
                // Refresh the lists
                await fetchUsers();
            } else {
                setError(result.message);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to approve user');
        } finally {
            setApprovingId(null);
        }
    };

    const handleLogout = () => {
        adminService.logout();
        navigate('/admin/login');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'student': return 'bg-blue-100 text-blue-700';
            case 'teacher': return 'bg-green-100 text-green-700';
            case 'online_educator': return 'bg-purple-100 text-purple-700';
            case 'community_contributor': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Render verification data based on role
    const renderVerificationData = (user: User) => {
        const data = user.verificationData || {};

        switch (user.role) {
            case 'student':
            case 'teacher':
                // Show ID picture + credentials
                return (
                    <div className="space-y-2">
                        {data.proofDocuments && data.proofDocuments.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <Image size={14} className="text-gray-400" />
                                <a
                                    href={data.proofDocuments[0].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    View ID Document
                                </a>
                            </div>
                        )}
                        {data.institutionName && (
                            <p className="text-sm text-gray-600">Institution: {data.institutionName}</p>
                        )}
                        {data.department && (
                            <p className="text-sm text-gray-600">Department: {data.department}</p>
                        )}
                        {data.studentId && (
                            <p className="text-sm text-gray-600">ID: {data.studentId}</p>
                        )}
                    </div>
                );

            case 'online_educator':
                // Show clickable link + credentials
                return (
                    <div className="space-y-2">
                        {data.credibilityLinks && data.credibilityLinks.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <ExternalLink size={14} className="text-gray-400" />
                                <a
                                    href={data.credibilityLinks[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-sm hover:underline flex items-center"
                                >
                                    Channel Link <ExternalLink size={12} className="ml-1" />
                                </a>
                            </div>
                        )}
                        {data.platform && (
                            <p className="text-sm text-gray-600">Platform: {data.platform}</p>
                        )}
                        {data.followerCount && (
                            <p className="text-sm text-gray-600">Followers: {data.followerCount}</p>
                        )}
                    </div>
                );

            case 'community_contributor':
                // Simple credentials
                return (
                    <div className="space-y-1">
                        {Object.entries(data).map(([key, value]) => (
                            <p key={key} className="text-sm text-gray-600">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {String(value)}
                            </p>
                        ))}
                        {Object.keys(data).length === 0 && (
                            <p className="text-sm text-gray-400 italic">No additional credentials</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Render user row dynamically
    const renderUserRow = (user: User, showApproveButton: boolean) => {
        const excludeFields = ['id', 'password', 'verificationData', 'approved', 'alreadyApproved'];

        return (
            <div key={user.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {/* Header with name and role */}
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                {user.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                                {user.role?.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>

                        {/* Dynamic fields */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {Object.entries(user).map(([key, value]) => {
                                if (excludeFields.includes(key) || key.startsWith('_') || typeof value === 'object') {
                                    return null;
                                }
                                if (key === 'createdAt' || key === 'approvedAt' || key === 'updatedAt') {
                                    return (
                                        <p key={key} className="text-xs text-gray-500">
                                            <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>{' '}
                                            {formatDate(String(value))}
                                        </p>
                                    );
                                }
                                if (key === 'name' || key === 'email' || key === 'role') {
                                    return null; // Already shown above
                                }
                                return (
                                    <p key={key} className="text-xs text-gray-500">
                                        <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>{' '}
                                        {String(value)}
                                    </p>
                                );
                            })}
                        </div>

                        {/* Verification data */}
                        {user.verificationData && Object.keys(user.verificationData).length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Verification Details</p>
                                {renderVerificationData(user)}
                            </div>
                        )}
                    </div>

                    {/* Approve button */}
                    {showApproveButton && (
                        <button
                            onClick={() => handleApprove(user.id)}
                            disabled={approvingId === user.id}
                            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                            {approvingId === user.id ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <CheckCircle size={16} />
                            )}
                            <span>Approve</span>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gray-900 text-white py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Shield size={28} className="text-purple-400" />
                        <h1 className="text-xl font-black">Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Users size={24} className="text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Total Users</p>
                                    <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Clock size={24} className="text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Pending Approval</p>
                                    <p className="text-2xl font-black text-gray-900">{stats.pending}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <CheckCircle size={24} className="text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Approved Users</p>
                                    <p className="text-2xl font-black text-gray-900">{stats.approved}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Refresh button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={fetchUsers}
                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                        <RefreshCw size={16} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Pending Users Section */}
                <section className="mb-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <Clock size={20} className="text-orange-600" />
                        <h2 className="text-xl font-black text-gray-900">Pending Users</h2>
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-sm font-bold">
                            {pendingUsers.length}
                        </span>
                    </div>

                    {pendingUsers.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">No pending approvals!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingUsers.map(user => renderUserRow(user, true))}
                        </div>
                    )}
                </section>

                {/* Active Users Section */}
                <section>
                    <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle size={20} className="text-green-600" />
                        <h2 className="text-xl font-black text-gray-900">Active Users</h2>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-bold">
                            {activeUsers.length}
                        </span>
                    </div>

                    {activeUsers.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                            <Users size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No approved users yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeUsers.map(user => renderUserRow(user, false))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
