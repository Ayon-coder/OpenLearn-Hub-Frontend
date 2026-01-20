
import { DriveItem, DriveSource, Subject, Topic, Subtopic } from '@/types';
import { syncMetadataToFirestore } from '@/services/storage/firebaseStorageService';

const DRIVE_STORAGE_KEY_PREFIX = 'openlearn_drive_items_user_';

// Get current user ID
function getCurrentUserId(): string | null {
  const userStr = localStorage.getItem('openlearn_auth_user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.id;
  } catch {
    return null;
  }
}

// Get user-scoped storage key for drive items
function getDriveStorageKey(): string {
  const userId = getCurrentUserId();
  if (userId) {
    return `${DRIVE_STORAGE_KEY_PREFIX}${userId}`;
  }
  // Fallback to generic key for guests (should not happen in practice)
  return 'openlearn_drive_items_guest';
}

export const driveSyncService = {
  getDriveItems(): DriveItem[] {
    const storageKey = getDriveStorageKey();
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  },

  async syncContribution(data: {
    subject: Subject | { name: string, id: string };
    topic: Topic | { title: string, id: string };
    subtopic: Subtopic | { title: string, id: string };
    title: string;
    description?: string;
    videoUrl?: string;
    coverImage?: string;
    contentId?: string;
    quiz?: any;
    isCourseContent?: boolean;
  }) {
    const items = this.getDriveItems();
    const fileName = `${data.subject.name}_${data.topic.title}_${data.subtopic.title}_${data.title}`.replace(/\s+/g, '_');
    const userId = getCurrentUserId();

    const newItem: DriveItem = {
      id: `up_${Date.now()}`,
      name: `${fileName}.pdf`,
      subjectId: data.subject.id,
      topicId: data.topic.id,
      subtopicId: data.subtopic.id,
      subjectName: data.subject.name,
      topicName: data.topic.title,
      subtopicName: data.subtopic.title,
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      coverImage: data.coverImage,  // Fallback thumbnail
      contentId: data.contentId || `up_${Date.now()}`,
      source: DriveSource.Uploaded,
      timestamp: new Date().toLocaleString(),
      mimeType: 'application/pdf',
      size: '1.2 MB',
      // Firestore fields
      syncStatus: 'pending',
      uploadedBy: userId || undefined,
      isCourseContent: data.isCourseContent || false,
      allowLocalDownload: true // Own uploads are always downloadable
    };

    try {
      // Strip large base64 images from localStorage to save space
      const storageItem = { ...newItem };
      if (storageItem.coverImage && storageItem.coverImage.startsWith('data:image') && storageItem.coverImage.length > 5000) {
        storageItem.coverImage = undefined;
      }

      // Also sanitize existing items if they happen to have large images (migration)
      const safeItems = [storageItem, ...items].map(item => {
        if (item.coverImage && item.coverImage.startsWith('data:image') && item.coverImage.length > 5000) {
          return { ...item, coverImage: undefined };
        }
        return item;
      });

      localStorage.setItem(getDriveStorageKey(), JSON.stringify(safeItems));
    } catch (e) {
      console.error('Failed to save drive item to localStorage', e);
    }
    window.dispatchEvent(new Event('drive-sync'));

    // Sync to Firestore in background
    if (userId) {
      this.syncToFirestoreBackground(newItem);
    }
  },

  async syncDownload(data: {
    subject: Subject;
    topic: Topic;
    subtopic: Subtopic;
    title: string;
    description?: string;
    videoUrl?: string;
    contentId?: string;
    isCourseContent?: boolean;
    uploadedBy?: string;
  }) {
    const items = this.getDriveItems();
    const userId = getCurrentUserId();

    // Check if already downloaded to prevent duplicates
    const exists = items.find(i =>
      i.source === DriveSource.Downloaded &&
      i.title === data.title &&
      i.subtopicId === data.subtopic.id
    );
    if (exists) return;

    const fileName = `${data.subject.name}_${data.topic.title}_${data.subtopic.title}_${data.title}`.replace(/\s+/g, '_');

    // Determine if local download should be allowed
    const isOwnContent = data.uploadedBy === userId;
    const allowLocalDownload = !data.isCourseContent || isOwnContent;

    const newItem: DriveItem = {
      id: `dl_${Date.now()}`,
      name: `${fileName}.pdf`,
      subjectId: data.subject.id,
      topicId: data.topic.id,
      subtopicId: data.subtopic.id,
      subjectName: data.subject.name,
      topicName: data.topic.title,
      subtopicName: data.subtopic.title,
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      contentId: data.contentId,
      source: DriveSource.Downloaded,
      timestamp: new Date().toLocaleString(),
      mimeType: 'application/pdf',
      size: '850 KB',
      // Firestore fields
      syncStatus: 'pending',
      uploadedBy: data.uploadedBy,
      isCourseContent: data.isCourseContent || false,
      allowLocalDownload
    };

    localStorage.setItem(getDriveStorageKey(), JSON.stringify([newItem, ...items]));
    window.dispatchEvent(new Event('drive-sync'));

    // Sync to Firestore in background
    if (userId) {
      this.syncToFirestoreBackground(newItem);
    }
  },

  // Background sync to Firestore with error handling
  async syncToFirestoreBackground(item: DriveItem) {
    try {
      const result = await syncMetadataToFirestore(item);

      if (result.success) {
        this.updateItemSyncStatus(item.id, 'synced');
      } else {
        this.updateItemSyncStatus(item.id, 'failed');
      }
    } catch (error) {
      console.error('Background sync failed:', error);
      this.updateItemSyncStatus(item.id, 'failed');
    }
  },

  // Update sync status of an item
  updateItemSyncStatus(itemId: string, status: 'pending' | 'synced' | 'failed' | 'local-only') {
    const items = this.getDriveItems();
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, syncStatus: status } : item
    );
    localStorage.setItem(getDriveStorageKey(), JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('drive-sync'));
  },

  // Retry failed syncs
  async retryFailedSyncs() {
    const items = this.getDriveItems();
    const failedItems = items.filter(item => item.syncStatus === 'failed');

    for (const item of failedItems) {
      await this.syncToFirestoreBackground(item);
    }
  },

  // Clear all drive data (Debug/Demo purposes)
  clearAll() {
    localStorage.removeItem(getDriveStorageKey());
    window.dispatchEvent(new Event('drive-sync'));
  }
};
