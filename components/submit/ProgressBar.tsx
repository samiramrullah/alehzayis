"use client";

const labels = ["Level", "Language", "Upload", "Quote", "Info", "Payment"];

type ProgressBarProps = {
  maxStep: number;
  steps: Record<string, number>;
};

export default function ProgressBar({ maxStep }: ProgressBarProps) {
  if (maxStep === 0) return null;

  const total = labels.length;
  const current = Math.min(maxStep, total);

  return (
    <div className="sticky top-0 z-40 border-b border-[#4A1521]/10 bg-[#FBF7EF]/95 px-6 py-[14px] backdrop-blur-sm sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[640px] items-center gap-[6px]">
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber <= current;
          return (
            <div key={label} className={`h-[3px] flex-1 ${isDone ? "bg-[#C59B27]" : "bg-[#4A1521]/10"}`} />
          );
        })}
      </div>
    </div>
  );
}