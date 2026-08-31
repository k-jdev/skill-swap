import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = "", error, hint, required, ...inputProps }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const describedBy =
      [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
      undefined;

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium" htmlFor={inputId}>
            {label}
            {required && (
              <span className="text-red-500" aria-hidden>
                {" *"}
              </span>
            )}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-2xl border border-transparent bg-field p-4 text-slate-800 placeholder-slate-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 ${className} ${
            error ? "border-red-500 ring-2 ring-red-500/30" : ""
          }`}
          {...inputProps}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
