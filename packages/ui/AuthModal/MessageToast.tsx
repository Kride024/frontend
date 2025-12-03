// packages/ui/src/components/AuthModal/MessageToast.tsx
import React, { useEffect, useState } from "react";
import tailwindStyles from "@packages/styles/tailwindStyles";

interface Toast {
  type: "success" | "error";
  text: string;
}

const MessageToast: React.FC = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent<Toast>) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener("showToast", handler as EventListener);
    return () => window.removeEventListener("showToast", handler as EventListener);
  }, []);

  if (!toast) return null;

  return (
    <div
      className={`${tailwindStyles.paragraph} absolute top-2 w-[calc(100%-20px)] mb-4 p-2 text-center rounded ${
        toast.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {toast.text}
    </div>
  );
};

export default MessageToast;