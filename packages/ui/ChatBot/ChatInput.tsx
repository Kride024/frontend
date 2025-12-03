// ChatInput.tsx
import React from "react";
import tailwindStyles from "@packages/styles/tailwindStyles";

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  onInputChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          className={`${tailwindStyles.paragraph} flex-1 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          type="submit"
          className={`${tailwindStyles.secondaryButton} px-4`}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
