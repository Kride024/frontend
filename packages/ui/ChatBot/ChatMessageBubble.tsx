// ChatMessageBubble.tsx
import React from "react";
import { Message } from "./types";

interface ChatMessageBubbleProps {
  message: Message;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const { text, isLink, buttonText } = message;

  if (isLink) {
    return (
      <button
        onClick={() => (window.location.href = text)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-2"
      >
        <span>{buttonText || "Visit Page"}</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </button>
    );
  }

  return <pre className="whitespace-pre-wrap">{text}</pre>;
};

export default ChatMessageBubble;
