import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  showValue?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", showValue, label, ...props }, ref) => {
    const percentage = value && max ? Math.min(100, (value / max) * 100) : 0;

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700",
          className
        )}
        {...props}
      >
        <div
          className={cn("h-full transition-all duration-300", {
            "bg-violet-600 dark:bg-violet-500": variant === "default",
            "bg-green-600 dark:bg-green-500": variant === "success",
            "bg-amber-600 dark:bg-amber-500": variant === "warning",
            "bg-red-600 dark:bg-red-500": variant === "danger",
          })}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

// Компонент прогресса опыта персонажа
const ExperienceBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  currentXP: number;
  requiredXP: number;
  level: number;
}
>(({ className, currentXP, requiredXP, level, ...props }, ref) => {
  const percentage = Math.min(100, (currentXP / requiredXP) * 100);

  return (
    <div
      ref={ref}
      className={cn("space-y-1", className)}
      {...props}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <div className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
            {level}
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">Уровень {level}</span>
        </div>
        <span className="text-slate-600 dark:text-slate-400">
          {currentXP} / {requiredXP} XP
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

ExperienceBar.displayName = "ExperienceBar";

// Компонент для отображения завершенных задач
const CompletionProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  completed: number;
  total: number;
  title?: string;
}
>(({ className, completed, total, title = "Завершено задач", ...props }, ref) => {
  const percentage = Math.min(100, (completed / total) * 100);

  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {completed} из {total}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full bg-green-600 dark:bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-center text-slate-500 dark:text-slate-400">
        {percentage.toFixed(0)}% выполнено
      </div>
    </div>
  );
});

CompletionProgress.displayName = "CompletionProgress";

export { Progress, ExperienceBar, CompletionProgress };