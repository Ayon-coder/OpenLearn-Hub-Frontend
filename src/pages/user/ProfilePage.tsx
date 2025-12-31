
import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Award,
  TrendingUp,
  Flame,
  Cloud,
  Settings,
  Edit3,
  LogOut,
  CheckCircle2,
  Clock,
  Database,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { driveSyncService } from '@/services/drive/driveSyncService';
import { TrustLevelIndicator } from '@/components/ui/TrustLevelIndicator';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getUser());
  const [driveItems, setDriveItems] = useState(driveSyncService.getDriveItems());
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  useEffect(() => {
    const handleAuth = () => setUser(authService.getUser());
    window.addEventListener('auth-change', handleAuth);
    return () => window.removeEventListener('auth-change', handleAuth);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSaveProfile = () => {
    authService.updateProfile({ name: newName });
    setIsEditing(false);
  };

  if (!user) return null;

  const uploadedCount = driveItems.filter(i => i.source === 'Uploaded').length;
  const downloadedCount = driveItems.filter(i => i.source === 'Downloaded').length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-6xl mx-auto pb-24">
      {/* Hero Profile Section */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>
        <div className="px-12 pb-12 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-end space-x-8">
              <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                <div className="w-full h-full bg-gray-100 rounded-[2rem] flex items-center justify-center text-4xl font-black text-blue-600 border border-gray-50">
                  {user.avatar || user.name.charAt(0)}
                </div>
              </div>
              <div className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                    {user.role}
                  </span>
                  <span className="flex items-center text-xs text-gray-400 font-bold">
                    <Calendar size={14} className="mr-1.5" /> Joined {user.joinedDate}
                  </span>
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      className="text-4xl font-black text-gray-900 border-b-4 border-blue-600 outline-none bg-transparent py-1"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      autoFocus
                    />
                    <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black">Save</button>
                  </div>
                ) : (
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                )}
                <p className="text-gray-500 font-medium mt-1 flex items-center"><Mail size={16} className="mr-2" /> {user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 pb-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 bg-gray-50 text-gray-600 px-6 py-3.5 rounded-2xl font-black hover:bg-gray-100 transition-all border border-gray-100"
              >
                <Edit3 size={18} /> <span>Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 text-red-600 px-6 py-3.5 rounded-2xl font-black hover:bg-red-100 transition-all border border-red-100"
              >
                <LogOut size={18} /> <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Reputation */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center uppercase tracking-widest text-[11px] text-gray-400">
              <Award size={18} className="mr-3 text-amber-500" /> Reputation & Badges
            </h3>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-4xl font-black text-gray-900">{user.reputation}</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Impact Score</p>
              </div>
              <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl">
                <TrendingUp size={32} />
              </div>
            </div>
            <div className="space-y-4">
              {user.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                    <Award size={20} />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">{badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <h3 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-6 flex items-center">
              <Flame size={16} className="mr-2 text-orange-400" /> Current Streak
            </h3>
            <div className="relative z-10">
              <p className="text-6xl font-black mb-2">12</p>
              <p className="text-indigo-200 font-bold">Days Contribution Streak</p>
              <div className="mt-8 pt-8 border-t border-indigo-800">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Next Milestone</p>
                <p className="text-sm font-bold mt-2">15 Day Badge • <span className="text-indigo-300">3 days to go</span></p>
              </div>
            </div>
            <Flame size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-125 transition-transform" />
          </div>

          {/* Community Contributor Warning */}
          {user.role === 'community_contributor' && (
            <div className="bg-red-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-red-200 relative overflow-hidden border-2 border-red-700">
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-3 bg-red-800 rounded-2xl">
                  <AlertTriangle size={24} className="text-red-200" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-red-100 mb-2">⚠️ Community Guidelines</h3>
                  <p className="text-sm text-red-200 font-medium leading-relaxed">
                    Spam, plagiarism, or any form of misconduct will result in <span className="font-black text-white">permanent account suspension</span> without warning.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-red-800">
                <p className="text-xs font-bold text-red-300 uppercase tracking-widest mb-3">Prohibited Actions:</p>
                <ul className="space-y-2 text-sm text-red-200">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Uploading spam or irrelevant content</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Plagiarizing or copying without attribution</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Harassment or abusive behavior</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Vote manipulation or fake engagement</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Activity & Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Community Contributor Trust Level */}
          {user.role === 'community_contributor' && user.communityMetrics && (
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center uppercase tracking-widest text-[11px] text-gray-400">
                <Award size={18} className="mr-3 text-orange-500" /> Your Trust Level
              </h3>
              <TrustLevelIndicator metrics={user.communityMetrics} showDetails={true} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Cloud size={24} />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Vault Usage</span>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{uploadedCount + downloadedCount}</p>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px]">Total Synced Resources</p>
              <div className="mt-6 h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Database size={24} />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Drive</span>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">My Drive</p>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px]">Primary Storage Provider</p>
              <div className="mt-6 flex items-center text-xs text-emerald-600 font-black uppercase tracking-widest">
                <CheckCircle2 size={14} className="mr-1.5" /> Fully Synced
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-xl tracking-tight">Recent Contribution Activity</h3>
              <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View History</button>
            </div>
            <div className="divide-y divide-gray-50">
              {driveItems.slice(0, 5).map((item) => (
                <div key={item.id} className="p-8 hover:bg-gray-50 transition-all flex items-center justify-between group">
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 rounded-2xl ${item.source === 'Uploaded' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'} group-hover:scale-110 transition-transform`}>
                      <Database size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center">
                        <Clock size={12} className="mr-1.5" /> {item.timestamp} • {item.subjectName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${item.source === 'Uploaded' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                      {item.source}
                    </span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
              {driveItems.length === 0 && (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Database size={24} />
                  </div>
                  <p className="text-gray-500 font-bold">No recent activity detected.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
