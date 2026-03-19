"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ResumeHighlightsProps {
  highlights: string[];
}

export default function ResumeHighlights({
  highlights,
}: ResumeHighlightsProps) {
  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Resume Highlights</h2>
      </div>

      <div className="space-y-3">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-foreground leading-relaxed">{highlight}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          💡 <span className="font-semibold">Notable:</span> Cross-industry
          experience is rare for 3 years of experience
        </p>
      </div>
    </Card>
  );
}
