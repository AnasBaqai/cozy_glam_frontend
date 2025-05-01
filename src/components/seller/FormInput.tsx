import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  requiredMark?: boolean;
}

const fieldBase =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-glam-dark placeholder-gray-400 focus:border-glam-primary focus:ring-2 focus:ring-glam-primary outline-none transition";

const FormInput: React.FC<FormInputProps> = ({
  label,
  className,
  requiredMark,
  ...props
}) => (
  <label className="block text-sm font-medium text-glam-dark">
    {label}
    {requiredMark && <span className="text-red-500 ml-1">*</span>}
    <input {...props} className={`${fieldBase} mt-2 ${className ?? ""}`} />
  </label>
);

export default FormInput;
