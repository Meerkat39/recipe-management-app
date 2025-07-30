import React from "react";

export interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
    role="alert"
  >
    <span className="block sm:inline font-semibold">{message}</span>
  </div>
);
