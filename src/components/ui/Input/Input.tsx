import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => (
  <div className="space-y-1">
    {label && (
      <label
        htmlFor={props.id}
        className="block text-base font-medium text-glam-dark"
      >
        {label}
      </label>
    )}
    <input
      className={`w-full px-3 py-2 border border-glam-accent rounded-md focus:outline-none focus:ring-2 focus:ring-glam-accent bg-white ${className}`}
      {...props}
    />
  </div>
);

export default Input;
