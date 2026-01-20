import { useState, useEffect } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth/authService';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(authService.getUser());

    useEffect(() => {
        const handleAuthChange = () => {
            setUser(authService.getUser());
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    return { user };
};
