import { useState, useEffect } from 'react';
import axios from 'axios';
import { DemoContent, DEMO_CONTENTS } from '../data/demoContents';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useGlobalContent = () => {
    const [contents, setContents] = useState<DemoContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGlobalContent = async () => {
            try {
                // Fetch from our new backend endpoint
                const response = await axios.get(`${API_BASE_URL}/api/storage/global`);

                let backendContents: DemoContent[] = [];
                if (Array.isArray(response.data)) {
                    backendContents = response.data;
                } else {
                    console.warn('Backend returned non-array for global content:', response.data);
                }

                // Merge local DEMO_CONTENTS with backend contents
                // Prioritize backend content if IDs match (though typically they shouldn't overlap in a weird way)
                const allContentsMap = new Map<string, DemoContent>();

                // 1. Add local defaults first
                DEMO_CONTENTS.forEach(content => allContentsMap.set(content.id, content));

                // 2. Add/Override with backend data
                backendContents.forEach(content => allContentsMap.set(content.id, content));

                setContents(Array.from(allContentsMap.values()));

            } catch (err) {
                console.error('Failed to fetch global content:', err);
                // Fallback to local content only if backend fails
                console.log('Falling back to local DEMO_CONTENTS');
                setContents(DEMO_CONTENTS);
                // We don't set error here to avoid blocking the UI if we have local data
            } finally {
                setLoading(false);
            }
        };


        fetchGlobalContent();
    }, []);

    return { contents, loading, error };
};
