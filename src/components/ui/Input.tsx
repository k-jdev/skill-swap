import React from "react";

type InputProps = {
  type?: string;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
};

export default function Input({
  type = "text",
  placeholder,
  label,
  id,
  className = "",
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium " htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full p-4 rounded-[1rem] bg-[#e7edf3] dark:bg-input-dark border-none focus:ring-2 focus:ring-primary focus:outline-none placeholder-subtle-light dark:placeholder-subtle-dark ${className}`}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
