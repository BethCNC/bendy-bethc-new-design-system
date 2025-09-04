import { type ClassValue, clsx } from "clsx";

// Since you don't have tailwind-merge, we'll use a simple class merger
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Helper to get CSS variable values
export function getCSSVar(variable: string): string {
  return `var(${variable})`;
}

// Helper for responsive classes based on your design system breakpoints
export function responsive(mobile: string, tablet?: string, desktop?: string): string {
  let classes = mobile;
  
  if (tablet) {
    classes += ` tablet:${tablet}`;
  }
  
  if (desktop) {
    classes += ` desktop:${desktop}`;
  }
  
  return classes;
}

// Helper to map design token values
export function mapToken(tokenPath: string): string {
  return `var(--${tokenPath.replace(/\./g, '-')})`;
}