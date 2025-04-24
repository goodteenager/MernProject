import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  level?: number;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback, level, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-violet-500 bg-slate-800",
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-violet-800 text-sm font-medium text-white">
            {fallback || alt.slice(0, 2)}
          </span>
        )}
        {level !== undefined && (
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-900">
            {level}
          </div>
        )}
      </div>
    );
  }
);
export const AvatarImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} className="h-full w-full object-cover" />
);

export const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-full w-full items-center justify-center bg-violet-800 text-sm font-medium text-white">
    {children}
  </span>
);

Avatar.displayName = "Avatar";