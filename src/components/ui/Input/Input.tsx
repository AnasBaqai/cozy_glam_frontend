import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  className = "",
  labelClassName = "",
  inputClassName = "",
  ...props
}) => (
  <div className="space-y-1">
    {label && (
      <label
        htmlFor={props.id}
        className={`block font-medium text-glam-dark ${labelClassName}`}
      >
        {label}
      </label>
    )}
    <input
      className={`w-full px-3 py-2 border border-glam-accent rounded-md focus:outline-none focus:ring-2 focus:ring-glam-accent bg-white ${className} ${inputClassName}`}
      {...props}
    />
  </div>
);

export default Input;
