/**
 * Curriculum Service
 * API service for curriculum generation and management
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api/curriculum`;

// ============================================
// TYPES
// ============================================

export interface CurriculumFormData {
    learning_goal: string;
    current_level: 'Beginner' | 'Intermediate' | 'Advanced';
    focus_areas: string[];
    prior_knowledge: string;
    time_commitment: string;
    learning_objectives: string;
    learning_style: 'video-heavy' | 'hands-on' | 'reading' | 'mixed';
    // New fields
    interests?: string;
    exam_date?: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    question_type?: 'conceptual' | 'numerical' | 'mcq' | 'assertion-reasoning';
}

export interface MatchingCriteria {
    topic_slug: string;
    subtopic_slugs: string[];
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    keywords: string[];
    domain: string;
    exam_context: string;
    alternative_names?: string[];
}

export interface PracticeProblem {
    recommended_count: number;
    difficulty_distribution: {
        easy: number;
        medium: number;
        hard: number;
    };
    problem_types: string[];
}

export interface Course {
    position: number;
    title: string;
    description: string;
    topics?: string[]; // Kept for backward compatibility
    video_count?: number; // Kept for backward compatibility
    expected_video_count?: number; // New field
    duration_hours?: number; // Kept for backward compatibility
    estimated_hours?: number; // New field
    prerequisites?: string[]; // Kept for backward compatibility
    prerequisite_courses?: string[]; // New field
    learning_outcomes: string[];
    quiz: QuizQuestion[];
    hands_on_project?: string;

    // Universal / Exam Fields
    matching_criteria?: MatchingCriteria;
    exam_relevance?: string;
    weightage?: string; // e.g. "15% of marks"
    practice_problems?: PracticeProblem;
}

export interface LearningTier {
    tier_description: string;
    total_videos?: number; // Legacy
    total_estimated_hours: number;
    tier_relevance: string;
    courses: Course[];
}

export interface ProgressMilestone {
    milestone_name: string;
    tier: string;
    percentage: number;
    courses_completed?: number;
    videos_completed?: number; // Legacy
    skills_unlocked: string[];
    next_step?: string;
    exam_readiness?: string;
}

export interface StudentAnalysis {
    profile_summary?: string; // Legacy
    summary?: string; // New field
    starting_tier?: string; // Legacy
    recommended_start_tier?: string; // New field
    reasoning?: string; // Legacy
    estimated_completion_weeks?: number; // Legacy
    estimated_weeks?: number; // New field
    weekly_hours_needed?: number; // Legacy
    weekly_hours?: number; // New field
    special_notes?: string;
}

export interface Personalization {
    skipped_content: string[];
    emphasized_areas: string[];
    recommended_pace: string;
    learning_style_adaptations: string;
}

export interface FinalProject {
    title: string;
    description: string;
    skills_demonstrated: string[];
    estimated_hours: number;
    deliverables: string[];
}

export interface CareerOutcomes {
    job_titles: string[];
    portfolio_pieces: string[];
    next_learning_paths: string[];
}

// New Exam Strategy Types
export interface ExamStrategy {
    study_schedule?: {
        weeks_until_exam: number;
        [key: string]: any;
    };
    topic_prioritization?: Array<{
        topic: string;
        importance: string;
        recommended_hours: number;
    }>;
    mock_test_schedule?: string;
}

export interface ResourceRecommendation {
    topic: string;
    difficulty: string;
    recommended_platforms: string[];
    search_query: string;
    youtube_channels?: string[];
    books?: string[];
    websites?: string[];
}

export interface SuccessMetrics {
    for_skills?: {
        beginner_completion: string;
        intermediate_completion: string;
        advanced_completion: string;
    };
    for_exams?: {
        beginner_completion: string;
        intermediate_completion: string;
        advanced_completion: string;
    };
}

export interface CurriculumData {
    student_analysis?: StudentAnalysis; // Legacy
    student_profile?: StudentAnalysis; // New
    learning_path?: { // Legacy
        beginner: LearningTier;
        intermediate: LearningTier;
        advanced: LearningTier;
    };
    curriculum?: { // New
        beginner: LearningTier;
        intermediate: LearningTier;
        advanced: LearningTier;
    };

    progress_milestones: ProgressMilestone[];
    personalization?: Personalization; // Legacy
    final_project?: FinalProject; // Legacy/Optional
    career_outcomes?: CareerOutcomes; // Legacy/Optional

    // New Fields
    learning_goal_analysis?: {
        detected_domain: string;
        primary_topic: string;
        subtopics: string[];
        exam_specific: boolean;
        exam_name: string;
        complexity_level: string;
    };
    exam_strategy?: {
        if_exam_prep?: ExamStrategy;
    };
    resource_recommendations?: {
        if_no_internal_videos?: ResourceRecommendation[];
    };
    success_metrics?: SuccessMetrics;
}

export interface SavedCurriculum {
    id: string;
    userId: string;
    formData: CurriculumFormData;
    curriculum: CurriculumData;
    createdAt: string;
    updatedAt: string;
    progress?: Record<string, any>;
}

export interface GenerateResult {
    success: boolean;
    message: string;
    curriculum?: SavedCurriculum;
    error?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

export const curriculumService = {
    /**
     * Generate a new curriculum using AI
     */
    async generate(userId: string, formData: CurriculumFormData): Promise<GenerateResult> {
        try {
            const response = await fetch(`${API_BASE}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    ...formData
                })
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.message || 'Failed to generate curriculum',
                    error: result.error
                };
            }

            // Invalidate user curricula cache
            invalidateCache(`user_curricula_${userId}`);

            return {
                success: true,
                message: result.message || 'Curriculum generated successfully',
                curriculum: result.curriculum
            };
        } catch (error) {
            console.error('Curriculum generation error:', error);
            return {
                success: false,
                message: 'Connection failed. Please ensure the server is running.',
                error: 'network_error'
            };
        }
    },

    /**
     * Get a specific curriculum by ID
     */
    async getById(curriculumId: string): Promise<SavedCurriculum | null> {
        // Try cache first
        const cached = getFromCache<SavedCurriculum>(`curriculum_${curriculumId}`);
        if (cached) return cached;

        try {
            const response = await fetch(`${API_BASE}/${curriculumId}`);
            const result = await response.json();

            if (!response.ok) {
                console.error('Get curriculum error:', result.message);
                return null;
            }

            // Save to cache
            saveToCache(`curriculum_${curriculumId}`, result.curriculum);

            return result.curriculum;
        } catch (error) {
            console.error('Get curriculum error:', error);
            return null;
        }
    },

    /**
     * Get all curricula for a user
     */
    async getUserCurricula(userId: string): Promise<SavedCurriculum[]> {
        // Try cache first
        const cached = getFromCache<SavedCurriculum[]>(`user_curricula_${userId}`);
        if (cached) return cached;

        try {
            const response = await fetch(`${API_BASE}/user/${userId}`);
            const result = await response.json();

            if (!response.ok) {
                console.error('Get user curricula error:', result.message);
                return [];
            }

            // Save to cache
            saveToCache(`user_curricula_${userId}`, result.curricula || []);

            return result.curricula || [];
        } catch (error) {
            console.error('Get user curricula error:', error);
            return [];
        }
    },

    /**
     * Delete a curriculum
     */
    async delete(curriculumId: string, userId: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE}/${curriculumId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                // Invalidate caches
                invalidateCache(`curriculum_${curriculumId}`);
                invalidateCache(`user_curricula_${userId}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Delete curriculum error:', error);
            return false;
        }
    },

    /**
     * Update curriculum progress
     */
    async updateProgress(
        curriculumId: string,
        progress: Record<string, any>
    ): Promise<SavedCurriculum | null> {
        try {
            const response = await fetch(`${API_BASE}/${curriculumId}/progress`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ progress })
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Update progress error:', result.message);
                return null;
            }

            // Invalidate or update cache
            // For simplicity, we invalidate to force refresh on next specific fetch
            invalidateCache(`curriculum_${curriculumId}`);
            // Also invalidate user list as it might show progress
            // Note: We'd need the userId to invalidate the list safely, 
            // but since we don't have it here easily and it's less critical for list view details usually
            // we will skip list invalidation or we can partially update if desired.
            // A clearer strategy is to just invalidate the specific item.

            // To update cache immediately:
            saveToCache(`curriculum_${curriculumId}`, result.curriculum);

            return result.curriculum;
        } catch (error) {
            console.error('Update progress error:', error);
            return null;
        }
    }
};

// ============================================
// CACHE UTILS
// ============================================

const CACHE_PREFIX = 'ohl_cache_';
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function saveToCache(key: string, data: any) {
    try {
        const item = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
    } catch (e) {
        console.warn('Failed to save to cache', e);
    }
}

function getFromCache<T>(key: string): T | null {
    try {
        const itemStr = localStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        const now = Date.now();

        if (now - item.timestamp > CACHE_DURATION) {
            localStorage.removeItem(`${CACHE_PREFIX}${key}`);
            return null;
        }

        return item.data as T;
    } catch (e) {
        return null;
    }
}

function invalidateCache(key: string) {
    try {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (e) {
        console.warn('Failed to invalidate cache', e);
    }
}

// Default form data for initialization
export const defaultFormData: CurriculumFormData = {
    learning_goal: '',
    current_level: 'Beginner',
    focus_areas: [],
    prior_knowledge: '',
    time_commitment: '10-20 hours/week',
    learning_objectives: '',
    learning_style: 'mixed'
};
