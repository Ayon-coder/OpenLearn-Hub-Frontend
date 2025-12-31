import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardDrive, Folder, FileText, ChevronRight, ChevronDown, Upload as UploadIcon, Download, Globe, Lock, Search, ArrowLeft, Home, MoreVertical, Edit, Youtube, PlayCircle, Share2, Trash2 } from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { driveSyncService } from '@/services/drive/driveSyncService';
import { EnhancedContentCard } from '@/components/content/EnhancedContentCard';
import { DemoContent } from '@/data/demoContents';

interface DriveExplorerProps {
    userId: string;
}

// Types for our file system
interface FileNode {
    type: 'file';
    id: string;
    name: string;
    size: string;
    savedAt: string;
    data: any;
}

interface FolderNode {
    type: 'folder';
    name: string;
    path: string; // Full path for reference
    children: { [key: string]: FolderNode | FileNode };
}

type FileSystemItem = FolderNode | FileNode;

export const DriveExplorer: React.FC<DriveExplorerProps> = ({ userId }) => {
    const [activeTab, setActiveTab] = useState<'community-uploads' | 'course-uploads' | 'community-downloads' | 'course-downloads'>('community-downloads');
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const user = authService.getUser();

    // Check if user can upload (Bronze community contributors cannot)
    const canUpload = user ? authService.canUploadNotes(user) : true;

    // Real data state
    const [realItems, setRealItems] = useState<any[]>([]);

    useEffect(() => {
        const loadRealData = () => {
            const items = driveSyncService.getDriveItems();
            setRealItems(items);
        };

        loadRealData();
        window.addEventListener('drive-sync', loadRealData);
        return () => window.removeEventListener('drive-sync', loadRealData);
    }, []);

    // Transform flat items to folder structure
    const driveData = useMemo(() => {
        // Initialize empty structure
        const data = {
            'community-uploads': [] as any[],
            'course-uploads': [] as any[],
            'community-downloads': [] as any[],
            'course-downloads': [] as any[]
        };

        realItems.forEach(item => {
            // Determine category
            let category: keyof typeof data = 'community-uploads';
            if (item.source === 'Uploaded') {
                category = item.isCourseContent ? 'course-uploads' : 'community-uploads';
            } else {
                category = item.isCourseContent ? 'course-downloads' : 'community-downloads';
            }

            // Construct path: Subject/Topic/Subtopic
            // We use names instead of IDs for the visible path
            const path = `${item.subjectName}/${item.topicName}/${item.subtopicName}`;

            // Find or create folder group
            let folderGroup = data[category].find(g => g.path === path);
            if (!folderGroup) {
                folderGroup = {
                    path: path,
                    notes: []
                };
                data[category].push(folderGroup);
            }

            // Add file to group
            folderGroup.notes.push({
                id: item.id,
                fileName: item.name,
                savedAt: item.timestamp.split(',')[0], // Just date part
                size: item.size || 'Unknown',
                fileType: item.mimeType === 'application/pdf' ? 'pdf' : 'file',
                url: item.firebaseUrl // Keep reference if available
            });
        });

        return data;
    }, [realItems]);

    // Helper to build the file tree from flat paths
    const fileTree = useMemo(() => {
        const root: FolderNode = { type: 'folder', name: 'root', path: '', children: {} };
        const categoryData = driveData[activeTab] || [];

        categoryData.forEach(item => {
            const parts = item.path.split('/');
            let current = root;

            // Build folder structure
            parts.forEach((part: string, index: number) => {
                if (!current.children[part]) {
                    const newPath = parts.slice(0, index + 1).join('/');
                    current.children[part] = {
                        type: 'folder',
                        name: part,
                        path: newPath,
                        children: {}
                    };
                }
                const nextNode = current.children[part];
                if (nextNode.type === 'folder') {
                    current = nextNode;
                }
            });

            // Add files to the leaf folder
            item.notes.forEach((note: any) => {
                current.children[note.id] = {
                    type: 'file',
                    id: note.id,
                    name: note.fileName,
                    size: note.size,
                    savedAt: note.savedAt,
                    data: { ...note, fileType: note.fileType || 'file' }
                };
            });
        });

        return root;
    }, [activeTab, driveData]);

    // Get contents of current path
    const folderContents = useMemo(() => {
        let current: FolderNode | FileNode = fileTree;
        for (const segment of currentPath) {
            if (current.type === 'folder' && current.children[segment]) {
                current = current.children[segment];
            } else {
                return []; // Should not happen if path is valid
            }
        }
        return current.type === 'folder' ? Object.values(current.children) : [];
    }, [fileTree, currentPath]);

    // Convert DriveItem (FileNode) to DemoContent for card display
    const convertToDemoContent = (fileNode: FileNode): DemoContent | null => {
        // Find the original DriveItem from realItems
        const driveItem = realItems.find(item => item.id === fileNode.id);
        if (!driveItem) return null;

        // Get actual user name instead of showing 'Unknown'
        const currentUser = authService.getUser();
        let uploaderName = 'Unknown';
        if (driveItem.uploadedBy) {
            if (driveItem.uploadedBy === currentUser?.id) {
                uploaderName = currentUser.name;
            } else {
                // For other users, try to get name from uploadedBy field or use ID
                uploaderName = driveItem.uploadedBy;
            }
        }

        // Create DemoContent object from DriveItem
        // For course content, include coursePath so the "Course" badge shows
        const isCourseContent = driveItem.isCourseContent === true;

        return {
            id: driveItem.contentId || driveItem.id,
            title: driveItem.title || fileNode.name.replace('.pdf', ''),
            description: driveItem.description || 'Downloaded content',
            organization: {
                primaryPath: isCourseContent ? 'course' : 'subject',
                subjectPath: !isCourseContent ? {
                    subject: driveItem.subjectName,
                    coreTopic: driveItem.topicName,
                    subtopic: driveItem.subtopicName,
                    resourceTitle: driveItem.title
                } : undefined,
                // Add coursePath for course content to show "Course" badge
                coursePath: isCourseContent ? {
                    provider: driveItem.subjectName || 'Course',  // Platform name (e.g., Udemy, YouTube)
                    instructor: uploaderName,
                    courseName: driveItem.topicName || 'Course',
                    topic: driveItem.subtopicName || 'Chapter',
                    resourceTitle: driveItem.title
                } : undefined
            },
            uploadedBy: uploaderName,
            uploadedAt: driveItem.timestamp || new Date().toISOString(),
            views: 0,
            likes: 0,
            downloads: 0,
            videoUrl: driveItem.videoUrl, // YouTube/verification URL will be used for thumbnail
            coverImage: driveItem.coverImage  // Fallback image when no video URL
        } as DemoContent;
    };

    // Handle navigation
    const enterFolder = (folderName: string) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const navigateUp = () => {
        setCurrentPath(currentPath.slice(0, -1));
    };

    const navigateToBreadcrumb = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    const handleTabChange = (newTab: typeof activeTab) => {
        setActiveTab(newTab);
        setCurrentPath([]); // Reset path on tab switch
    };

    const navigate = useNavigate();

    // Handle Edit
    const handleEdit = (e: React.MouseEvent, item: FileNode) => {
        e.stopPropagation();

        // Find the parent entry in mock data to get path info
        const sourceData = driveData[activeTab];
        let parentEntry = null;

        if (Array.isArray(sourceData)) {
            for (const entry of sourceData) {
                if (entry.notes.some((n: any) => n.id === item.id)) {
                    parentEntry = entry;
                    break;
                }
            }
        }

        if (!parentEntry) return;

        const pathParts = parentEntry.path.split('/');
        let initialData: any = {};

        if (activeTab === 'community-uploads') {
            // Path: Subject/Topic/Subtopic
            // We mock the IDs as the names for simplicity in this demo context
            initialData = {
                subject: { id: pathParts[0].toLowerCase(), name: pathParts[0] },
                topic: { id: pathParts[1].toLowerCase(), title: pathParts[1] },
                subtopic: { id: pathParts[2].toLowerCase(), title: pathParts[2] },
                title: item.name.replace(/\.[^/.]+$/, ""), // remove extension
                file: { name: item.name } // Mock file object
            };
        } else if (activeTab === 'course-uploads') {
            // Path: Platform/Course/Chapter
            initialData = {
                platform: pathParts[0],
                courseName: pathParts[1],
                chapter: pathParts[2],
                title: item.name.replace(/\.[^/.]+$/, ""),
                file: { name: item.name }
            };
        }

        navigate('/notes/upload', {
            state: {
                initialType: activeTab === 'community-uploads' ? 'community' : 'course',
                editMode: true,
                initialData
            }
        });
    };

    // Handle Share
    const handleShare = (e: React.MouseEvent, item: FileNode) => {
        e.stopPropagation();
        // In a real app, this would generate a public link
        const shareUrl = `https://openlearn.hub/share/${item.id}`;
        navigator.clipboard.writeText(shareUrl);
        alert(`Link copied to clipboard: ${shareUrl}`);
    };

    // Filter by search query
    const filteredContents = folderContents.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabs = [
        { id: 'community-downloads', label: 'Community Downloads', icon: <Download size={18} />, color: 'green' },
        { id: 'course-downloads', label: 'Course Downloads', icon: <Lock size={18} />, color: 'orange' },
        { id: 'community-uploads', label: 'Community Captures', icon: <Globe size={18} />, color: 'blue' },
        { id: 'course-uploads', label: 'Course Captures', icon: <Lock size={18} />, color: 'purple' }
    ];

    // Sort: Folders first, then files
    const sortedContents = [...filteredContents].sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
    });

    const isEditableTab = activeTab === 'community-uploads' || activeTab === 'course-uploads';

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-xl">
                            <HardDrive size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900">My Drive</h1>
                            <p className="text-gray-600 font-medium">Auto-organized notes library</p>
                        </div>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to clear all drive data? This cannot be undone.')) {
                                    driveSyncService.clearAll();
                                }
                            }}
                            className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                            title="Clear All Data (Debug)"
                        >
                            <Trash2 size={20} />
                        </button>
                        <div className="relative flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search in current folder..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as any)}
                            className={`p-6 rounded-2xl border-2 transition-all ${activeTab === tab.id
                                ? `border-${tab.color}-500 bg-${tab.color}-50 shadow-lg`
                                : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-3 mx-auto ${activeTab === tab.id ? `bg-${tab.color}-500 text-white` : 'bg-gray-100 text-gray-600'
                                }`}>
                                {tab.icon}
                            </div>
                            <p className={`text-sm font-bold text-center ${activeTab === tab.id ? `text-${tab.color}-700` : 'text-gray-600'
                                }`}>
                                {tab.label}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Browser Area */}
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">

                    {/* Breadcrumbs Toolbar */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2 overflow-x-auto">
                        <button
                            onClick={() => setCurrentPath([])}
                            className={`flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors ${currentPath.length === 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}
                        >
                            <Home size={18} />
                        </button>

                        {currentPath.map((folder, index) => (
                            <React.Fragment key={index}>
                                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                                <button
                                    onClick={() => navigateToBreadcrumb(index)}
                                    className={`px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap ${index === currentPath.length - 1
                                        ? 'bg-white shadow-sm font-bold text-gray-900'
                                        : 'text-gray-600 font-medium'
                                        }`}
                                >
                                    {folder}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex-1">
                        {currentPath.length > 0 && (
                            <div className="mb-4">
                                <button
                                    onClick={navigateUp}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors inline-flex"
                                >
                                    <ArrowLeft size={18} />
                                    <span>Back</span>
                                </button>
                            </div>
                        )}

                        {sortedContents.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                <Folder size={64} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium">Empty folder</p>
                            </div>
                        ) : (
                            <>
                                {/* Folders Grid */}
                                {sortedContents.some(item => item.type === 'folder') && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Folders</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {sortedContents.filter(item => item.type === 'folder').map((item) => (
                                                <div
                                                    key={item.name}
                                                    onClick={() => enterFolder(item.name)}
                                                    className="group relative p-4 rounded-2xl border transition-all cursor-pointer bg-blue-50/50 border-blue-100 hover:border-blue-300 hover:shadow-md hover:bg-blue-50"
                                                >
                                                    <div className="flex flex-col items-center text-center">
                                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600 mb-2">
                                                            <Folder size={24} />
                                                        </div>
                                                        <p className="font-bold text-gray-900 truncate w-full" title={item.name}>{item.name}</p>
                                                        <div className="flex items-center space-x-1 mt-1 text-xs text-blue-600 font-medium">
                                                            <span>Open</span>
                                                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Files as Content Cards */}
                                {sortedContents.some(item => item.type === 'file') && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Downloaded Notes</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {sortedContents.filter(item => item.type === 'file').map((item) => {
                                                if (item.type !== 'file') return null;
                                                const demoContent = convertToDemoContent(item);
                                                if (!demoContent) return null;

                                                return (
                                                    <div key={item.id}>
                                                        <EnhancedContentCard
                                                            content={demoContent}
                                                            onClick={() => {
                                                                // Navigate to the note page if contentId exists
                                                                if (demoContent.id) {
                                                                    navigate(`/note/${demoContent.id}`);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
