import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNestedError(errors: Record<string, unknown> | undefined, name: string): string | undefined {
  if (!errors || !name) return undefined;
  
  const path = name.split('.');
  let current: any = errors;
  
  for (const key of path) {
    if (current?.[key] === undefined) {
      return undefined;
    }
    current = current[key];
  }
  
  return current?.message as string | undefined;
}
