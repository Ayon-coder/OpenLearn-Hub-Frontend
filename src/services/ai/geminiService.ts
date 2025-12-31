import { GoogleGenAI, Type, FunctionDeclaration, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_SUBTOPICS } from "@/constants";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper function for retry logic with exponential backoff
async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a 429 rate limit error
      const is429Error =
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.toLowerCase().includes('rate limit') ||
        error?.message?.toLowerCase().includes('quota exceeded');

      if (!is429Error || attempt === maxRetries - 1) {
        // If not a rate limit error or last attempt, throw immediately
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);

      console.log(`Rate limit hit. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

const changeContextTool: FunctionDeclaration = {
  name: 'changeContext',
  parameters: {
    type: Type.OBJECT,
    description: 'Updates the chatbot focus to a new subject, topic, or subtopic after user explicitly requests a switch.',
    properties: {
      subjectName: {
        type: Type.STRING,
        description: 'The name of the academic subject to switch to.',
      },
      topicName: {
        type: Type.STRING,
        description: 'The name of the specific topic to switch to.',
      },
      subtopicName: {
        type: Type.STRING,
        description: 'The name of the granular subtopic to switch to.',
      },
    },
    required: ['subjectName'],
  },
};

export const geminiService = {
  async classifyNote(noteContent: string) {
    if (!API_KEY) {
      throw new Error("API Key is missing. Please check .env file (VITE_GEMINI_API_KEY) and restart server.");
    }

    return await retryWithExponentialBackoff(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this note and classify it by subject and topic. Provide a suggested filename.\n\nNote Content: ${noteContent.substring(0, 2000)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              suggestedName: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ["subject", "topic", "suggestedName", "summary"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    });
  },

  async chatWithAI(messages: any[], currentContext: any, userRole: string = 'student') {
    if (!API_KEY) {
      throw new Error("API Key is missing. Please check .env file (VITE_GEMINI_API_KEY) and restart server.");
    }

    // Define role-based rejection messages
    const rejectionMessage = userRole === 'teacher' || userRole === 'online_educator'
      ? "I apologize, but I am designed to assist with academic content only. Could we focus on educational materials?"
      : "Please be more serious about your study.";

    const systemInstruction = `You are the OpenLearn Hub AI Assistant. 
    CURRENT CONTEXT: ${JSON.stringify(currentContext)}.
    USER ROLE: ${userRole}.

    CORE BEHAVIORS:
    1. **UPLOAD ANALYSIS**: If the user uploads a file/image:
       - FIRST, determine if it is STUDY-RELATED (notes, diagrams, questions, textbooks).
       - IF NOT STUDY-RELATED: Reply EXACTLY: "${rejectionMessage}" and do nothing else.
       - IF STUDY-RELATED: Reply EXACTLY: "Do you need summarization, ready-made practice questions, or a mindmap for this topic?" (Do not analyze the content yet, just ask).
    
    2. **STANDARD CHAT**:
       - You are strictly bound to the CURRENT CONTEXT: ${currentContext.subject || 'Global Hub'}.
       - If a user asks about a different subject, inform them they must explicitly request a switch.
       - You may ONLY change context using the "changeContext" tool when the user explicitly asks.
    
    3. **TONE**:
       - Professional and strict for students/contributors.
       - Respectful and assisting for teachers/educators.
    `;

    return await retryWithExponentialBackoff(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: messages,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [changeContextTool] }],
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
        },
      });
      return response;
    });
  },

  validateContext(subjectName: string, topicName?: string, subtopicName?: string) {
    let subject = INITIAL_SUBJECTS.find(s => s.name.toLowerCase() === subjectName.toLowerCase());

    // If no subject found, check if the user provided a topic name instead
    if (!subject) {
      const topicAsSubject = INITIAL_TOPICS.find(t => t.title.toLowerCase() === subjectName.toLowerCase());
      if (topicAsSubject) {
        // Found a topic with that name - resolve its parent subject
        subject = INITIAL_SUBJECTS.find(s => s.id === topicAsSubject.subjectId);
        if (subject) {
          // Return with both subject and topic resolved
          return { valid: true, subject, topic: topicAsSubject };
        }
      }
      return { valid: false, message: `Subject "${subjectName}" not found in Hub. Available subjects: ${INITIAL_SUBJECTS.map(s => s.name).join(', ')}.` };
    }

    if (topicName) {
      const topic = INITIAL_TOPICS.find(t => t.subjectId === subject!.id && t.title.toLowerCase() === topicName.toLowerCase());
      if (!topic) return { valid: false, message: `Topic "${topicName}" not found in ${subject.name}.` };

      if (subtopicName) {
        const subtopic = INITIAL_SUBTOPICS.find(st => st.topicId === topic.id && st.title.toLowerCase() === subtopicName.toLowerCase());
        if (!subtopic) return { valid: false, message: `Subtopic "${subtopicName}" not found in ${topic.title}.` };
        return { valid: true, subject, topic, subtopic };
      }
      return { valid: true, subject, topic };
    }
    return { valid: true, subject };
  }
};
