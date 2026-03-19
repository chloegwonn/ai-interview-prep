"use client";

import {
  EXPERIENCE_LEVELS,
  ExperienceLevel as ExpLevel,
} from "@/types/interview";
import { Check } from "lucide-react";

interface ExperienceLevelProps {
  selectedLevel?: ExpLevel;
  onSelect: (level: ExpLevel) => void;
}

export default function ExperienceLevel({
  selectedLevel,
  onSelect,
}: ExperienceLevelProps) {
  return (
    <div className="w-full max-w-[940px] mx-auto animate-fadeInUp">
      <h2 className="text-[32px] font-bold tracking-tight mb-3 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
        Experience Level
      </h2>
      <p className="text-muted-foreground mb-12">
        How many years of experience do you have?
      </p>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-1">
        {EXPERIENCE_LEVELS.map((level, index) => (
          <button
            key={level.value}
            onClick={() => onSelect(level.value)}
            style={{ animationDelay: `${index * 0.08}s` }}
            className={`
              relative bg-card border-2 rounded-3xl p-10 text-left
              overflow-hidden transition-all duration-300 animate-scaleIn
              hover:border-primary/50 hover:bg-card/80 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-primary/10
              before:opacity-0 before:transition-opacity hover:before:opacity-50
              ${
                selectedLevel === level.value
                  ? "border-primary bg-card/80 shadow-[0_0_0_1px_hsl(var(--primary)),0_12px_48px_hsl(var(--primary)/0.3)] before:opacity-70"
                  : "border-border"
              }
            `}
          >
            <div className="relative z-10">
              <div className="text-[28px] font-bold mb-2 tracking-tight">
                {level.label}
              </div>
              <div className="text-muted-foreground font-medium">
                {level.subtitle}
              </div>
            </div>

            {selectedLevel === level.value && (
              <div className="absolute top-5 right-5 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-20 animate-scaleIn shadow-[0_4px_12px_hsl(var(--primary)/0.3)]">
                <Check
                  className="w-5 h-5 text-primary-foreground"
                  strokeWidth={2.5}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
