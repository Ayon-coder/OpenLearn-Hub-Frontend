import React from 'react';
import { DriveExplorer } from '@/components/drive/DriveExplorer';
import { authService } from '@/services/auth/authService';

export const DrivePage: React.FC = () => {
    const user = authService.getUser();

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Please log in</h2>
                    <p className="text-gray-600">You need to be logged in to access your drive</p>
                </div>
            </div>
        );
    }

    return <DriveExplorer userId={user.id} />;
};
