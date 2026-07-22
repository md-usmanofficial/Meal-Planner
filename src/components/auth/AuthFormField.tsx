/**
 * AuthFormField — reusable labeled form field with inline error display.
 * Wraps shadcn Label + Input/child component + error message.
 */

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AuthFormFieldProps {
  id: string;
  label: string;
  error?: string | string[];
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function AuthFormField({
  id,
  label,
  error,
  required,
  className,
  children,
}: AuthFormFieldProps) {
  const errorMessage = Array.isArray(error) ? error[0] : error;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-0.5 text-destructive" aria-hidden>
            *
          </span>
        )}
      </Label>
      {children}
      {errorMessage && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-destructive"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
