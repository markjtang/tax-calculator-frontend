import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  return (
    <div className="error" role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

export default ErrorMessage; 