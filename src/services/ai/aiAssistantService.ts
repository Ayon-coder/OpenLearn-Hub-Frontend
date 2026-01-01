/**
 * AI Assistant Service
 * Connects to the Python backend API for both Mentor and Concept Mirror modes
 */

// Backend API URL - uses port 5050 for the Python AI service
const BACKEND_URL = import.meta.env.VITE_AI_BACKEND_URL || 'http://localhost:5050';

// ============================================
// TYPES
// ============================================

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface ConceptAnalysis {
    understood: string[];
    missing: string[];
    incorrect: string[];
    assumptions: string[];
    summary: string;
    provider?: string;
    demo_mode?: boolean;
}

export interface HealthStatus {
    status: string;
    provider: string;
    model: string;
    has_api_key: boolean;
    demo_mode: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<HealthStatus | null> {
    try {
        const response = await fetch(`${BACKEND_URL}/health`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return null;
    }
}

/**
 * Check if API key is configured (checks backend)
 */
export function hasApiKey(): boolean {
    // Always return true since backend handles API keys
    return true;
}

// ============================================
// MENTOR MODE API
// ============================================

/**
 * Send a message to the mentor and get a response
 */
export async function sendMentorMessage(messages: Message[], topic: string): Promise<string> {
    try {
        const response = await fetch(`${BACKEND_URL}/mentor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                topic: topic
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || `API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Mentor API error:', error);
        // Return a fallback message if backend is unreachable
        return getMentorFallbackResponse(messages, topic);
    }
}

/**
 * Fallback response when backend is unreachable
 */
function getMentorFallbackResponse(messages: Message[], topic: string): string {
    if (messages.length === 1) {
        return `Great choice! Let's explore **${topic}** together. 🎯

I'll guide you through this topic step by step. Here's what we can cover:

**📚 Fundamentals** - Core concepts and definitions
**💡 Examples** - Real-world applications and code samples  
**🧩 Practice** - Exercises to test your understanding
**❓ Q&A** - Any questions you have along the way

Where would you like to start? Feel free to ask me anything about ${topic}!

*Note: Backend connection issue - showing demo response.*`;
    }

    return `That's a great question about ${topic}!

**Here's what you need to know:**

1. **Core Concept** - The fundamental idea behind this is...
2. **How it works** - In practice, this applies when...
3. **Common use cases** - You'll often see this in...

**💡 Pro tip:** The best way to solidify this understanding is through practice.

*Note: Backend connection issue - showing demo response.*`;
}

// ============================================
// CONCEPT MIRROR MODE API
// ============================================

/**
 * Analyze a concept explanation using the Concept Mirror approach
 */
export async function analyzeConceptExplanation(
    conceptName: string,
    userExplanation: string
): Promise<ConceptAnalysis> {
    try {
        const response = await fetch(`${BACKEND_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                concept: conceptName,
                explanation: userExplanation
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || `API request failed: ${response.status}`);
        }

        const data = await response.json();

        // Return the analysis result
        return {
            understood: data.understood || [],
            missing: data.missing || [],
            incorrect: data.incorrect || [],
            assumptions: data.assumptions || [],
            summary: data.summary || 'Analysis completed.',
            provider: data.provider,
            demo_mode: data.demo_mode
        };
    } catch (error) {
        console.error('Concept Mirror API error:', error);
        // Return a fallback response if backend is unreachable
        return getConceptMirrorFallbackResponse(conceptName);
    }
}

/**
 * Fallback response when backend is unreachable
 */
function getConceptMirrorFallbackResponse(conceptName: string): ConceptAnalysis {
    return {
        understood: ['Basic familiarity with the concept is evident'],
        missing: ['Unable to perform deep analysis - backend connection issue'],
        incorrect: [],
        assumptions: [`Assumption that the fundamental definition of "${conceptName}" is shared`],
        summary: `Your understanding of "${conceptName}" could not be fully analyzed due to a backend connection issue. Please ensure the Python backend is running on ${BACKEND_URL}.`,
        demo_mode: true
    };
}
