// TypingIndicator.tsx
import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
