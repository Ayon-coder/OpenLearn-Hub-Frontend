import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  BookOpen,
  MessageSquare,
  FileQuestion,
  Bookmark,
  Award,
  TrendingUp,
  Clock,
  Star,
  Download,
  HardDrive,
  Users,
  BarChart3,
  Play,
  CheckCircle,
  Eye,
  AlertCircle,
  Info,
  Lock,
  Folder
} from 'lucide-react';
import { driveSyncService } from '@/services/drive/driveSyncService';
import { authService } from '@/services/auth/authService';
import { AuthRequiredModal } from '@/components/modals/AuthRequiredModal';
import { User, DriveItem } from '@/types';

// Helper Components
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  enabled: boolean;
  lockReason?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick, enabled, lockReason }) => (
  <div className="relative group">
    <button
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${enabled
        ? 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-xl cursor-pointer transform hover:scale-105'
        : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
        }`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
          }`}>
          {enabled ? icon : <Lock size={24} />}
        </div>
      </div>
      <h3 className="font-black text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 font-medium">{description}</p>
    </button>

    {!enabled && lockReason && (
      <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 font-medium z-50 pointer-events-none">
        <div className="flex items-start space-x-2">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{lockReason}</span>
        </div>
      </div>
    )}
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600 font-medium">{label}</div>
  </div>
);

