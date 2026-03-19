"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";

interface TargetCompanyProps {
  company: string;
  onChange: (company: string) => void;
  onNext: () => void;
  onSkip: () => void;
}

export default function TargetCompany({
  company,
  onChange,
  onNext,
  onSkip,
}: TargetCompanyProps) {
  return (
    <div className="w-full max-w-[940px] mx-auto animate-fadeInUp">
      <h2 className="text-[32px] font-bold tracking-tight mb-3 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
        Target Company
      </h2>
      <p className="text-muted-foreground mb-12">
        Optional — we&apos;ll tailor questions to the company
      </p>

      <div className="mb-12">
        <Input
          type="text"
          value={company}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Google, Meta, Stripe..."
          className="h-16 rounded-[20px] text-lg px-7 bg-card border-border focus-visible:ring-4 focus-visible:ring-primary/30"
        />
      </div>

      <div className="flex justify-end gap-4 md:flex-col-reverse">
        <Button
          variant="outline"
          size="lg"
          onClick={onSkip}
          className="px-8 rounded-2xl border-2 hover:-translate-y-0.5"
        >
          Skip
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          className="px-8 rounded-2xl gap-2 shadow-[0_4px_16px_hsl(var(--primary)/0.3)] hover:shadow-[0_8px_24px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
