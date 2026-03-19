"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewQuestion } from "@/types/interview";
import { SkipForward, Mic } from "lucide-react";

interface QuestionCardProps {
  question: InterviewQuestion;
  currentQuestion: number;
  totalQuestions: number;
  onSkip: () => void;
  onAnswer: () => void;
  isRecording?: boolean;
}

export default function QuestionCard({
  question,
  currentQuestion,
  totalQuestions,
  onSkip,
  onAnswer,
  isRecording = false,
}: QuestionCardProps) {
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      // Software Engineer
      technical: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      behavioral: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "system-design": "bg-amber-500/10 text-amber-500 border-amber-500/20",

      // Product Manager
      "product-sense": "bg-green-500/10 text-green-500 border-green-500/20",
      metrics: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      strategy: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",

      // UX Designer
      "design-process": "bg-pink-500/10 text-pink-500 border-pink-500/20",
      portfolio: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      collaboration: "bg-violet-500/10 text-violet-500 border-violet-500/20",

      // Data Scientist
      "data-analysis": "bg-teal-500/10 text-teal-500 border-teal-500/20",
      "business-impact":
        "bg-orange-500/10 text-orange-500 border-orange-500/20",

      // Marketing
      creative: "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20",
      analytics: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    };

    return (
      colorMap[category] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
    );
  };

  const formatCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-mono text-muted-foreground">
            Question {currentQuestion} of {totalQuestions}
          </span>
          {/* ✅ 여기 수정됨 */}
          <div
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(question.category)}`}
          >
            {formatCategory(question.category)}
          </div>
        </div>

        {question.context && (
          <p className="text-sm text-muted-foreground mb-4 italic">
            {question.context}
          </p>
        )}

        <h2 className="text-2xl font-semibold leading-relaxed">
          {question.question}
        </h2>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={onSkip}
          className="flex-1 gap-2"
          disabled={isRecording}
        >
          <SkipForward className="w-5 h-5" />
          Skip This Question
        </Button>

        <Button
          size="lg"
          onClick={onAnswer}
          className={`flex-1 gap-2 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"}`}
        >
          <Mic className="w-5 h-5" />
          {isRecording ? "Stop Recording" : "Start Answering"}
        </Button>
      </div>
    </Card>
  );
}
