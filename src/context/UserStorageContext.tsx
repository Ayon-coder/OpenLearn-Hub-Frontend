import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { DemoContent } from '@/data/demoContents';
import { Subscription } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface UserProfile {
    userId: string;
    uploads: DemoContent[];
    downloads: DemoContent[]; // Or IDs
    subscriptions: Subscription[];
    createdAt: string;
}

interface UserStorageContextType {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    isSaving: boolean;
    addToUploads: (content: DemoContent) => Promise<void>;
    updateSubscriptions: (newSubscriptions: Subscription[]) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const UserStorageContext = createContext<UserStorageContextType | undefined>(undefined);

export const UserStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchUserProfile = async () => {
        if (!user || !user.id) {
            setLoading(false);
            setProfile(null);
            return;
        }

        const userId = user.id;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/storage/user/${userId}`);
            // Ensure subscriptions is initialized
            const data = response.data;
            if (!data.subscriptions) data.subscriptions = [];
            setProfile(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
            setError('Failed to load user data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [user]); // user object reference might change, but useAuth handles stability

    const saveProfile = async (newProfile: UserProfile) => {
        if (!user) return;
        const userId = user.id;

        setIsSaving(true);
        try {
            await axios.post(`${API_BASE_URL}/api/storage/user/${userId}`, newProfile);
            setProfile(newProfile);
        } catch (err) {
            console.error('Failed to save profile:', err);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    const addToUploads = async (content: DemoContent) => {
        if (!profile) {
            console.error('Cannot upload: user profile not loaded yet');
            alert('Please wait for your profile to load, then try again.');
            return;
        }
        try {
            // 1. Update User Profile
            const updatedProfile = {
                ...profile,
                uploads: [content, ...profile.uploads]
            };
            await saveProfile(updatedProfile);

            // 2. Add to Global Content (for Trending/Browse)
            // We do this optimistically or parallely, defaulting to success for user experience
            try {
                await axios.post(`${API_BASE_URL}/api/storage/global`, content);
                console.log('✅ Content synced to global storage');
            } catch (globalErr) {
                console.error('Failed to sync to global storage:', globalErr);
                // We don't rollback user profile update, but we log the error
            }
        } catch (err: any) {
            console.error('Upload save failed:', err);
            alert(`Failed to save upload: ${err.message || 'Unknown error'}`);
        }
    };

    const updateSubscriptions = async (newSubscriptions: Subscription[]) => {
        if (!profile) return;
        try {
            const updatedProfile = {
                ...profile,
                subscriptions: newSubscriptions
            };
            await saveProfile(updatedProfile);
        } catch (err) {
            console.error('Failed to update subscriptions', err);
        }
    };

    return (
        <UserStorageContext.Provider value={{
            profile,
            loading,
            error,
            isSaving,
            addToUploads,
            updateSubscriptions,
            refreshProfile: fetchUserProfile
        }}>
            {children}
        </UserStorageContext.Provider>
    );
};

export const useUserStorage = () => {
    const context = useContext(UserStorageContext);
    if (context === undefined) {
        throw new Error('useUserStorage must be used within a UserStorageProvider');
    }
    return context;
};
