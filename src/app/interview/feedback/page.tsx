"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Home,
  TrendingUp,
  AlertTriangle,
  Target,
  Loader2,
  Award,
  MessageSquare,
  Clock,
} from "lucide-react";
import { InterviewSetup, InterviewQuestion } from "@/types/interview";
import { SessionData, FeedbackData, generateFeedback } from "@/lib/gemini";

export default function FeedbackPage() {
  const router = useRouter();

  const [setup] = useState<InterviewSetup | null>(() => {
    if (typeof window === "undefined") return null;
    const setupData = sessionStorage.getItem("interviewSetup");
    return setupData ? (JSON.parse(setupData) as InterviewSetup) : null;
  });

  const [sessionData] = useState<SessionData | null>(() => {
    if (typeof window === "undefined") return null;
    const data = sessionStorage.getItem("sessionResults");
    return data ? (JSON.parse(data) as SessionData) : null;
  });

  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      if (!sessionData || !setup) {
        setIsLoadingFeedback(false);
        return;
      }

      // 캐시 확인
      const cached = sessionStorage.getItem("sessionFeedback");
      if (cached) {
        setFeedback(JSON.parse(cached) as FeedbackData);
        setIsLoadingFeedback(false);
        return;
      }

      try {
        // Gemini로 생성
        const questions: InterviewQuestion[] = JSON.parse(
          sessionStorage.getItem("interviewQuestions") || "[]",
        );

        const generatedFeedback = await generateFeedback(
          sessionData,
          questions,
          setup,
        );

        setFeedback(generatedFeedback);
        sessionStorage.setItem(
          "sessionFeedback",
          JSON.stringify(generatedFeedback),
        );
      } catch (error) {
        console.error("Failed to generate feedback:", error);
      } finally {
        setIsLoadingFeedback(false);
      }
    };

    loadFeedback();
  }, [sessionData, setup]);

  const handleTryAgain = () => {
    sessionStorage.removeItem("interviewQuestions");
    sessionStorage.removeItem("sessionResults");
    sessionStorage.removeItem("sessionFeedback");
    router.push("/interview/session");
  };

  const handleNewInterview = () => {
    sessionStorage.clear();
    router.push("/interview/setup");
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No session data found</p>
          <Button onClick={() => router.push("/interview/setup")}>
            Start New Interview
          </Button>
        </div>
      </div>
    );
  }

  const completionRate = Math.round(
    (sessionData.answeredCount / sessionData.totalQuestions) * 100,
  );
  const avgMinutes = Math.floor(sessionData.averageTime / 60);
  const avgSeconds = sessionData.averageTime % 60;

  if (isLoadingFeedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Generating Personalized Feedback...
            </h2>
            <p className="text-muted-foreground">
              AI is analyzing your session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Great Start!</h1>
          <p className="text-lg text-muted-foreground">
            {feedback?.encouragement ||
              "Every interview is practice — here's what to focus on next"}
          </p>
        </div>

        {/* Quick Stats */}
        <Card
          className="p-8 mb-8 bg-card border-border animate-fadeInUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {sessionData.answeredCount}
              </div>
              <div className="text-sm text-muted-foreground">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground mb-2">
                {sessionData.skippedCount}
              </div>
              <div className="text-sm text-muted-foreground">Skipped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {avgMinutes}:{avgSeconds.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-muted-foreground">Avg Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {sessionData.totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Questions
              </div>
            </div>
          </div>
        </Card>

        {/* Strengths (from Gemini) */}
        {feedback && feedback.strengths.length > 0 && (
          <Card
            className="p-8 mb-8 bg-card border-border animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-xl font-bold">Keep Doing This</h2>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Main Focus (from Gemini) */}
        {feedback && feedback.mainFocus && (
          <Card
            className="p-8 mb-8 bg-blue-500/5 border-blue-500/20 animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {feedback.mainFocus.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feedback.mainFocus.description}
                </p>
                <div className="space-y-2">
                  {feedback.mainFocus.actionableSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="text-blue-500 mt-1">→</div>
                      <div className="text-sm">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Wins (from Gemini) */}
        {feedback && feedback.quickWins.length > 0 && (
          <Card
            className="p-8 mb-8 bg-card border-border animate-fadeInUp"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold">Quick Wins</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {feedback.quickWins.map((win, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="font-semibold mb-2">{win.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {win.description}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div
          className="grid grid-cols-2 gap-4 animate-fadeInUp"
          style={{ animationDelay: "0.5s" }}
        >
          <Button
            size="lg"
            variant="outline"
            onClick={handleTryAgain}
            className="h-16 text-lg gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Try Different Questions
          </Button>
          <Button
            size="lg"
            onClick={handleNewInterview}
            className="h-16 text-lg gap-3"
          >
            <Home className="w-5 h-5" />
            Start New Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
