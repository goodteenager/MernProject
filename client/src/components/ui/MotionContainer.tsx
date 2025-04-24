import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Примечание: для правильной работы этого компонента нужно установить framer-motion:
// npm install framer-motion

export interface MotionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
  isVisible?: boolean;
}

const MotionContainer = React.forwardRef<HTMLDivElement, MotionContainerProps>(
  ({
     className,import * as React from "react";
     import { cn } from "@/lib/utils";

     export interface InputProps
     extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:ring-offset-slate-900 dark:placeholder:text-slate-400 dark:focus-visible:ring-violet-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Создаём компонент для ввода задачи с выбором приоритета
const TaskInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  onSubmit?: (value: string, priority: string) => void;
  placeholder?: string;
}
>(({ className, onSubmit, placeholder = "Добавить новую задачу...", ...props }, ref) => {
  const [value, setValue] = React.useState("");
  const [priority, setPriority] = React.useState("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSubmit) {
      onSubmit(value, priority);
      setValue("");
    }
  };

  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50"
            disabled={!value.trim()}
          >
            Добавить
          </button>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Приоритет:</span>
          <div className="flex items-center space-x-2">
            {["low", "medium", "high"].map((p) => (
              <label key={p} className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                  className="accent-violet-600"
                />
                <span className={cn({
                  "text-green-600 dark:text-green-400": p === "low",
                  "text-amber-600 dark:text-amber-400": p === "medium",
                  "text-red-600 dark:text-red-400": p === "high",
                })}>
                  {p === "low" ? "Низкий" : p === "medium" ? "Средний" : "Высокий"}
                </span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
});

TaskInput.displayName = "TaskInput";

export { Input, TaskInput };
     children,
     initial = { opacity: 0 },
     animate = { opacity: 1 },
     exit = { opacity: 0 },
     transition = { duration: 0.3 },
     isVisible = true,
     ...props
   }, ref) => {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            className={cn(className)}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

MotionContainer.displayName = "MotionContainer";

// Компонент для анимации достижений
const AchievementPopup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  isVisible?: boolean;
  onClose?: () => void;
}
>(({ className, title, description, isVisible = false, onClose, ...props }, ref) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          className={cn(
            "fixed bottom-4 right-4 max-w-md p-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg shadow-lg text-white z-50",
            className
          )}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          {...props}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold">Достижение получено!</h3>
                <p className="text-lg font-semibold">{title}</p>
                {description && <p className="text-sm opacity-90">{description}</p>}
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white opacity-70 hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AchievementPopup.displayName = "AchievementPopup";

// Компонент для анимации уровня
const LevelUpAnimation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  level: number;
  isVisible?: boolean;
  onClose?: () => void;
}
>(({ className, level, isVisible = false, onClose, ...props }, ref) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          className={cn(
            "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...props}
        >
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-violet-800 rounded-lg px-12 py-8 text-center text-white shadow-xl"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-4"
            >
              <div className="mx-auto h-24 w-24 rounded-full bg-amber-400 flex items-center justify-center ring-4 ring-amber-200">
                <span className="text-3xl font-bold text-slate-900">{level}</span>
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              Уровень повышен!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg mb-6"
            >
              Ваш персонаж достиг {level} уровня
            </motion.p>
            {onClose && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="px-6 py-2 bg-white text-violet-800 rounded-full font-medium hover:bg-opacity-90 transition-colors"
              >
                Продолжить
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LevelUpAnimation.displayName = "LevelUpAnimation";

export { MotionContainer, AchievementPopup, LevelUpAnimation };