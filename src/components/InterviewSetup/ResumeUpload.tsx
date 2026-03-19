"use client";

import { useState, useCallback } from "react";
import { InterviewSetup } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Play, AlertCircle } from "lucide-react";

interface ResumeUploadProps {
  setup: InterviewSetup;
  onFileSelect: (file: File | undefined) => void;
  onStartInterview: () => void;
}

export default function ResumeUpload({
  setup,
  onFileSelect,
  onStartInterview,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>();
  const [error, setError] = useState<string>(""); // ← 에러 상태 추가

  const validateFile = (file: File): boolean => {
    // PDF 확인
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only");
      return false;
    }

    // 파일 크기 확인 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return false;
    }

    setError(""); // 에러 클리어
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        if (validateFile(files[0])) {
          onFileSelect(files[0]);
          setFileName(files[0].name);
        }
      }
    },
    [onFileSelect],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        if (validateFile(files[0])) {
          onFileSelect(files[0]);
          setFileName(files[0].name);
        }
      }
    },
    [onFileSelect],
  );

  return (
    <div className="w-full max-w-[940px] mx-auto animate-fadeInUp">
      <h2 className="text-[32px] font-bold tracking-tight mb-3 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
        Upload Resume
      </h2>
      <p className="text-muted-foreground mb-10">
        Optional — helps AI ask more relevant questions
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-500">Upload Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-3xl bg-card p-16 mb-10 transition-all
          ${
            isDragging
              ? "border-primary bg-card/80 shadow-[0_0_0_4px_hsl(var(--primary)/0.3)]"
              : "border-border"
          }
          ${error ? "border-red-500/50" : ""}
        `}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <label
          htmlFor="resume-upload"
          className="flex flex-col items-center cursor-pointer group"
        >
          {fileName ? (
            <>
              <FileText className="w-12 h-12 text-primary mb-5 transition-transform group-hover:-translate-y-1 group-hover:scale-105" />
              <div className="text-lg font-semibold mb-2">{fileName}</div>
              <div className="text-sm text-muted-foreground">
                Click to replace
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-primary mb-5 transition-transform group-hover:-translate-y-1 group-hover:scale-105" />
              <div className="text-muted-foreground">
                Drop your PDF here or click to browse
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                PDF only, max 10MB
              </div>
            </>
          )}
        </label>
      </div>

      <Card className="p-8 mb-8 bg-card border-border">
        <div className="text-[11px] font-semibold tracking-widest text-muted-foreground mb-6 font-mono">
          INTERVIEW SUMMARY
        </div>
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <div className="text-muted-foreground">Role</div>
            <div className="font-semibold text-primary">
              {setup.role || "—"}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-muted-foreground">Experience</div>
            <div className="font-semibold text-primary">
              {setup.experience ? `${setup.experience} years` : "—"}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-muted-foreground">Target Company</div>
            <div className="font-semibold text-primary">
              {setup.company || "Any"}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-muted-foreground">Resume</div>
            <div className="font-semibold text-primary">
              {fileName || "Not uploaded"}
            </div>
          </div>
        </div>
      </Card>

      <Button
        size="lg"
        onClick={onStartInterview}
        className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-[0_8px_24px_hsl(var(--primary)/0.3)] hover:shadow-[0_12px_32px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5"
      >
        <Play className="w-6 h-6" />
        {fileName ? "Analyze Resume" : "Start Interview"}
      </Button>
    </div>
  );
}
