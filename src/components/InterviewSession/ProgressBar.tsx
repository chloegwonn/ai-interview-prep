"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  timeElapsed: string;
  totalTime: string;
}

export default function ProgressBar({
  current,
  total,
  timeElapsed,
  totalTime,
}: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-mono text-muted-foreground">
          Progress: {current}/{total} questions
        </span>
        <span className="font-mono text-muted-foreground">
          Time: {timeElapsed} / {totalTime}
        </span>
      </div>

      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all ${
              i < current
                ? "bg-primary"
                : i === current
                  ? "bg-primary/50"
                  : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
