export interface InterviewSetup {
  role?: string;
  experience?: ExperienceLevel;
  company?: string;
  resumeFile?: File;
  resumeData?: string; // Base64 데이터 추가
  resumeName?: string; // 파일 이름 추가
}

export type ExperienceLevel = "1-2" | "3-5" | "5-10" | "10+";

export const EXPERIENCE_LEVELS = [
  { value: "1-2", label: "1-2 years", subtitle: "Junior" },
  { value: "3-5", label: "3-5 years", subtitle: "Mid-level" },
  { value: "5-10", label: "5-10 years", subtitle: "Senior" },
  { value: "10+", label: "10+ years", subtitle: "Lead / Staff" },
] as const;

export interface ResumeAnalysis {
  highlights: string[];
  redFlags: {
    issue: string;
    followUp: string;
  }[];
  strategyTips: {
    strengths: string[];
    pitfalls: string[];
    powerPhrases: string[];
  };
}

export interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  context?: string;
}