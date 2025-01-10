import React from "react";
import { Input } from "@/components/ui/input";

type TextInputProps = {
  type: "text" | "textarea" | "email" | "password" | "checkbox" | "select";
  name: string;
  value: string;
  ariaLabel? : string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  register?: any;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select input
};

const TextInput: React.FC<TextInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  register,
  label,
  error,
  disabled,
  required,
  ariaLabel,
  options,
}) => {
  const baseClass = `w-full    border rounded-lg h-11 focus:outline-none ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  return (
    <div className="text-input ">
      {label && (
        <label htmlFor={name} className="block mb-2 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
        aria-label={ariaLabel}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${baseClass} resize-none`}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={baseClass}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={type}
          id={name}
          name={name}
          value={value}
          {...register(name)}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={baseClass}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;
