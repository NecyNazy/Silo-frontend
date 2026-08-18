import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950 dark:disabled:bg-slate-800 dark:disabled:text-slate-500',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
