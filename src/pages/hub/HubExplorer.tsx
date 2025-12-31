
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Globe,
  ChevronRight,
  Plus,
  BookOpen,
  Users,
  Search,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Lock,
  Info
} from 'lucide-react';
import { INITIAL_SUBJECTS } from '@/constants';
import { AuthRequiredModal } from '@/components/modals/AuthRequiredModal';
import { authService } from '@/services/auth/authService';

export const HubExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const user = authService.getUser();

  // Check upload permissions for community contributors
  const canUploadNotes = user ? authService.canUploadNotes(user) : true; // Default true for non-community contributors
  const isCommunityCont = user?.role === 'community_contributor';
  const isBronze = isCommunityCont && user?.communityMetrics?.trustLevel === 'bronze';

  const handleStartContribution = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else if (canUploadNotes) {
      navigate('/notes/upload', { state: { initialType: 'community' } });
    }
  };

  const filteredSubjects = INITIAL_SUBJECTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        feature="Start Contribution"
      />

      {/* Upload Wizard Modal - Removed as we now navigate to /notes/upload */}
      <section className="relative overflow-hidden bg-white px-8 py-12 md:px-16 md:py-20 rounded-[3rem] border border-gray-100 shadow-sm group">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black mb-8 uppercase tracking-widest border border-blue-100">
            <Sparkles size={14} />
            <span>Academic Infrastructure 2.0</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Universal Curriculum</span>.
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium">
            A strictly organized, community-verified library of knowledge. Drill down from broad Subjects into granular Subtopics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search the global hierarchy..."
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative group">
              <button
                onClick={handleStartContribution}
                disabled={!user && false}
                className={`px-10 py-5 rounded-[2rem] font-black shadow-2xl transition-all flex items-center justify-center whitespace-nowrap ${canUploadNotes || !user
                  ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 cursor-pointer'
                  : 'bg-gray-300 text-gray-600 shadow-gray-200 cursor-not-allowed opacity-75'
                  }`}
              >
                {canUploadNotes || !user ? (
                  <>
                    <Plus size={24} className="mr-2" /> Start Contribution
                  </>
                ) : (
                  <>
                    <Lock size={24} className="mr-2" />
                    {user?.role === 'community_contributor'
                      ? 'Locked - Silver+ Only'
                      : 'Verification Required'}
                  </>
                )}
              </button>
              {!canUploadNotes && user && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 font-medium whitespace-normal">
                  <div className="flex items-start space-x-2">
                    <Info size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      {user.role === 'community_contributor'
                        ? 'Bronze contributors cannot upload. Reach Silver level (40+ trust score) through community engagement.'
                        : 'You need to verify your account before you can contribute notes. Go to your dashboard to verify.'
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bronze Level Warning Banner */}
        {isBronze && (
          <div className="mt-8 bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-black text-orange-900 mb-2">🥉 Bronze Level - Build Your Trust to Contribute</h3>
                <p className="text-sm text-orange-800 font-medium mb-2">
                  You're currently at Bronze level (Trust Score: {user?.communityMetrics?.trustScore || 0}/100).
                  To unlock contributions, reach Silver level (40+ trust score) by engaging with the community.
                </p>
                <p className="text-xs text-orange-700 font-bold">
                  💡 Browse notes, comment, and receive upvotes to increase your trust score!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Abstract Pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none"></div>
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-blue-50/80 transition-colors"></div>
      </section>

      {/* Stats Quick-Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 mt-12">
        {[
          { label: 'Total Subjects', value: '18', icon: <Layers size={18} /> },
          { label: 'Active Learners', value: '42.5k', icon: <Users size={18} /> },
          { label: 'Verified Topics', value: '1,240', icon: <BookOpen size={18} /> },
          { label: 'Community Syncs', value: '180k', icon: <TrendingUp size={18} /> },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-6 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subjects Grid */}
      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredSubjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/hub/subject/${subject.id}`}
            className="group bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 flex flex-col overflow-hidden"
          >
            <div className="p-12">
              <div className="flex items-center justify-between mb-10">
                <div className={`p-5 rounded-[1.5rem] transition-all duration-500 ${subject.icon === 'Cpu' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600' :
                  subject.icon === 'Layers' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600' :
                    'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600'
                  } group-hover:text-white group-hover:rotate-6 shadow-sm`}>
                  {subject.icon === 'Cpu' ? <Cpu size={40} /> : subject.icon === 'Layers' ? <Layers size={40} /> : <Globe size={40} />}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Curriculum Depth</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-blue-600 transition-colors tracking-tight">
                {subject.name}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10 h-12 line-clamp-2">
                {subject.description}
              </p>

              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Topics</span>
                  <span className="text-lg font-black text-gray-900">24</span>
                </div>
                <div className="w-px h-8 bg-gray-100"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experts</span>
                  <span className="text-lg font-black text-gray-900">142</span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-10 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                Drill Down Hierarchy
              </span>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <ChevronRight size={24} />
              </div>
            </div>
          </Link>
        ))}

        {/* Propose Card */}
        <div className="relative group h-full">
          <button
            onClick={canUploadNotes ? () => console.log('Propose subject feature coming soon') : undefined}
            disabled={!canUploadNotes}
            className={`w-full h-full rounded-[3rem] border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[420px] ${canUploadNotes
              ? 'bg-gray-50/50 border-gray-200 hover:bg-white hover:border-blue-400 cursor-pointer'
              : 'bg-gray-100/50 border-gray-300 cursor-not-allowed opacity-60'
              }`}
          >
            <div className={`w-20 h-20 rounded-full border flex items-center justify-center mb-6 shadow-sm transition-all ${canUploadNotes
              ? 'bg-white border-gray-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white'
              : 'bg-gray-200 border-gray-300 text-gray-500'
              }`}>
              {canUploadNotes ? <Plus size={36} /> : <Lock size={36} />}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
              {canUploadNotes
                ? 'Missing a Subject?'
                : user?.role === 'community_contributor'
                  ? 'Locked - Silver+ Only'
                  : 'Verification Required'
              }
            </h3>
            <p className="text-gray-500 font-medium max-w-[240px] mb-8 leading-relaxed text-sm">
              {canUploadNotes
                ? 'Help expand the hub by proposing a new top-level field of study.'
                : user?.role === 'community_contributor'
                  ? 'Reach Silver level to propose new subjects and contribute.'
                  : 'Verify your student profile to unlock contribution features.'
              }
            </p>
            {canUploadNotes && (
              <div className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center">
                Propose Now <ArrowUpRight size={14} className="ml-2" />
              </div>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
