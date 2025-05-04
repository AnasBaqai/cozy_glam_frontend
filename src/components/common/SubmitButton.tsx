import React from "react";

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  loading: boolean;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "button";
  onClick?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  loadingLabel,
  loading,
  disabled = false,
  className = "",
  type = "submit",
  onClick,
}) => {
  const baseClass =
    "w-full h-12 rounded-xl bg-glam-primary text-white font-medium text-lg hover:bg-glam-dark active:translate-y-px transition flex items-center justify-center";

  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {loadingLabel || "Processing..."}
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default SubmitButton;