interface StatusBadgeProps {
  status: 'verified' | 'pending' | 'needs_edit';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    verified: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Verified' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending Review' },
    needs_edit: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Needs Edit' }
  };

  const { bg, text, icon: Icon, label } = config[status];

  return (
    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${bg} ${text} text-xs font-bold`}>
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalFeature, setAuthModalFeature] = useState('');
  const [driveItems, setDriveItems] = useState<DriveItem[]>([]);

  React.useEffect(() => {
    setDriveItems(driveSyncService.getDriveItems());

    const handleSync = () => setDriveItems(driveSyncService.getDriveItems());
    window.addEventListener('drive-sync', handleSync);
    return () => window.removeEventListener('drive-sync', handleSync);
  }, []);

  const handleRestrictedAction = (feature: string, path: string) => {
    if (!user) {
      setAuthModalFeature(feature);
      setAuthModalOpen(true);
    } else {
      navigate(path);
    }
  };

  // Determine if quiz creation is allowed
  const canCreateQuiz = () => {
    if (!user) return false;
    if (user.role === 'teacher' || user.role === 'online_educator') {
      return true;
    }
    // Community contributors need Silver or Gold level
    if (user.role === 'community_contributor') {
      return user.communityMetrics?.trustLevel !== 'bronze';
    }
    // Students can create quizzes (with chatbot verification)
    if (user.role === 'student') {
      return true;
    }
    return false;
  };

  const getQuizLockReason = () => {
    if (!user) return 'Sign in required';

    // Community Contributors - Need Silver Level
    if (user.role === 'community_contributor') {
      if (user.communityMetrics?.trustLevel === 'bronze') {
        return 'Bronze contributors cannot create quizzes. Reach Silver level (40+ trust score) by uploading quality notes and receiving upvotes to unlock quiz creation.';
      }
    }

    // Others - Need General Verification
    if (!authService.canCreateQuizzes(user)) {
      if (user.role === 'student') {
        return 'Verification required or High Reputation needed. Verify your account OR earn 500+ reputation to unlock quiz creation.';
      }
      return 'Verification required. Please verify your account in your profile settings to create quizzes.';
    }

    return undefined;
  };

  const getUploadLockReason = () => {
    if (!user) return 'Sign in required';

    // Community Contributors - Need Silver Level
    if (user.role === 'community_contributor') {
      if (user.communityMetrics?.trustLevel === 'bronze') {
        return 'Bronze contributors cannot upload. Reach Silver level (40+ trust score) by engaging with the community to unlock.';
      }
    }

    // Others - Need General Verification
    if (!authService.canUploadNotes(user)) {
      if (user.role === 'student') {
        return 'Verification required or High Reputation needed. Verify your account OR earn 500+ reputation points from the community to unlock uploads.';
      }
      return 'Verification required. Please verify your account in your profile settings to upload notes.';
    }

    return undefined;
  };

  function renderGuestDashboard() {
    return (
      <div className="p-6 space-y-6">
        {/* Auth Modal */}
        <AuthRequiredModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          feature={authModalFeature}
        />

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl">
          <h1 className="text-3xl font-black mb-2">Welcome to OpenLearn Hub! 👋</h1>
          <p className="text-blue-100 font-medium mb-4">Explore thousands of study materials</p>
        </div>

        {/* Main Actions */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">Explore</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ActionCard
              icon={<BookOpen />}
              title="Browse Notes"
              description="Explore study materials"
              onClick={() => navigate('/browse')}
              enabled={true}
            />
            <ActionCard
              icon={<TrendingUp />}
              title="Trending Notes"
              description="Popular & Recent"
              onClick={() => navigate('/trending')}
              enabled={true}
            />
            <ActionCard
              icon={<MessageSquare />}
              title="Chat with Notes"
              description="AI-powered assistance"
              onClick={() => navigate('/ai-assistant')}
              enabled={true}
            />
            <ActionCard
              icon={<Bookmark />}
              title="Saved Resources"
              description="Your bookmarks"
              onClick={() => handleRestrictedAction('saved resources', '/saved')}
              enabled={true}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderStudentDashboard() {
    return (
      <div className="space-y-8">
        {/* Auth Modal */}
        <AuthRequiredModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          feature={authModalFeature}
        />

        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-black mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100 font-medium mb-4">Continue your learning journey</p>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-xs text-blue-100">University</div>
              <div className="font-black">{user?.university || 'Not Set'}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-xs text-blue-100">Semester</div>
              <div className="font-black">{user?.semester || 'Not Set'}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-xs text-blue-100">Trust Level</div>
              <div className="font-black capitalize">{user?.communityMetrics?.trustLevel || 'Basic'}</div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ActionCard
              icon={<Upload />}
              title="Upload Notes"
              description="Share your knowledge"
              onClick={() => handleRestrictedAction('upload notes', '/notes/upload')}
              enabled={!!user && authService.canUploadNotes(user)}
              lockReason={getUploadLockReason()}
            />
            <ActionCard
              icon={<BookOpen />}
              title="Browse Notes"
              description="Explore study materials"
              onClick={() => navigate('/browse')}
              enabled={true}
            />
            <ActionCard
              icon={<TrendingUp />}
              title="Trending Notes"
              description="Popular & Recent"
              onClick={() => navigate('/trending')}
              enabled={true}
            />
            <ActionCard
              icon={<Users />}
              title="Subscriptions"
              description="Followed creators"
              onClick={() => navigate('/subscriptions')}
              enabled={true}
            />
            <ActionCard
              icon={<MessageSquare />}
              title="Chat with Notes"
              description="AI-powered assistance"
              onClick={() => navigate('/ai-assistant')}
              enabled={true}
            />
            <ActionCard
              icon={<FileQuestion />}
              title="Attempt Quizzes"
              description="Test your knowledge"
              onClick={() => navigate('/browse')}
              enabled={true}
            />
            <ActionCard
              icon={<Bookmark />}
              title="Saved Resources"
              description="Your bookmarks"
              onClick={() => { }}
              enabled={true}
            />
            <ActionCard
              icon={<FileQuestion />}
              title="Create Quiz"
              description={authService.canCreateQuizzes(user) ? 'Create practice quizzes' : 'Locked'}
              onClick={() => navigate('/quiz/create')}
              enabled={authService.canCreateQuizzes(user)}
              lockReason={!authService.canCreateQuizzes(user) ? getQuizLockReason() : undefined}
            />
          </div>
        </div>

        {/* My Drive Quick Access */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">My Drive</h2>
            <button
              onClick={() => navigate('/my-drive')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              View All →
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                label: 'Community Uploads',
                count: driveItems.filter(i => i.source === 'uploaded').length,
                color: 'blue',
                icon: <Upload size={20} />
              },
              {
                label: 'Course Uploads',
                count: 0,
                color: 'purple',
                icon: <Lock size={20} />
              },
              {
                label: 'Community Downloads',
                count: driveItems.filter(i => i.source === 'downloaded').length,
                color: 'green',
                icon: <Download size={20} />
              },
              {
                label: 'Course Downloads',
                count: 0,
                color: 'orange',
                icon: <HardDrive size={20} />
              }
            ].map((category, idx) => (
              <div key={idx} className={`bg-white rounded-2xl p-6 border-2 border-${category.color}-100 hover:border-${category.color}-300 transition-all cursor-pointer`}>
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center mb-4 text-${category.color}-600`}>
                  {category.icon}
                </div>
                <p className="text-3xl font-black text-gray-900 mb-1">{category.count}</p>
                <p className="text-sm font-medium text-gray-600">{category.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* My Uploads */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">My Uploads</h2>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="space-y-4">
              {[
                { title: 'Data Structures Notes', status: 'verified' as const, date: '2 days ago' },
                { title: 'OS Concepts', status: 'pending' as const, date: '5 hours ago' },
                { title: 'DBMS Tutorial', status: 'needs_edit' as const, date: '1 week ago' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderTeacherDashboard() {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="text-sm text-purple-100">Verified Teacher</div>
              <h1 className="text-3xl font-black">{user?.name}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-xs text-purple-100">Institution</div>
              <div className="font-black">{user?.university || 'Not Set'}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-xs text-purple-100">Subjects</div>
              <div className="font-black">5 Subjects</div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">Teaching Tools</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <ActionCard
              icon={<Upload />}
              title="Upload Notes"
              description="Share course materials"
              onClick={() => navigate('/notes/upload')}
              enabled={!!user && authService.canUploadNotes(user)}
              lockReason={getUploadLockReason()}
            />
            <ActionCard
              icon={<FileQuestion />}
              title="Create Quiz"
              description="Test student knowledge"
              onClick={() => navigate('/quiz/create')}
              enabled={authService.canCreateQuizzes(user)}
              lockReason={getQuizLockReason()}
            />
            <ActionCard
              icon={<BookOpen />}
              title="Course Manager"
              description="Manage your courses"
              onClick={() => { }}
              enabled={true}
            />
            <ActionCard
              icon={<BarChart3 />}
              title="Analytics"
              description="View performance"
              onClick={() => { }}
              enabled={true}
            />
          </div>
        </div>

        {/* Analytics */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">Impact Analytics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard icon={<Eye />} label="Total Views" value="12,450" color="bg-blue-500" />
            <StatCard icon={<Download />} label="Downloads" value="3,240" color="bg-green-500" />
            <StatCard icon={<FileQuestion />} label="Quiz Attempts" value="1,890" color="bg-purple-500" />
          </div>
        </div>
      </div>
    );
  }

  function renderOnlineEducatorDashboard() {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Play size={24} />
            </div>
            <div>
              <div className="text-sm text-red-100">Online Educator</div>
              <h1 className="text-3xl font-black">{user?.name}</h1>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 inline-block">
            <div className="text-xs text-red-100">Channel</div>
            <div className="font-black">{user?.channelName || 'Your Channel'}</div>
          </div>
        </div>

        {/* Main Actions */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">Content Creation</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <ActionCard
              icon={<Upload />}
              title="Upload Notes"
              description="Share course content"
              onClick={() => navigate('/notes/upload')}
              enabled={!!user && authService.canUploadNotes(user)}
              lockReason={getUploadLockReason()}
            />
            <ActionCard
              icon={<Play />}
              title="Playlist Manager"
              description="Organize your content"
              onClick={() => { }}
              enabled={true}
            />
            <ActionCard
              icon={<FileQuestion />}
              title="Create Quiz"
              description="Engage your audience"
              onClick={() => navigate('/quiz/create')}
              enabled={authService.canCreateQuizzes(user)}
              lockReason={getQuizLockReason()}
            />
            <ActionCard
              icon={<BarChart3 />}
              title="Analytics"
              description="Track engagement"
              onClick={() => { }}
              enabled={true}
            />
          </div>
        </div>

        {/* Growth Metrics */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">Channel Growth</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard icon={<Users />} label="Followers" value="8,450" color="bg-red-500" />
            <StatCard icon={<Eye />} label="Total Views" value="45,230" color="bg-orange-500" />
            <StatCard icon={<TrendingUp />} label="Engagement" value="92%" color="bg-pink-500" />
          </div>
        </div>
      </div>
    );
  }

  function renderCommunityContributorDashboard() {
    // Check if user can upload notes based on trust level
    const canUploadNotes = user ? authService.canUploadNotes(user) : false;

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-black mb-2">Welcome, {user?.name}!</h1>
          <p className="text-orange-100 font-medium mb-4">Community Contributor</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 inline-block">
            <div className="text-xs text-orange-100">Trust Level</div>
            <div className="font-black capitalize">{user?.communityMetrics?.trustLevel || 'Bronze'}</div>
          </div>
        </div>

        {/* Main Actions */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">Contribution Tools</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ActionCard
              icon={<Upload />}
              title="Upload Notes"
              description={canUploadNotes ? 'Share your knowledge' : 'Locked - Silver+ only'}
              onClick={() => navigate('/notes/upload')}
              enabled={canUploadNotes}
              lockReason={getUploadLockReason()}
            />
            <ActionCard
              icon={<BookOpen />}
              title="My Contributions"
              description="View your uploads"
              onClick={() => navigate('/contribute')}
              enabled={true}
            />
            <ActionCard
              icon={<FileQuestion />}
              title="Create Quiz"
              description={canCreateQuiz() ? 'Create quizzes' : 'Locked'}
              onClick={() => navigate('/quiz/create')}
              enabled={canCreateQuiz()}
              lockReason={!canCreateQuiz() ? getQuizLockReason() : undefined}
            />
          </div>
        </div>

        {/* Trust Level Info */}
        {!canUploadNotes && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-black text-orange-900 mb-2">🥉 Bronze Level - Build Your Trust</h3>
                <p className="text-sm text-orange-800 font-medium mb-3">
                  You're currently at Bronze level. To unlock note uploads and reach Silver level (40+ trust score), you can:
                </p>
                <ul className="text-sm text-orange-800 space-y-1 font-medium">
                  <li>• Browse and comment on existing notes</li>
                  <li>• Provide helpful feedback to other contributors</li>
                  <li>• Receive upvotes on your comments</li>
                  <li>• Engage positively with the community</li>
                </ul>
                <p className="text-xs text-orange-700 font-bold mt-3">
                  💡 Your trust score updates automatically based on community engagement!
                </p>
              </div>
            </div>
          </div>
        )}
        {!canCreateQuiz() && canUploadNotes && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="text-amber-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-black text-amber-900 mb-2">Unlock Quiz Creation</h3>
                <p className="text-sm text-amber-800 font-medium mb-3">
                  To create quizzes, you need to earn Trusted status by:
                </p>
                <ul className="text-sm text-amber-800 space-y-1 font-medium">
                  <li>• Upload high-quality notes consistently</li>
                  <li>• Get your content verified by admins</li>
                  <li>• Build engagement with your contributions</li>
                  <li>• Or verify quizzes via AI chatbot</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render appropriate dashboard based on role
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          {renderGuestDashboard()}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (user.role) {
      case 'student':
        return renderStudentDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'online_educator':
        return renderOnlineEducatorDashboard();
      case 'community_contributor':
        return renderCommunityContributorDashboard();
      default:
        return renderStudentDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};
