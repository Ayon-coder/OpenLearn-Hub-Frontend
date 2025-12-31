
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Cloud,
  Award,
  BookOpen,
  Settings,
  Bell,
  Menu,
  X,
  PieChart,
  User as UserIcon,
  LogOut,
  Sparkles,
  FileQuestion,
  Compass,
  HardDrive,
  TrendingUp,
  Users
} from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { AuthRequiredModal } from '@/components/modals/AuthRequiredModal';
import { User } from '@/types';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
      : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalFeature, setAuthModalFeature] = useState('');

  useEffect(() => {
    const handleAuth = () => {
      const currentUser = authService.getUser();
      setUser(currentUser);
      if (currentUser) {
        setAuthModalOpen(false);
      }
    };
    window.addEventListener('auth-change', handleAuth);
    return () => window.removeEventListener('auth-change', handleAuth);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const handleRestrictedClick = (e: React.MouseEvent, feature: string) => {
    if (!user) {
      e.preventDefault();
      setAuthModalFeature(feature);
      setAuthModalOpen(true);
    }
  };

  if (location.pathname === '/login' || location.pathname === '/signup') return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        feature={authModalFeature}
      />

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                O
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">OpenLearn Hub</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
            <NavItem to="/" icon={<Home size={20} />} label="Dashboard" active={location.pathname === '/'} />
            <NavItem to="/trending" icon={<TrendingUp size={20} />} label="Trending Notes" active={location.pathname === '/trending'} />

            {/* Subscriptions - require auth */}
            {user ? (
              <NavItem to="/subscriptions" icon={<Users size={20} />} label="Subscriptions" active={location.pathname === '/subscriptions'} />
            ) : (
              <div onClick={(e) => handleRestrictedClick(e, 'Subscriptions')}>
                <NavItem to="#" icon={<Users size={20} />} label="Subscriptions" active={false} />
              </div>
            )}

            <NavItem to="/hub" icon={<BookOpen size={20} />} label="Community Notes" active={location.pathname.startsWith('/hub')} />

            {/* Accessible to all - guests can browse */}
            <NavItem to="/my-drive" icon={<HardDrive size={20} />} label="My Drive" active={location.pathname === '/my-drive'} />
            <NavItem to="/browse" icon={<Compass size={20} />} label="Browse Paths" active={location.pathname === '/browse'} />
            <NavItem to="/leaderboard" icon={<Award size={20} />} label="Contributors" active={location.pathname === '/leaderboard'} />

            {/* Restricted features - require auth */}
            {user ? (
              <>
                <NavItem to="/quiz/create" icon={<FileQuestion size={20} />} label="Create Quiz" active={location.pathname === '/quiz/create'} />
                <NavItem to="/ai-assistant" icon={<Sparkles size={20} />} label="AI Assistant" active={location.pathname === '/ai-assistant'} />
              </>
            ) : (
              <>
                <div onClick={(e) => handleRestrictedClick(e, 'Create Quiz')}>
                  <NavItem to="#" icon={<FileQuestion size={20} />} label="Create Quiz" active={false} />
                </div>
                <div onClick={(e) => handleRestrictedClick(e, 'AI Assistant')}>
                  <NavItem to="#" icon={<Sparkles size={20} />} label="AI Assistant" active={false} />
                </div>
              </>
            )}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <NavItem to="/profile" icon={<UserIcon size={20} />} label="Profile" active={location.pathname === '/profile'} />
            <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" active={location.pathname === '/settings'} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -ml-2 text-gray-600">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search subjects, topics or personal notes..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-full text-sm transition-all focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white hover:scale-105 transition-transform"
              >
                {user?.avatar || user?.name?.charAt(0) || 'U'}
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 mb-2">
                      <p className="text-sm font-black text-gray-900">{user?.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.role}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserIcon size={16} /> <span>View Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={16} /> <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-2"
                    >
                      <LogOut size={16} /> <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
