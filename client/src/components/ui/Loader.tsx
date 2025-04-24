import * as React from "react";
import { cn } from "@/lib/utils";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary";
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-t-2 border-b-2",
            {
              "h-4 w-4 border-t-violet-600 border-b-violet-200": size === "sm" && variant === "default",
              "h-8 w-8 border-t-violet-600 border-b-violet-200": size === "md" && variant === "default",
              "h-12 w-12 border-t-violet-600 border-b-violet-200": size === "lg" && variant === "default",
              "h-4 w-4 border-t-slate-600 border-b-slate-200": size === "sm" && variant === "secondary",
              "h-8 w-8 border-t-slate-600 border-b-slate-200": size === "md" && variant === "secondary",
              "h-12 w-12 border-t-slate-600 border-b-slate-200": size === "lg" && variant === "secondary",
            }
          )}
        />
      </div>
    );
  }
);

Loader.displayName = "Loader";

// Компонент для отображения загрузки с текстом
const LoaderWithText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary";
}
>(({ className, text = "Загрузка...", size = "md", variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center space-y-2", className)}
      {...props}
    >
      <Loader size={size} variant={variant} />
      <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  );
});

LoaderWithText.displayName = "LoaderWithText";

// Компонент для загрузки достижений
const AchievementLoader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center py-8", className)}
      {...props}
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 animate-ping rounded-full bg-amber-500 opacity-75" />
        </div>
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white animate-pulse"
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
      </div>
    </div>
  );
});

AchievementLoader.displayName = "AchievementLoader";

export { Loader, LoaderWithText, AchievementLoader };