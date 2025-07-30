import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const paddingClass =
    padding === "sm" ? "p-2" : padding === "lg" ? "p-6" : "p-4";
  return (
    <div className={`bg-white rounded shadow ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};
