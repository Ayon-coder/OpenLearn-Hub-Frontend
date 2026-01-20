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
  Folder,
  Compass,
  Sparkles,
  ArrowRight,
  GraduationCap,
  CalendarDays
} from 'lucide-react';
import { driveSyncService } from '@/services/drive/driveSyncService';
import { curriculumService, SavedCurriculum } from '@/services/curriculum/curriculumService';
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
  color?: 'blue' | 'orange' | 'purple' | 'pink' | 'indigo' | 'yellow' | 'sky' | 'emerald' | 'green';
}

const colorVariants = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', hoverBorder: 'hover:border-blue-200', hoverShadow: 'hover:shadow-blue-900/5', groupHoverBg: 'group-hover:bg-blue-100' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', hoverBorder: 'hover:border-orange-200', hoverShadow: 'hover:shadow-orange-900/5', groupHoverBg: 'group-hover:bg-orange-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', hoverBorder: 'hover:border-purple-200', hoverShadow: 'hover:shadow-purple-900/5', groupHoverBg: 'group-hover:bg-purple-100' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', hoverBorder: 'hover:border-pink-200', hoverShadow: 'hover:shadow-pink-900/5', groupHoverBg: 'group-hover:bg-pink-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', hoverBorder: 'hover:border-indigo-200', hoverShadow: 'hover:shadow-indigo-900/5', groupHoverBg: 'group-hover:bg-indigo-100' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', hoverBorder: 'hover:border-yellow-200', hoverShadow: 'hover:shadow-yellow-900/5', groupHoverBg: 'group-hover:bg-yellow-100' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', hoverBorder: 'hover:border-sky-200', hoverShadow: 'hover:shadow-sky-900/5', groupHoverBg: 'group-hover:bg-sky-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hoverBorder: 'hover:border-emerald-200', hoverShadow: 'hover:shadow-emerald-900/5', groupHoverBg: 'group-hover:bg-emerald-100' },
  green: { bg: 'bg-green-50', text: 'text-green-600', hoverBorder: 'hover:border-green-200', hoverShadow: 'hover:shadow-green-900/5', groupHoverBg: 'group-hover:bg-green-100' },
};

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick, enabled, lockReason, color = 'blue' }) => {
  const styles = colorVariants[color];

  return (
    <div className="relative group h-full">
      <button
        onClick={enabled ? onClick : undefined}
        disabled={!enabled}
        className={`w-full h-full p-6 rounded-2xl border transition-all text-left flex flex-col ${enabled
          ? `bg-white border-gray-100 ${styles.hoverBorder} hover:shadow-xl ${styles.hoverShadow} cursor-pointer transform hover:-translate-y-1`
          : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
          }`}
      >
        <div className="flex items-start justify-between mb-4 w-full">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${enabled
            ? `${styles.bg} ${styles.text} ${styles.groupHoverBg}`
            : 'bg-gray-100 text-gray-400'
            }`}>
            {enabled ? icon : <Lock size={24} />}
          </div>
        </div>
        <div className="mt-auto">
          <h3 className="font-bold text-gray-900 mb-1 text-lg group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">{description}</p>
        </div>
      </button>

      {!enabled && lockReason && (
        <div className="absolute top-0 right-0 left-0 bottom-0 z-20 hidden group-hover:flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center cursor-not-allowed animate-in fade-in duration-200">
          <div className="bg-gray-900/95 backdrop-blur-md text-white text-xs p-4 rounded-xl font-medium shadow-xl max-w-[95%] border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2 text-yellow-400">
              <Lock size={14} className="animate-pulse" />
              <span className="uppercase tracking-wider text-[10px] font-bold">Locked</span>
            </div>
            <p className="leading-relaxed">{lockReason}</p>
            {lockReason.includes('500') && (
              <div className="mt-2 text-[10px] text-gray-400 bg-white/5 rounded px-2 py-1">
                💡 Tip: Upload notes & get likes!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center mb-4 shadow-sm`}>
      {icon}
    </div>
    <div className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{value}</div>
    <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">{label}</div>
  </div>
);

