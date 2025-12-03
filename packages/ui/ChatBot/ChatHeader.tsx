// ChatHeader.tsx
import React from "react";
import { X } from "lucide-react";
import tailwindStyles from "@packages/styles/tailwindStyles";

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className={tailwindStyles.heading_2}>Chat with us</h2>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
