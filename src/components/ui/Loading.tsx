import React from "react";

export const Loading: React.FC = () => (
  <div className="flex items-center justify-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
    <span className="ml-4 text-indigo-700 font-semibold text-lg">
      Loading...
    </span>
  </div>
);
