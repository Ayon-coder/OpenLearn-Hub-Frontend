import {
    YouTubeSource,
    UniversitySource,
    OnlineCourseSource,
    ContentSourceMetadata,
    ContentTrustLevel,
    SourceTagType
} from '@/types';

// Known online course platforms
const APPROVED_PLATFORMS = [
    'NPTEL',
    'Coursera',
    'MIT OpenCourseWare',
    'edX',
    'Khan Academy',
    'Udacity',
    'Udemy',
    'LinkedIn Learning',
    'Other'
];

// YouTube validation
export const validateYouTubeLink = async (url: string): Promise<{ valid: boolean; source?: YouTubeSource; error?: string }> => {
    try {
        // Basic URL validation
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(youtubeRegex);

        if (!match) {
            return { valid: false, error: 'Invalid YouTube URL format' };
        }

        const videoId = match[4];

        // Reject YouTube Shorts (unless explicitly educational)
        if (url.includes('/shorts/')) {
            return { valid: false, error: 'YouTube Shorts are not supported. Please use full-length educational videos.' };
        }

        // In production, you would call YouTube API here to get metadata
        // For now, we'll do basic validation and return a mock source
        const source: YouTubeSource = {
            url,
            channelName: 'Educational Channel', // Would be fetched from API
            videoTitle: 'Educational Video', // Would be fetched from API
            validated: true
        };

        return { valid: true, source };
    } catch (error) {
        return { valid: false, error: 'Failed to validate YouTube link' };
    }
};

// University validation
export const validateUniversityTag = (name: string): { valid: boolean; error?: string } => {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'University name cannot be empty' };
    }

    if (name.trim().length < 3) {
        return { valid: false, error: 'University name must be at least 3 characters' };
    }

    if (name.trim().length > 100) {
        return { valid: false, error: 'University name must be less than 100 characters' };
    }

    return { valid: true };
};

// Online course validation
export const validateOnlineCourse = (platform: string, courseName?: string): { valid: boolean; error?: string } => {
    if (!platform || platform.trim().length === 0) {
        return { valid: false, error: 'Platform cannot be empty' };
    }

    if (!APPROVED_PLATFORMS.includes(platform)) {
        return { valid: false, error: `Platform must be one of: ${APPROVED_PLATFORMS.join(', ')}` };
    }

    // If platform is "Other", course name or URL is required
    if (platform === 'Other' && (!courseName || courseName.trim().length === 0)) {
        return { valid: false, error: 'Course name is required for "Other" platforms' };
    }

    return { valid: true };
};

// Calculate trust level based on sources
export const calculateTrustLevel = (metadata: ContentSourceMetadata): ContentTrustLevel => {
    const sourceCount = metadata.sourceTags.length;

    // 3+ sources = Verified
    if (sourceCount >= 3) return 'verified';

    // 2 sources = Trusted
    if (sourceCount >= 2) return 'trusted';

    // YouTube + University = Trusted (special case)
    if (
        metadata.sourceTags.includes('youtube') &&
        metadata.sourceTags.includes('university')
    ) {
        return 'trusted';
    }

    // 1 source = Basic
    return 'basic';
};

// Validate source requirement (at least one source)
export const validateSourceRequirement = (metadata: ContentSourceMetadata): { valid: boolean; error?: string } => {
    if (metadata.sourceTags.length === 0) {
        return {
            valid: false,
            error: 'Please add at least one valid academic source (YouTube, University, or Online Course)'
        };
    }

    // Validate YouTube source if selected
    if (metadata.sourceTags.includes('youtube')) {
        if (!metadata.youtubeSource || !metadata.youtubeSource.validated) {
            return {
                valid: false,
                error: 'Please provide a valid YouTube educational video link'
            };
        }
    }

    // Validate University source if selected
    if (metadata.sourceTags.includes('university')) {
        if (!metadata.universitySource || !metadata.universitySource.name) {
            return {
                valid: false,
                error: 'Please provide a valid university or institution name'
            };
        }
    }

    // Validate Online Course source if selected
    if (metadata.sourceTags.includes('online_course')) {
        if (!metadata.onlineCourseSource || !metadata.onlineCourseSource.platform) {
            return {
                valid: false,
                error: 'Please select a valid online course platform'
            };
        }
    }

    return { valid: true };
};

// Basic subject-topic alignment check (can be enhanced with AI)
export const checkSubjectTopicAlignment = (
    content: string,
    subject: string,
    topic: string
): boolean => {
    const contentLower = content.toLowerCase();
    const subjectLower = subject.toLowerCase();
    const topicLower = topic.toLowerCase();

    // Basic keyword matching
    const hasSubject = contentLower.includes(subjectLower);
    const hasTopic = contentLower.includes(topicLower);

    // At least one should match
    return hasSubject || hasTopic;
};

// Get trust level display info
export const getTrustLevelInfo = (level: ContentTrustLevel) => {
    switch (level) {
        case 'verified':
            return {
                label: 'Verified',
                color: 'green',
                icon: '✓✓✓',
                description: '3+ academic sources'
            };
        case 'trusted':
            return {
                label: 'Trusted',
                color: 'blue',
                icon: '✓✓',
                description: '2+ academic sources'
            };
        case 'basic':
        default:
            return {
                label: 'Basic',
                color: 'gray',
                icon: '✓',
                description: '1 academic source'
            };
    }
};

// Get approved platforms list
export const getApprovedPlatforms = () => APPROVED_PLATFORMS;

// Error messages
export const ERROR_MESSAGES = {
    NO_SOURCE: 'Please add at least one valid academic source (YouTube, University, or Course).',
    INVALID_YOUTUBE: 'Invalid YouTube link. Please provide a valid educational video URL.',
    INVALID_UNIVERSITY: 'Please enter a valid university or institution name.',
    INVALID_COURSE: 'Please select a valid online course platform.',
    SUBJECT_MISMATCH: 'Content does not match selected subject. Please revise.',
    TOPIC_MISMATCH: 'Content does not align with selected topic. Please correct.'
};
