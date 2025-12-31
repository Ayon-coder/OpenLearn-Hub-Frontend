
import { Quiz, QuizQuestion, ChatbotVerificationResult } from '@/types';

/**
 * Chatbot Quiz Verifier Service
 * Mock implementation for UI demonstration
 * In production, this would call an actual AI service
 */
export const chatbotQuizVerifier = {
    /**
     * Verify quiz quality (mock implementation)
     */
    async verifyQuiz(quiz: Quiz): Promise<ChatbotVerificationResult> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const conceptual = this.checkConceptualCorrectness(quiz.questions);
        const clarity = this.checkQuestionClarity(quiz.questions);
        const plagiarism = this.checkPlagiarism(quiz);
        const alignment = this.checkSubjectAlignment(quiz);

        const overallScore = Math.round(
            (conceptual.score * 0.3) +
            (clarity.score * 0.25) +
            (plagiarism.score * 0.25) +
            (alignment.score * 0.2)
        );

        const passed = overallScore >= 70;

        const suggestions: string[] = [];
        if (!conceptual.passed) suggestions.push('Add explanations to help learners understand the correct answers');
        if (!clarity.passed) suggestions.push('Make questions more clear and concise');
        if (!plagiarism.passed) suggestions.push('Ensure all content is original');
        if (!alignment.passed) suggestions.push('Review subject and topic selection to match quiz content');

        return {
            passed,
            score: overallScore,
            feedback: {
                conceptualCorrectness: conceptual,
                questionClarity: clarity,
                plagiarismCheck: plagiarism,
                subjectAlignment: alignment
            },
            suggestions
        };
    },

    /**
     * Check conceptual correctness (30% weight)
     */
    checkConceptualCorrectness(questions: QuizQuestion[]): { passed: boolean; score: number; message: string } {
        let score = 100;
        const issues: string[] = [];

        // Check if all questions have correct answers
        const hasCorrectAnswers = questions.every(q =>
            q.correctAnswer >= 0 && q.correctAnswer < q.options.length
        );
        if (!hasCorrectAnswers) {
            score -= 40;
            issues.push('Some questions have invalid correct answer indices');
        }

        // Check if options are reasonable (at least 2 options)
        const hasValidOptions = questions.every(q => q.options.length >= 2);
        if (!hasValidOptions) {
            score -= 30;
            issues.push('Questions must have at least 2 options');
        }

        // Bonus for explanations
        const hasExplanations = questions.filter(q => q.explanation && q.explanation.length > 10).length;
        const explanationRatio = hasExplanations / questions.length;
        if (explanationRatio < 0.5) {
            score -= 20;
            issues.push('Add explanations to help learners understand');
        }

        // Check for duplicate options
        const hasDuplicates = questions.some(q => {
            const uniqueOptions = new Set(q.options.map(o => o.toLowerCase().trim()));
            return uniqueOptions.size !== q.options.length;
        });
        if (hasDuplicates) {
            score -= 10;
            issues.push('Some questions have duplicate options');
        }

        const finalScore = Math.max(0, score);
        return {
            passed: finalScore >= 70,
            score: finalScore,
            message: issues.length > 0 ? issues.join('. ') : 'Questions are conceptually sound with clear correct answers'
        };
    },

    /**
     * Check question clarity (25% weight)
     */
    checkQuestionClarity(questions: QuizQuestion[]): { passed: boolean; score: number; message: string } {
        let score = 100;
        const issues: string[] = [];

        // Check question length (should be reasonable)
        const tooShort = questions.filter(q => q.question.length < 10).length;
        const tooLong = questions.filter(q => q.question.length > 300).length;

        if (tooShort > 0) {
            score -= tooShort * 15;
            issues.push(`${tooShort} question(s) are too short`);
        }
        if (tooLong > 0) {
            score -= tooLong * 10;
            issues.push(`${tooLong} question(s) are too long`);
        }

        // Check option length
        questions.forEach(q => {
            const emptyOptions = q.options.filter(o => o.trim().length === 0).length;
            if (emptyOptions > 0) {
                score -= emptyOptions * 10;
                issues.push('Some options are empty');
            }
        });

        // Check for proper formatting (ends with ?)
        const noQuestionMark = questions.filter(q => !q.question.trim().endsWith('?')).length;
        if (noQuestionMark > questions.length / 2) {
            score -= 15;
            issues.push('Most questions should end with a question mark');
        }

        const finalScore = Math.max(0, score);
        return {
            passed: finalScore >= 70,
            score: finalScore,
            message: issues.length > 0 ? issues.join('. ') : 'Questions are clear and well-formatted'
        };
    },

    /**
     * Check for plagiarism (25% weight)
     * Mock implementation - always passes for demo
     */
    checkPlagiarism(quiz: Quiz): { passed: boolean; score: number; message: string } {
        // In production, this would check against existing quizzes
        // For demo, we'll do basic checks

        let score = 100;
        const issues: string[] = [];

        // Check for very generic questions (potential copy-paste)
        const genericPhrases = ['what is', 'which of the following', 'true or false'];
        const genericCount = quiz.questions.filter(q => {
            const lowerQ = q.question.toLowerCase();
            return genericPhrases.some(phrase => lowerQ.includes(phrase));
        }).length;

        if (genericCount === quiz.questions.length) {
            score -= 20;
            issues.push('Questions appear very generic - try to make them more specific');
        }

        // Mock: Random chance of flagging (for demo purposes)
        const randomFlag = Math.random() < 0.1; // 10% chance
        if (randomFlag) {
            score -= 30;
            issues.push('Some content may be similar to existing quizzes');
        }

        const finalScore = Math.max(0, score);
        return {
            passed: finalScore >= 70,
            score: finalScore,
            message: issues.length > 0 ? issues.join('. ') : 'No plagiarism detected - content appears original'
        };
    },

    /**
     * Check subject alignment (20% weight)
     */
    checkSubjectAlignment(quiz: Quiz): { passed: boolean; score: number; message: string } {
        let score = 100;
        const issues: string[] = [];

        // Basic keyword matching
        const subjectKeywords = quiz.subject.toLowerCase().split(' ');
        const topicKeywords = quiz.topic.toLowerCase().split(' ');

        const allText = [
            quiz.title,
            quiz.description,
            ...quiz.questions.map(q => q.question),
            ...quiz.questions.flatMap(q => q.options)
        ].join(' ').toLowerCase();

        // Check if subject keywords appear
        const subjectMatches = subjectKeywords.filter(keyword =>
            keyword.length > 3 && allText.includes(keyword)
        ).length;

        if (subjectMatches === 0) {
            score -= 40;
            issues.push('Quiz content does not seem to match the selected subject');
        }

        // Check if topic keywords appear
        const topicMatches = topicKeywords.filter(keyword =>
            keyword.length > 3 && allText.includes(keyword)
        ).length;

        if (topicMatches === 0) {
            score -= 30;
            issues.push('Quiz content does not align well with the selected topic');
        }

        // Check title relevance
        const titleRelevant = subjectKeywords.some(k => quiz.title.toLowerCase().includes(k)) ||
            topicKeywords.some(k => quiz.title.toLowerCase().includes(k));
        if (!titleRelevant) {
            score -= 20;
            issues.push('Quiz title should relate to the subject or topic');
        }

        const finalScore = Math.max(0, score);
        return {
            passed: finalScore >= 70,
            score: finalScore,
            message: issues.length > 0 ? issues.join('. ') : 'Quiz content aligns well with selected subject and topic'
        };
    }
};
