/**
 * Resource Mapping Service
 * Maps learning path resources to platform content or external sources
 */

import { DEMO_CONTENTS, DemoContent } from '@/data/demoContents';
import { LearningResource } from '@/data/learningPathsData';

export interface ResolvedResource {
    resource: LearningResource;
    platformContent?: DemoContent;
    isInternal: boolean;
    viewUrl: string;
}

/**
 * Resolve a learning resource to either platform content or external URL
 */
export function resolveResource(resource: LearningResource): ResolvedResource {
    // If resource has internal content ID, try to find it
    if (resource.contentId) {
        const platformContent = DEMO_CONTENTS.find(c => c.id === resource.contentId);
        if (platformContent) {
            return {
                resource,
                platformContent,
                isInternal: true,
                viewUrl: `/note/${platformContent.id}`
            };
        }
    }

    // Fallback to external URL
    return {
        resource,
        isInternal: false,
        viewUrl: resource.externalUrl || '#'
    };
}

/**
 * Search platform content by keywords
 */
export function searchPlatformContent(keywords: string[]): DemoContent[] {
    const lowerKeywords = keywords.map(k => k.toLowerCase());

    return DEMO_CONTENTS.filter(content => {
        const searchText = `${content.title} ${content.description}`.toLowerCase();
        return lowerKeywords.some(keyword => searchText.includes(keyword));
    });
}

/**
 * Get platform icon based on platform type
 */
export function getPlatformIcon(platform: LearningResource['platform']): string {
    switch (platform) {
        case 'internal':
            return '📚';
        case 'youtube':
            return '▶️';
        case 'coursera':
            return '🎓';
        case 'freecodecamp':
            return '⌨️';
        case 'khan-academy':
            return '📐';
        default:
            return '🔗';
    }
}

/**
 * Get platform label
 */
export function getPlatformLabel(platform: LearningResource['platform']): string {
    switch (platform) {
        case 'internal':
            return 'OpenLearn Hub';
        case 'youtube':
            return 'YouTube';
        case 'coursera':
            return 'Coursera';
        case 'freecodecamp':
            return 'freeCodeCamp';
        case 'khan-academy':
            return 'Khan Academy';
        default:
            return 'External';
    }
}

/**
 * Get platform color class
 */
export function getPlatformColor(platform: LearningResource['platform']): string {
    switch (platform) {
        case 'internal':
            return 'bg-blue-100 text-blue-700';
        case 'youtube':
            return 'bg-red-100 text-red-700';
        case 'coursera':
            return 'bg-indigo-100 text-indigo-700';
        case 'freecodecamp':
            return 'bg-green-100 text-green-700';
        case 'khan-academy':
            return 'bg-emerald-100 text-emerald-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}
