import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const buildPrompt = (requirements: string) => `
You are an AI assistant that helps generate structured interview questions.

Job Requirements:
${requirements}

Create a total of 7 questions:
- 3 technical questions based on the requirements
- 2 behavioral questions
- 2 situational questions

Respond ONLY with a raw JSON array (no markdown syntax, no extra text).
Example:
[
  "Technical question 1",
  "Technical question 2",
  "Technical question 3",
  "Behavioral question 1",
  "Behavioral question 2",
  "Situational question 1",
  "Situational question 2"
]
`;

export const generateSmartQuestions = async (requirements: string): Promise<string[]> => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(buildPrompt(requirements));
        const response = await result.response;
        let text = response.text().trim();

        // ✅ Strip Markdown if present
        if (text.startsWith('```')) {
            text = text.replace(/```(?:json)?/g, '').trim();
        }

        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error("Unexpected format");

        return parsed;
    } catch (error) {
        console.error('❌ Gemini Error:', error);
        return [
            `What is your experience with ${requirements}?`,
            `Can you walk me through a project involving ${requirements}?`,
            `What challenges have you faced when using ${requirements}?`,
            "Tell me about a time you had to work under pressure.",
            "Describe a situation where you had to resolve a conflict.",
            "How would you approach an unfamiliar task?",
            "How do you prioritize work when facing multiple deadlines?"
        ];
    }
};
