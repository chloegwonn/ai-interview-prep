interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex gap-2 w-full max-w-[940px] mx-auto mb-15">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`
            flex-1 h-[3px] rounded-sm relative overflow-hidden transition-all
            ${
              i < currentStep || i === currentStep
                ? "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
                : "bg-border"
            }
          `}
        >
          {i === currentStep && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          )}
        </div>
      ))}
    </div>
  );
}