const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-gray-500 font-medium mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalFeature, setAuthModalFeature] = useState('');
  const [driveItems, setDriveItems] = useState<DriveItem[]>([]);
  const [userCurricula, setUserCurricula] = useState<SavedCurriculum[]>([]);
  const [loadingCurricula, setLoadingCurricula] = useState(false);

  React.useEffect(() => {
    setDriveItems(driveSyncService.getDriveItems());

    const handleSync = () => setDriveItems(driveSyncService.getDriveItems());
    window.addEventListener('drive-sync', handleSync);
    return () => window.removeEventListener('drive-sync', handleSync);
  }, []);

  React.useEffect(() => {
    if (user) {
      setLoadingCurricula(true);
      curriculumService.getUserCurricula(user.id)
        .then(data => setUserCurricula(data))
        .catch(err => console.error('Failed to load curricula', err))
        .finally(() => setLoadingCurricula(false));
    }
  }, [user]);

  const handleRestrictedAction = (feature: string, path: string) => {
    if (!user) {
      setAuthModalFeature(feature);
      setAuthModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const getUploadLockReason = () => {
    if (!user) return 'Sign in required';
    if (user.role === 'community_contributor' && !authService.canUploadNotes(user)) {
      return 'Reach Silver First';
    }
    if (user.role === 'student') return '500 points required';
    return user ? 'Verification required' : 'Login required';
  };

  const canCreateQuiz = () => {
    if (!user) return false;
    if (user.role === 'teacher' || user.role === 'online_educator') return true;
    if (user.role === 'community_contributor') return user.communityMetrics?.trustLevel !== 'bronze';
    if (user.role === 'student') return authService.canCreateQuizzes(user);
    return false;
  };

  const getQuizLockReason = () => {
    if (!user) return 'Sign in required';
    if (user.role === 'community_contributor' && user.communityMetrics?.trustLevel === 'bronze') {
      return 'Reach Silver First';
    }
    if (user.role === 'student' && !authService.canCreateQuizzes(user)) {
      return 'Verify First: Gain 500 reputation points to verify yourself.';
    }
    return undefined;
  };

  const canUpload = user && authService.canUploadNotes(user);

  const commonActions = (
    <>
      <ActionCard
        icon={<TrendingUp />}
        title="Trending Notes"
        description="Explore what's popular"
        onClick={() => navigate('/trending')}
        enabled={true}
        color="orange"
      />
      <ActionCard
        icon={<BookOpen />}
        title="Community Notes"
        description="Hub of knowledge"
        onClick={() => navigate('/hub')}
        enabled={true}
        color="purple"
      />
      <ActionCard
        icon={<Users />}
        title="Subscriptions"
        description="Creators you follow"
        onClick={() => navigate('/subscriptions')}
        enabled={true}
        color="pink"
      />
      <ActionCard
        icon={<HardDrive />}
        title="My Drive"
        description="Manage your files"
        onClick={() => navigate('/my-drive')}
        enabled={true}
        color="blue"
      />
      <ActionCard
        icon={<Compass />}
        title="Browse Paths"
        description="Structured learning"
        onClick={() => navigate('/browse')}
        enabled={true}
        color="indigo"
      />
      <ActionCard
        icon={<Award />}
        title="Contributors"
        description="Leaderboard & Top Users"
        onClick={() => navigate('/leaderboard')}
        enabled={true}
        color="yellow"
      />
      <ActionCard
        icon={<Sparkles />}
        title="AI Assistant"
        description="Chat & Concept Mirror"
        onClick={() => navigate('/ai-assistant')}
        enabled={!!user}
        lockReason="Sign in required"
        color="sky"
      />
      <ActionCard
        icon={<FileQuestion />}
        title="Create Quiz"
        description="Test yourself & others"
        onClick={() => navigate('/quiz/create')}
        enabled={canCreateQuiz()}
        lockReason={getQuizLockReason()}
        color="emerald"
      />
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <AuthRequiredModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          feature={authModalFeature}
        />

        {/* Welcome Header */}
        {user ? (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl shadow-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome back, {user.name}! 👋</h1>
                <p className="text-gray-300 font-medium mb-6 flex items-center gap-2">
                  You are logged in as a <span className="text-white font-bold capitalize bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">{user.role.replace('_', ' ')}</span>
                </p>
                <div className="flex flex-wrap gap-4">
                  {user.university && (
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/10 flex items-center gap-2">
                      <span className="text-gray-400">University</span>
                      <span className="font-bold border-l border-white/20 pl-2">{user.university}</span>
                    </div>
                  )}
                  {user.communityMetrics && (
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/10 flex items-center gap-2">
                      <span className="text-gray-400">Trust Level</span>
                      <span className="font-bold capitalize text-yellow-400 border-l border-white/20 pl-2">{user.communityMetrics.trustLevel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Upload Action */}
              <button
                onClick={() => canUpload ? navigate('/notes/upload') : null}
                className={`group flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 shadow-lg ${canUpload
                  ? 'bg-white text-gray-900 hover:scale-105 hover:shadow-xl hover:shadow-white/20 cursor-pointer'
                  : 'bg-white/10 text-gray-400 border border-white/10 cursor-not-allowed hover:bg-white/15'
                  }`}
              >
                <div className={`p-2 rounded-xl ${canUpload ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                  {canUpload ? <Upload size={20} /> : <Lock size={20} />}
                </div>
                <div className="text-left">
                  <div className={`font-bold text-sm ${canUpload ? 'text-gray-900 group-hover:text-blue-600' : 'text-gray-300'}`}>
                    {canUpload ? 'Upload Notes' : 'Upload Locked'}
                  </div>
                  <div className="text-xs font-medium opacity-70">
                    {canUpload ? 'Share your knowledge' : getUploadLockReason()}
                  </div>
                </div>
                {canUpload && <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
            <h1 className="text-3xl font-black mb-2">Welcome to OpenLearn Hub! 🚀</h1>
            <p className="text-blue-100 font-medium">Join our community to start your learning journey.</p>
          </div>
        )}

        {/* My Learning Paths (New Section) */}
        {user && userCurricula.length > 0 && (
          <div>
            <SectionHeader
              title="My Learning Paths"
              subtitle="Continue where you left off"
              action={
                <button onClick={() => navigate('/curriculum/generate')} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                  <span>+ New Path</span>
                </button>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCurricula.map((curriculum) => (
                <div
                  key={curriculum.id}
                  onClick={() => navigate(`/curriculum/result/${curriculum.id}`)}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-2xl -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <GraduationCap size={24} />
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {curriculum.curriculum.student_profile?.weekly_hours || 10}h / week
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {curriculum.formData.learning_goal}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={16} />
                        <span>{new Date(curriculum.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 size={16} />
                        <span>{curriculum.curriculum.student_profile?.estimated_weeks || 4} Weeks</span>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                      <span>Resume Learning</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div>
          <SectionHeader title="Quick Actions" subtitle="Everything you need, right at your fingertips." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <ActionCard
              icon={<Upload />}
              title="Upload Notes"
              description="Share content"
              onClick={() => navigate('/notes/upload')}
              enabled={!!canUpload}
              lockReason={getUploadLockReason()}
              color="green"
            />
            {commonActions}
          </div>
        </div>

        {/* My Drive Snapshot (If logged in) */}
        {user && (
          <div>
            <SectionHeader
              title="My Drive Snapshot"
              subtitle="Recent activity and storage summary"
              action={
                <button onClick={() => navigate('/my-drive')} className="text-blue-600 font-bold hover:underline">
                  View Full Drive →
                </button>
              }
            />
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard
                icon={<HardDrive />}
                label="Total Items"
                value={driveItems.length.toString()}
                color="bg-blue-500"
              />
              <StatCard
                icon={<Download />}
                label="Downloaded"
                value={driveItems.filter(i => i.source === 'downloaded').length.toString()}
                color="bg-green-500"
              />
              <StatCard
                icon={<Upload />}
                label="Uploaded"
                value={driveItems.filter(i => i.source === 'uploaded').length.toString()}
                color="bg-purple-500"
              />
              <StatCard
                icon={<Star />}
                label="Favorites"
                value={driveItems.filter(i => false).length.toString()} // Placeholder
                color="bg-yellow-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
