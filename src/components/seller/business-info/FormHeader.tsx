import React from "react";
import { FormHeaderProps } from "../../../types/business.types";

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  progressValue = 0.67, // Default progress value (2/3)
}) => {
  return (
    <>
      {/* Header */}
      <h1 className="font-serif text-2xl md:text-3xl font-semibold text-glam-dark mb-1">
        {title}
      </h1>

      {/* Progress bar */}
      <div className="mb-4 h-1 w-full rounded bg-glam-primary/20">
        <div
          className="h-full rounded bg-glam-primary"
          style={{ width: `${progressValue * 100}%` }}
        />
      </div>
    </>
  );
};

export default FormHeader;
