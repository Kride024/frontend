// ChatMessageList.tsx
import React from "react";
import { Message } from "./types";
import ChatMessageBubble from "./ChatMessageBubble";
import TypingIndicator from "./TypingIndicator";

interface ChatMessageListProps {
  messages: Message[];
  isTyping: boolean;
  chatRef: React.RefObject<HTMLDivElement>;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isTyping,
  chatRef,
}) => {
  return (
    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.type === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <ChatMessageBubble message={message} />
          </div>
        </div>
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default ChatMessageList;
