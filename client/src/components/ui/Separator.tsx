import * as React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "shrink-0 bg-slate-200 dark:bg-slate-700",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

// Создаем декоративный разделитель для секций
const SectionDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
}
>(({ className, label, ...props }, ref) => {
  if (!label) {
    return (
      <div
        ref={ref}
        className={cn("flex items-center py-4", className)}
        {...props}
      >
        <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center py-4", className)}
      {...props}
    >
      <Separator className="flex-grow bg-slate-200 dark:bg-slate-700" />
      <span className="mx-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <Separator className="flex-grow bg-slate-200 dark:bg-slate-700" />
    </div>
  );
});

SectionDivider.displayName = "SectionDivider";

// Создаем разделитель для достижений
const AchievementDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center py-3", className)}
      {...props}
    >
      <Separator className="flex-grow bg-gradient-to-r from-violet-500 to-transparent" />
      <div className="mx-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-violet-600 dark:text-violet-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      </div>
      <Separator className="flex-grow bg-gradient-to-l from-violet-500 to-transparent" />
    </div>
  );
});

AchievementDivider.displayName = "AchievementDivider";

export { Separator, SectionDivider, AchievementDivider };