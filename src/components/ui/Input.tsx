import React from "react";

export interface InputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "number" | "password";
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  required = false,
  type = "text",
  value,
  onChange,
  className = "",
  name,
  disabled = false,
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block mb-1 font-medium text-gray-700" htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
