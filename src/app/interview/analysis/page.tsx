"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, Loader2, AlertCircle } from "lucide-react";
import ResumeHighlights from "@/components/InterviewAnalysis/ResumeHighlights";
import RedFlags from "@/components/InterviewAnalysis/RedFlags";
import StrategyTips from "@/components/InterviewAnalysis/StrategyTips";
import { ResumeAnalysis } from "@/types/interview";
import { analyzeResume } from "@/lib/gemini";
import { extractTextFromPDF } from "@/lib/pdf-parser";

export default function AnalysisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  console.log("analysis", analysis);
  useEffect(() => {
    analyzeResumeData();
  }, []);

  const analyzeResumeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const setupData = sessionStorage.getItem("interviewSetup");
      if (!setupData) {
        throw new Error("No interview setup data found");
      }

      const setup = JSON.parse(setupData);

      if (!setup.resumeData) {
        throw new Error("No resume uploaded");
      }

      const resumeText = await extractTextFromPDF(setup.resumeData);

      const result = await analyzeResume(
        resumeText,
        setup.role || "Software Developer",
        setup.experience || "1-2",
      );

      setAnalysis(result);
      setIsLoading(false);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze resume");
      setIsLoading(false);
    }
  };

  const handleStartInterview = () => {
    router.push("/interview/session");
  };

  const handleBack = () => {
    router.push("/interview/setup");
  };

  const handleRetry = () => {
    analyzeResumeData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Analyzing Your Resume...
            </h2>
            <p className="text-muted-foreground">
              AI is reading your experience and skills
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-8 gap-2 hover:bg-card"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>

        {error && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-500 mb-1">
                Analysis Warning
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-2"
              >
                Retry Analysis
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl font-bold mb-4">Resume Analysis Complete</h1>
          <p className="text-lg text-muted-foreground">
            Here&apos;s what we found and how to prepare
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            <ResumeHighlights highlights={analysis.highlights} />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <RedFlags flags={analysis.redFlags} />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <StrategyTips tips={analysis.strategyTips} />
          </div>
        </div>

        <div className="animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            onClick={handleStartInterview}
            className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-[0_8px_24px_hsl(var(--primary)/0.3)] hover:shadow-[0_12px_32px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5"
          >
            <Play className="w-6 h-6" />
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
