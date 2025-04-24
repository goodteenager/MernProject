import * as React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  TaskCompleteToast,
  AchievementToast,
  type ToastProps,
} from "@/components/ui/Toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Обрабатываем специальные типы тостов
        if (props.type === "task-complete") {
          return (
            <TaskCompleteToast
              key={id}
              taskName={props.taskName || ""}
              xpGained={props.xpGained}
              {...props}
              {...(props as any)}
            />
          );
        }

        if (props.type === "achievement") {
          return (
            <AchievementToast
              key={id}
              title={title || ""}
              description={description}
              {...props}
              {...(props as any)}
            />
          );
        }

        // Стандартный тост
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}