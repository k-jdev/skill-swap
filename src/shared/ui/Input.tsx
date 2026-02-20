import React from "react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label?: string;
  className?: string;
  error?: string | null;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = "", error, ...inputProps }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium " htmlFor={id}>
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full p-4 rounded-[1rem] bg-[#e7edf3] dark:bg-input-dark border-none focus:ring-2 focus:ring-primary focus:outline-none placeholder-subtle-light dark:placeholder-subtle-dark ${className} ${
            error ? "ring-2 ring-red-500" : ""
          }`}
          {...inputProps}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
