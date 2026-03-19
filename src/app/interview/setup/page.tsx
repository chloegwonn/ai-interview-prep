"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/InterviewSetup/StepIndicator";
import RoleSelection from "@/components/InterviewSetup/RoleSelection";
import ExperienceLevel from "@/components/InterviewSetup/ExperienceLevel";
import TargetCompany from "@/components/InterviewSetup/TargetCompany";
import ResumeUpload from "@/components/InterviewSetup/ResumeUpload";
import { InterviewSetup, ExperienceLevel as ExpLevel } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles } from "lucide-react";

export default function InterviewSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [setup, setSetup] = useState<InterviewSetup>({});

  const totalSteps = 4;

  const handleRoleSelect = (role: string) => {
    setSetup({ ...setup, role });
  };

  const handleRoleContinue = () => {
    setCurrentStep(1);
  };

  const handleExperienceSelect = (experience: ExpLevel) => {
    setSetup({ ...setup, experience });
    setTimeout(() => setCurrentStep(2), 300);
  };

  const handleCompanyChange = (company: string) => {
    setSetup({ ...setup, company });
  };

  const handleCompanyNext = () => {
    setCurrentStep(3);
  };

  const handleCompanySkip = () => {
    setSetup({ ...setup, company: "" });
    setCurrentStep(3);
  };

  const handleFileSelect = (file: File | undefined) => {
    setSetup({ ...setup, resumeFile: file });
  };

  const handleAnalyzeResume = async () => {
    if (setup.resumeFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const setupToSave = {
          ...setup,
          resumeFile: null,
          resumeData: base64,
          resumeName: setup.resumeFile?.name,
        };
        sessionStorage.setItem("interviewSetup", JSON.stringify(setupToSave));
        router.push("/interview/analysis");
      };
      reader.readAsDataURL(setup.resumeFile);
    } else {
      sessionStorage.setItem("interviewSetup", JSON.stringify(setup));
      router.push("/interview/analysis");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-20 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full text-[13px] font-semibold text-primary mb-8 font-mono tracking-wide">
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI Voice Interview
          </div>
          <h1 className="text-[64px] font-bold tracking-tight leading-tight mb-5 md:text-5xl">
            Prep Your{" "}
            <span className="relative bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Interview
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/70 rounded-full" />
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Set up your mock interview and practice with AI
          </p>
        </header>

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <main className="relative z-10">
          {currentStep === 0 && (
            <RoleSelection
              selectedRole={setup.role}
              onSelect={handleRoleSelect}
              onContinue={handleRoleContinue}
            />
          )}

          {currentStep === 1 && (
            <ExperienceLevel
              selectedLevel={setup.experience}
              onSelect={handleExperienceSelect}
            />
          )}

          {currentStep === 2 && (
            <TargetCompany
              company={setup.company || ""}
              onChange={handleCompanyChange}
              onNext={handleCompanyNext}
              onSkip={handleCompanySkip}
            />
          )}

          {currentStep === 3 && (
            <ResumeUpload
              setup={setup}
              onFileSelect={handleFileSelect}
              onStartInterview={handleAnalyzeResume}
            />
          )}
        </main>

        {currentStep > 0 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="fixed top-8 left-8 gap-2 hover:bg-card z-50 animate-fadeInUp md:left-5 md:top-5"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
