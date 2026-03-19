"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface RedFlag {
  issue: string;
  followUp: string;
}

interface RedFlagsProps {
  flags: RedFlag[];
}

export default function RedFlags({ flags }: RedFlagsProps) {
  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold">Areas to Explore</h2>
      </div>

      <div className="space-y-6">
        {flags.map((flag, index) => (
          <div key={index} className="space-y-2">
            <div className="flex gap-2 items-start">
              <span className="text-amber-500 mt-1">⚠️</span>
              <p className="text-foreground font-medium">{flag.issue}</p>
            </div>
            <div className="ml-6 pl-4 border-l-2 border-primary/30">
              <p className="text-sm text-muted-foreground">
                🎯 <span className="font-semibold">Suggested follow-up:</span>{" "}
                &quot;
                {flag.followUp}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
