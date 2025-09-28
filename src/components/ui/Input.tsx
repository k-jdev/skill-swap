import React from "react";

type InputProps = {
  type?: string;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      placeholder,
      label,
      id,
      className = "",
      value,
      onChange,
      error,
    },
    ref
  ) => {
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
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
