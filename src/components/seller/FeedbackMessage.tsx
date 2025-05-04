import React from "react";

interface FeedbackMessageProps {
  error?: string;
  success?: string;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  error,
  success,
}) => {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <div className="mb-3 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-3 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2 text-sm">
          {success}
        </div>
      )}
    </>
  );
};

export default FeedbackMessage;
