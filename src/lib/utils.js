import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge must know our custom token names so `cn("shadow-xs",
// "shadow-card")` keeps only the last one (theme.css defines these).
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ["xs", "sm", "card", "raised", "overlay"],
      radius: ["sm", "md", "lg", "xl", "full"],
      text: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"],
    },
  },
});

/** Joins class names and resolves conflicting Tailwind classes. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
