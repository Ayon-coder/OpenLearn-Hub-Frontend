// Guest Download Tracking Service
// Manages download limits for non-authenticated users

interface GuestDownloadState {
    count: number;
    downloads: string[]; // Array of note IDs downloaded
    lastReset: string;
}

const STORAGE_KEY = 'guest_downloads';
const MAX_DOWNLOADS = 5;

class GuestDownloadService {
    private getState(): GuestDownloadState {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return {
                count: 0,
                downloads: [],
                lastReset: new Date().toISOString()
            };
        }
        return JSON.parse(stored);
    }

    private setState(state: GuestDownloadState): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    getRemainingDownloads(): number {
        const state = this.getState();
        return Math.max(0, MAX_DOWNLOADS - state.count);
    }

    getDownloadCount(): number {
        return this.getState().count;
    }

    canDownload(): boolean {
        return this.getRemainingDownloads() > 0;
    }

    hasDownloaded(noteId: string): boolean {
        const state = this.getState();
        return state.downloads.includes(noteId);
    }

    recordDownload(noteId: string): boolean {
        if (!this.canDownload()) {
            return false;
        }

        const state = this.getState();

        // Don't count if already downloaded
        if (state.downloads.includes(noteId)) {
            return true;
        }

        state.count += 1;
        state.downloads.push(noteId);
        this.setState(state);

        return true;
    }

    clearDownloads(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    getProgressPercentage(): number {
        const count = this.getDownloadCount();
        return (count / MAX_DOWNLOADS) * 100;
    }

    getProgressMessage(): string {
        const remaining = this.getRemainingDownloads();

        if (remaining === 0) {
            return 'Download limit reached. Sign up for unlimited downloads!';
        }

        if (remaining === 1) {
            return '1 download remaining';
        }

        return `${remaining} downloads remaining`;
    }

    shouldShowCTA(): boolean {
        const count = this.getDownloadCount();
        // Show CTA after 3rd download or when limit reached
        return count >= 3;
    }

    getCTAMessage(): string {
        const remaining = this.getRemainingDownloads();

        if (remaining === 0) {
            return 'Create account for unlimited downloads';
        }

        if (remaining <= 2) {
            return `Only ${remaining} downloads left. Sign up for unlimited!`;
        }

        return 'Sign up for unlimited downloads';
    }
}

export const guestDownloadService = new GuestDownloadService();
