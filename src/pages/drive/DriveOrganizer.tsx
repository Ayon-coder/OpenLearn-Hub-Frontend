
import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Search,
  RefreshCw,
  FileText,
  Folder,
  Download,
  Upload,
  Check,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  Database,
  CloudOff,
  AlertCircle,
  RotateCw,
  Trash2
} from 'lucide-react';
import { driveSyncService } from '@/services/drive/driveSyncService';
import { DriveItem, DriveSource } from '@/types';

export const DriveOrganizer: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<DriveSource>(DriveSource.Uploaded);
  const [items, setItems] = useState<DriveItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadItems = () => {
    const all = driveSyncService.getDriveItems();
    setItems(all);
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('drive-sync', loadItems);
    return () => window.removeEventListener('drive-sync', loadItems);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    loadItems();
    setIsSyncing(false);
  };

  const handleRetryFailedSyncs = async () => {
    setIsSyncing(true);
    await driveSyncService.retryFailedSyncs();
    loadItems();
    setIsSyncing(false);
  };

  const getSyncStatusIcon = (status?: string) => {
    switch (status) {
      case 'synced':
        return <Cloud size={14} className="text-green-500" />;
      case 'pending':
        return <Cloud size={14} className="text-yellow-500 animate-pulse" />;
      case 'failed':
        return <CloudOff size={14} className="text-red-500" />;
      default:
        return <AlertCircle size={14} className="text-gray-400" />;
    }
  };

  const failedSyncsCount = items.filter(i => i.syncStatus === 'failed').length;

  const filteredItems = items.filter(item =>
    item.source === activeTab &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Database size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Drive Sync Engine</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Personal Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Your contributions and community downloads, organized by hierarchy.</p>
        </div>
        <div className="flex items-center space-x-3">
          {failedSyncsCount > 0 && (
            <button
              onClick={handleRetryFailedSyncs}
              disabled={isSyncing}
              className="bg-red-50 border-2 border-red-100 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center shadow-sm disabled:opacity-50"
            >
              <RotateCw size={18} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              Retry {failedSyncsCount} Failed
            </button>
          )}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={18} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing Vault...' : 'Refresh Vault'}
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all drive data? This cannot be undone.')) {
                driveSyncService.clearAll();
                loadItems();
              }
            }}
            className="bg-red-50 border-2 border-red-100 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-all shadow-sm"
            title="Clear All Data (Debug)"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Folder Analytics */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
              <Folder size={18} className="mr-2 text-blue-500" /> Subject Folders
            </h4>
            <div className="space-y-5">
              {[
                { name: 'Computer Science', count: items.filter(i => i.subjectId === 'cs').length, color: 'bg-blue-500' },
                { name: 'Mathematics', count: items.filter(i => i.subjectId === 'math').length, color: 'bg-indigo-500' },
                { name: 'Biology', count: items.filter(i => i.subjectId === 'bio').length, color: 'bg-emerald-500' },
              ].map((folder, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-700">{folder.name}</span>
                    <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{folder.count} Files</span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div className={`h-full ${folder.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, (folder.count / (items.length || 1)) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            {items.length === 0 && (
              <p className="text-center text-xs text-gray-400 mt-4 italic">No items synced yet.</p>
            )}
          </div>

          <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold mb-2 flex items-center">
                <Cloud size={18} className="mr-2 text-blue-200" /> Hierarchy Sync
              </h4>
              <p className="text-blue-100 text-xs mb-4 leading-relaxed">Files are automatically named and sorted following Level 1-3 categorization.</p>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 mb-4 font-mono text-[10px]">
                <div className="text-blue-300">Subject_Topic_Subtopic_Title.pdf</div>
              </div>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl text-xs font-black hover:bg-blue-50 transition-colors flex items-center justify-center">
                Configure Path Rules <ArrowUpRight size={14} className="ml-1" />
              </button>
            </div>
            <Cloud size={80} className="absolute -bottom-4 -right-4 text-white/5 group-hover:scale-125 transition-transform" />
          </div>
        </aside>

        {/* Main Content: Vault Sections */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 gap-4">
              <div className="flex bg-gray-200/50 p-1.5 rounded-2xl w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab(DriveSource.Uploaded)}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 text-sm font-black rounded-xl transition-all ${activeTab === DriveSource.Uploaded ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Upload size={16} />
                  <span>Uploaded ({items.filter(i => i.source === DriveSource.Uploaded).length})</span>
                </button>
                <button
                  onClick={() => setActiveTab(DriveSource.Downloaded)}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 text-sm font-black rounded-xl transition-all ${activeTab === DriveSource.Downloaded ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Download size={16} />
                  <span>Downloaded ({items.filter(i => i.source === DriveSource.Downloaded).length})</span>
                </button>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search vault..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 focus:ring-4 focus:ring-blue-100 rounded-xl text-sm transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6 border border-dashed border-gray-200">
                    <Database size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {activeTab === DriveSource.Uploaded ? 'No Contributions Yet' : 'No Community Downloads'}
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    {activeTab === DriveSource.Uploaded
                      ? 'Help the community by uploading resources in Start Contribution. They will appear here automatically.'
                      : 'Download verified resources from the Hub to sync them to your personal vault.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredItems.map((file) => (
                    <div key={file.id} className="p-6 hover:bg-gray-50/80 transition-all flex items-center group">
                      <div className="p-4 bg-gray-50 text-blue-600 rounded-2xl mr-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors leading-tight">
                            {file.name}
                          </h5>
                          {getSyncStatusIcon(file.syncStatus)}
                        </div>
                        <div className="flex flex-wrap items-center mt-2 gap-3">
                          <span className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <Folder size={12} className="mr-1" /> {file.subjectName} / {file.topicName}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{file.timestamp}</span>
                          {file.isCourseContent && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Course</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${file.source === DriveSource.Uploaded
                          ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                          : 'border-blue-100 bg-blue-50 text-blue-600'
                          }`}>
                          {file.source}
                        </span>
                        <button className="p-2.5 text-gray-400 hover:bg-white hover:text-gray-600 rounded-xl transition-all shadow-sm">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">{items.length}</span> items in your total knowledge pool
              </div>
              <div className="flex space-x-2">
                <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-black rounded-xl hover:shadow-md transition-all">
                  Bulk Export Folders
                </button>
                <button className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                  Verify Cloud Integrity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
