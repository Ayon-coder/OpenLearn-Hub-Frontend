/**
 * Firestore Drive Service
 * Frontend API client for backend Firestore endpoints
 */

import { DriveItem } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get user ID from current auth
 */
function getUserId(): string | null {
    const userStr = localStorage.getItem('openlearn_user');
    if (!userStr) return null;
    try {
        const user = JSON.parse(userStr);
        return user.id;
    } catch {
        return null;
    }
}

/**
 * Sync metadata to Firestore
 */
export async function syncMetadataToFirestore(
    metadata: DriveItem
): Promise<{ success: boolean; error?: string }> {
    try {
        const userId = getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/drive/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId
            },
            body: JSON.stringify({ metadata })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Sync failed');
        }

        return { success: true };
    } catch (error: any) {
        console.error('Firestore sync error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Batch sync multiple items to Firestore
 */
export async function batchSyncToFirestore(
    items: DriveItem[]
): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
        const userId = getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/drive/batch-sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId
            },
            body: JSON.stringify({ items })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Batch sync failed');
        }

        return { success: true, count: result.data.count };
    } catch (error: any) {
        console.error('Batch sync error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * List all items from Firestore
 */
export async function listFirestoreItems(): Promise<{
    success: boolean;
    items?: DriveItem[];
    error?: string;
}> {
    try {
        const userId = getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/drive/list`, {
            headers: {
                'x-user-id': userId
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to list items');
        }

        return { success: true, items: result.data.items };
    } catch (error: any) {
        console.error('List items error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get a specific item from Firestore
 */
export async function getFirestoreItem(
    itemId: string
): Promise<{ success: boolean; item?: DriveItem; error?: string }> {
    try {
        const userId = getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/drive/item/${itemId}`, {
            headers: {
                'x-user-id': userId
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get item');
        }

        return { success: true, item: result.data };
    } catch (error: any) {
        console.error('Get item error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete an item from Firestore
 */
export async function deleteFromFirestore(
    itemId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const userId = getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/drive/item/${itemId}`, {
            method: 'DELETE',
            headers: {
                'x-user-id': userId
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Delete failed');
        }

        return { success: true };
    } catch (error: any) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Update sync status
 */
export async function updateSyncStatus(
    itemId: string,
    status: 'pending' | 'synced' | 'failed' | 'local-only'
): Promise<{ success: boolean; error?: string }> {
    try {
        const userId = getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/drive/item/${itemId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId
            },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Update failed');
        }

        return { success: true };
    } catch (error: any) {
        console.error('Update status error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get sync statistics
 */
export async function getSyncStats(): Promise<{
    success: boolean;
    stats?: any;
    error?: string;
}> {
    try {
        const userId = getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/drive/stats`, {
            headers: {
                'x-user-id': userId
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get stats');
        }

        return { success: true, stats: result.data };
    } catch (error: any) {
        console.error('Get stats error:', error);
        return { success: false, error: error.message };
    }
}
