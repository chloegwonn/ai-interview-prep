import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiRateLimiter } from "./rate-limiter";
import { InterviewQuestion, InterviewSetup } from "@/types/interview";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// ✅ 타입 정의 추가
export interface SessionData {
  totalQuestions: number;
  answeredCount: number;
  skippedCount: number;
  averageTime: number;
  results: Array<{
    questionId: number;
    question: string;
    category: string;
    skipped: boolean;
    timeSpent: number;
  }>;
}

export interface FeedbackData {
  strengths: string[];
  mainFocus: {
    title: string;
    description: string;
    actionableSteps: string[];
  };
  quickWins: Array<{
    title: string;
    description: string;
  }>;
  encouragement: string;
}

// ... analyzeResume, generateInterviewQuestions 함수들 (기존과 동일)

export async function analyzeResume(
  resumeText: string,
  role: string,
  experience: string,
) {
  const limitCheck = geminiRateLimiter.canMakeRequest();
  if (!limitCheck.allowed) {
    throw new Error(limitCheck.reason);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const prompt = `You are an expert technical recruiter analyzing a resume for a ${role} position with ${experience} years of experience.

Resume Content:
${resumeText}

Analyze this resume and provide a detailed assessment in the following JSON format:

{
  "highlights": [
    "List 6-8 key achievements, skills, or experiences that stand out",
    "Include specific metrics, technologies, and accomplishments",
    "Focus on items relevant to the target role"
  ],
  "redFlags": [
    {
      "issue": "Describe a potential concern or gap (e.g., short tenure, missing skills, unclear progression)",
      "followUp": "Suggest a specific interview question to address this concern"
    }
  ],
  "strategyTips": {
    "strengths": [
      "List 3-4 specific strengths the candidate should emphasize in the interview",
      "Be specific about what makes them stand out"
    ],
    "pitfalls": [
      "List 3-4 common mistakes or weak points the candidate should avoid",
      "Be constructive and actionable"
    ],
    "powerPhrases": [
      "Suggest 3-4 powerful opening statements or phrases the candidate can use",
      "These should highlight their unique value proposition"
    ]
  }
}

Important: 
- Return ONLY valid JSON, no markdown code blocks
- Be specific and actionable
- Base analysis on actual resume content
- Tailor feedback to the ${role} role`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    geminiRateLimiter.recordRequest();

    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const analysis = JSON.parse(cleanText);
    return analysis;
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error instanceof Error && "status" in error && error.status === 429) {
      throw new Error(
        "API rate limit exceeded. Please wait a moment and try again.",
      );
    }

    throw new Error("Failed to analyze resume. Please try again.");
  }
}

export async function generateInterviewQuestions(
  resumeText: string,
  role: string,
  experience: string,
): Promise<InterviewQuestion[]> {
  const limitCheck = geminiRateLimiter.canMakeRequest();
  if (!limitCheck.allowed) {
    throw new Error(limitCheck.reason);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const prompt = `You are an experienced technical interviewer conducting a ${experience} years ${role} interview.

Generate 5 realistic interview questions based on:
1. Common questions for ${experience} years ${role} positions (60% of questions)
2. The candidate's actual resume experience (40% of questions)

Resume:
${resumeText}

IMPORTANT RULES:
- Ask questions like a REAL interviewer, not a robot reading a resume
- Mix general technical questions with experience-based questions
- Don't quote specific metrics from resume (no "you reduced X by 45%")
- Ask open-ended questions that let candidates showcase their knowledge
- Include some behavioral/situational questions
- Questions should feel natural, not like you're reading their resume back to them

Generate questions in this JSON format:
{
  "questions": [
    {
      "id": 1,
      "category": "technical",
      "question": "The actual question text",
      "context": "Optional brief context (1 sentence max, can be empty string)"
    }
  ]
}

Example GOOD questions:
- "Walk me through how you'd design a scalable API for a mobile app"
- "Tell me about a time you had to debug a production issue under pressure"
- "I see you've worked with real-time systems. What are the main challenges with WebSocket connections?"

Example BAD questions (don't do this):
- "You reduced latency by 98% using MongoDB. Explain your exact implementation."
- "How did you achieve 85% code coverage at your previous company?"

Return ONLY the JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    geminiRateLimiter.recordRequest();

    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    interface GeminiResponse {
      questions: InterviewQuestion[];
    }

    const data: GeminiResponse = JSON.parse(cleanText);

    return data.questions;
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error instanceof Error && "status" in error && error.status === 429) {
      throw new Error(
        "API rate limit exceeded. Please wait a moment and try again.",
      );
    }

    throw new Error("Failed to generate questions. Please try again.");
  }
}

// ✅ Feedback 생성 함수
export async function generateFeedback(
  sessionData: SessionData,
  questions: InterviewQuestion[],
  setup: InterviewSetup,
): Promise<FeedbackData> {
  const limitCheck = geminiRateLimiter.canMakeRequest();
  if (!limitCheck.allowed) {
    throw new Error(limitCheck.reason);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const prompt = `You are an interview coach reviewing a practice session.

Session Details:
- Role: ${setup.role}
- Experience: ${setup.experience}
- Questions Answered: ${sessionData.answeredCount}/${sessionData.totalQuestions}
- Questions Skipped: ${sessionData.skippedCount}
- Average Time per Question: ${sessionData.averageTime} seconds

Question Breakdown:
${sessionData.results
  .map(
    (r) => `
- ${r.category}: ${r.skipped ? "SKIPPED" : `Answered in ${r.timeSpent}s`}
  Question: "${r.question}"
`,
  )
  .join("\n")}

Generate personalized, encouraging feedback in JSON:
{
  "strengths": [
    "Specific thing they did well (e.g., 'You maintained good pacing on technical questions')"
  ],
  "mainFocus": {
    "title": "Primary goal for next session",
    "description": "Why this matters",
    "actionableSteps": [
      "Specific thing to do"
    ]
  },
  "quickWins": [
    {
      "title": "Quick actionable tip",
      "description": "How to do it"
    }
  ],
  "encouragement": "Personalized encouraging message based on their performance"
}

CRITICAL RULES:
- Be ENCOURAGING, not harsh
- Focus on PROGRESS, not perfection
- Give SPECIFIC, ACTIONABLE advice
- Mention actual question categories they struggled with
- If they answered < 3 questions, focus on "just answer, don't worry about quality"
- If they answered 3-5, focus on "add more detail and examples"
- If they answered 6+, focus on "structure your answers with STAR method"

Return ONLY JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    geminiRateLimiter.recordRequest();

    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanText) as FeedbackData;
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error instanceof Error && "status" in error && error.status === 429) {
      throw new Error(
        "API rate limit exceeded. Please wait a moment and try again.",
      );
    }

    throw new Error("Failed to generate feedback. Please try again.");
  }
}

export function getRateLimitStatus() {
  return geminiRateLimiter.getRemainingRequests();
}
