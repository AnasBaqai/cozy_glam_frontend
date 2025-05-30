import React from "react";
import { FormInputProps } from "../../../types/business.types";

const fieldBase =
  "h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-glam-dark placeholder-gray-400 focus:border-glam-primary focus:ring-1 focus:ring-glam-primary outline-none transition";

const FormInput: React.FC<FormInputProps> = ({
  label,
  className,
  requiredMark,
  ...props
}) => (
  <label className="block text-xs font-medium text-glam-dark">
    {label}
    {requiredMark && <span className="text-red-500 ml-1">*</span>}
    <input {...props} className={`${fieldBase} mt-1 ${className ?? ""}`} />
  </label>
);

export default FormInput;
