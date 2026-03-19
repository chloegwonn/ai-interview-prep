"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import QuestionCard from "@/components/InterviewSession/QuestionCard";
import ProgressBar from "@/components/InterviewSession/ProgressBar";
import { InterviewQuestion } from "@/types/interview";
import { generateInterviewQuestions } from "@/lib/gemini";
import { extractTextFromPDF } from "@/lib/pdf-parser";

interface QuestionResult {
  questionId: number;
  question: string;
  category: string;
  skipped: boolean;
  timeSpent: number;
  recordedAnswer?: Blob;
}

export default function InterviewSessionPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [results, setResults] = useState<QuestionResult[]>([]);

  // ✅ 함수로 초기값 설정
  const [questionStartTime, setQuestionStartTime] = useState<number>(() =>
    Date.now(),
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // ✅ 타이머 effect
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [questionStartTime]);

  // ✅ 포맷 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 질문 로드
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);

      const cachedQuestions = sessionStorage.getItem("interviewQuestions");
      if (cachedQuestions) {
        console.log("✅ Using cached questions");
        setQuestions(JSON.parse(cachedQuestions));
        setIsLoading(false);
        setQuestionStartTime(Date.now());
        setElapsedSeconds(0);
        return;
      }

      const setupData = sessionStorage.getItem("interviewSetup");
      if (!setupData) {
        throw new Error("No interview setup found");
      }

      const setup = JSON.parse(setupData);

      let resumeText = "";
      if (setup.resumeData) {
        resumeText = await extractTextFromPDF(setup.resumeData);
      }

      console.log("🤖 Generating questions with Gemini...");

      const generatedQuestions = await generateInterviewQuestions(
        resumeText,
        setup.role || "Software Developer",
        setup.experience || "1-2",
      );

      setQuestions(generatedQuestions);
      sessionStorage.setItem(
        "interviewQuestions",
        JSON.stringify(generatedQuestions),
      );
      console.log("✅ Questions generated:", generatedQuestions.length);
      setIsLoading(false);
      setQuestionStartTime(Date.now());
      setElapsedSeconds(0);
    } catch (err) {
      console.error("Failed to load questions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate questions",
      );
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    setResults([
      ...results,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        category: currentQuestion.category,
        skipped: true,
        timeSpent,
      },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
      setElapsedSeconds(0);
    } else {
      saveResults([
        ...results,
        {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          category: currentQuestion.category,
          skipped: true,
          timeSpent,
        },
      ]);
      router.push("/interview/feedback");
    }
  };

  const handleAnswer = async () => {
    if (isRecording) {
      // 녹음 중지
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    } else {
      // 녹음 시작
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);

        const audioChunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const currentQuestion = questions[currentQuestionIndex];
          const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

          const newResult: QuestionResult = {
            questionId: currentQuestion.id,
            question: currentQuestion.question,
            category: currentQuestion.category,
            skipped: false,
            timeSpent,
            recordedAnswer: audioBlob,
          };

          const updatedResults = [...results, newResult];
          setResults(updatedResults);

          stream.getTracks().forEach((track) => track.stop());

          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setQuestionStartTime(Date.now());
            setElapsedSeconds(0);
          } else {
            saveResults(updatedResults);
            router.push("/interview/feedback");
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Please allow microphone access to record your answer");
      }
    }
  };

  const saveResults = (finalResults: QuestionResult[]) => {
    const sessionData = {
      totalQuestions: questions.length,
      answeredCount: finalResults.filter((r) => !r.skipped).length,
      skippedCount: finalResults.filter((r) => r.skipped).length,
      averageTime: Math.floor(
        finalResults.reduce((sum, r) => sum + r.timeSpent, 0) /
          finalResults.length,
      ),
      results: finalResults.map((r) => ({
        ...r,
        recordedAnswer: undefined,
      })),
    };

    sessionStorage.setItem("sessionResults", JSON.stringify(sessionData));
    console.log("💾 Session results saved:", sessionData);
  };

  const handleBack = () => {
    router.push("/interview/analysis");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Generating Interview Questions...
            </h2>
            <p className="text-muted-foreground">
              AI is preparing personalized questions
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error || "No questions available"}</p>
          <Button onClick={() => router.push("/interview/setup")}>
            Back to Setup
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-8 gap-2 hover:bg-card"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Analysis
        </Button>

        <div className="mb-12">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
            timeElapsed={formatTime(elapsedSeconds)}
            totalTime="10:00"
          />
        </div>

        <QuestionCard
          question={currentQuestion}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onSkip={handleSkip}
          onAnswer={handleAnswer}
          isRecording={isRecording}
        />

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Tip: Take 10-15 seconds to think before answering
          </p>
        </div>
      </div>
    </div>
  );
}
