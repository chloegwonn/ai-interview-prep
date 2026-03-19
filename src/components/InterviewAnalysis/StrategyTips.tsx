"use client";

import { Card } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertTriangle, Zap } from "lucide-react";

interface StrategyTipsProps {
  tips: {
    strengths: string[];
    pitfalls: string[];
    powerPhrases: string[];
  };
}

export default function StrategyTips({ tips }: StrategyTipsProps) {
  return (
    <Card className="p-8 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Interview Strategy Tips</h2>
      </div>

      <div className="space-y-6">
        {/* Strengths to Showcase */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <h3 className="font-semibold text-sm">Strengths to Showcase</h3>
          </div>
          <div className="space-y-2 ml-6">
            {tips.strengths.map((strength, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-green-500 text-sm">✨</span>
                <p className="text-sm text-muted-foreground">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Pitfalls */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-sm">Common Pitfalls to Avoid</h3>
          </div>
          <div className="space-y-2 ml-6">
            {tips.pitfalls.map((pitfall, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-amber-500 text-sm">⚠️</span>
                <p className="text-sm text-muted-foreground">{pitfall}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Power Phrases */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Power Phrases</h3>
          </div>
          <div className="space-y-2 ml-6">
            {tips.powerPhrases.map((phrase, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-primary text-sm">🎯</span>
                <p className="text-sm text-muted-foreground italic">
                  &quot;{phrase}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
