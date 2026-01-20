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
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

export interface Course {
    position: number;
    title: string;
    description: string;
    topics: string[];
    video_count: number;
    duration_hours: number;
    prerequisites: string[];
    learning_outcomes: string[];
    quiz: QuizQuestion[];
    hands_on_project: string;
}

export interface LearningTier {
    tier_description: string;
    total_videos: number;
    estimated_hours: number;
    courses: Course[];
}

export interface ProgressMilestone {
    milestone_name: string;
    tier: string;
    percentage: number;
    videos_completed: number;
    skills_unlocked: string[];
    next_step: string;
}

export interface StudentAnalysis {
    profile_summary: string;
    starting_tier: string;
    reasoning: string;
    estimated_completion_weeks: number;
    weekly_hours_needed: number;
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

export interface CurriculumData {
    student_analysis: StudentAnalysis;
    learning_path: {
        beginner: LearningTier;
        intermediate: LearningTier;
        advanced: LearningTier;
    };
    progress_milestones: ProgressMilestone[];
    personalization: Personalization;
    final_project: FinalProject;
    career_outcomes: CareerOutcomes;
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
        try {
            const response = await fetch(`${API_BASE}/${curriculumId}`);
            const result = await response.json();

            if (!response.ok) {
                console.error('Get curriculum error:', result.message);
                return null;
            }

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
        try {
            const response = await fetch(`${API_BASE}/user/${userId}`);
            const result = await response.json();

            if (!response.ok) {
                console.error('Get user curricula error:', result.message);
                return [];
            }

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

            return response.ok;
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

            return result.curriculum;
        } catch (error) {
            console.error('Update progress error:', error);
            return null;
        }
    }
};

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
