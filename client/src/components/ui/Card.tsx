import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-50",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-600 dark:text-slate-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const TaskCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  dueDate?: Date;
  progress?: number;
  priority?: "low" | "medium" | "high";
  xp?: number;
}
>(({ className, title, description, dueDate, progress, priority, xp, ...props }, ref) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
      {priority && (
        <div className={cn("h-1", {
          "bg-green-500": priority === "low",
          "bg-amber-500": priority === "medium",
          "bg-red-500": priority === "high",
        })} />
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{title}</CardTitle>
          {xp && (
            <span className="inline-flex items-center rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-800 dark:bg-violet-900 dark:text-violet-200">
              +{xp} XP
            </span>
          )}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {progress !== undefined && (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Прогресс</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700">
              <div
                className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        {dueDate && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Срок: {dueDate.toLocaleDateString('ru-RU')}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
TaskCard.displayName = "TaskCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  TaskCard
};