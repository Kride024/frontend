// src/components/SendAnnouncementModal.tsx
import { useEffect, useRef, useState } from "react";

// --- Types ---
type Audience = "managers" | "guests" | "both";

interface SendAnnouncementPayload {
  audience: Audience;
  category: string;
  message: string;
}

interface SendAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: SendAnnouncementPayload) => void;
}

// --- Helper Components ---
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-semibold text-gray-900 mb-3">{children}</h3>
);

interface CharacterCounterProps {
  value: string;
  maxLength: number;
}

const CharacterCounter: React.FC<CharacterCounterProps> = ({ value, maxLength }) => (
  <div className="text-xs text-right text-gray-500 mt-1">
    {value.length} / {maxLength}
  </div>
);

// --- Main Modal Component ---
const SendAnnouncementModal: React.FC<SendAnnouncementModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [audience, setAudience] = useState<Audience>("managers");
  const [category, setCategory] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const categoryOptions = [
    "Maintenance",
    "Events",
    "Compliance & Legal",
    "General Notices",
    "Emergency",
  ] as const;

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setAudience("managers");
      setCategory("");
      setMessage("");
      setCategoryOpen(false);
    }
  }, [open]);

  // Handle ESC key + prevent body scroll
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = prevOverflow || "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!categoryOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryOpen]);

  if (!open) return null;

  const isFormValid = category.trim() !== "" && message.trim() !== "";

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 150) {
      setMessage(value);
    }
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload: SendAnnouncementPayload = {
      audience,
      category,
      message: message.trim(),
    };

    onSubmit(payload);
  };

  const audienceButtonClass = (value: Audience): string =>
    [
      "inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5",
      "text-sm font-semibold transition-colors duration-150",
      value === audience
        ? "bg-[#605BFF] text-white"
        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200",
    ].join(" ");

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-modal-title"
    >
      <form
        onSubmit={handleSend}
        className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 id="announcement-modal-title" className="text-lg font-semibold text-gray-900">
            Send Announcement
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-6">
          {/* Audience Selection */}
          <section>
            <SectionTitle>Audience</SectionTitle>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAudience("managers")}
                className={audienceButtonClass("managers")}
              >
                All Managers
              </button>
              <button
                type="button"
                onClick={() => setAudience("guests")}
                className={audienceButtonClass("guests")}
              >
                All Guests
              </button>
              <button
                type="button"
                onClick={() => setAudience("both")}
                className={audienceButtonClass("both")}
              >
                Managers + Guests
              </button>
            </div>
          </section>

          {/* Category & Message */}
          <section>
            <div className="mb-4">
              <SectionTitle>Category *</SectionTitle>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCategoryOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left transition-colors hover:border-gray-400"
                  aria-haspopup="listbox"
                  aria-expanded={categoryOpen}
                >
                  <span className={category ? "text-gray-900" : "text-gray-400"}>
                    {category || "Select Category Type"}
                  </span>
                  <svg
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                    className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M1 1L7 8L13 1"
                      stroke="currentColor"
                      strokeOpacity="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {categoryOpen && (
                  <ul
                    role="listbox"
                    className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto"
                  >
                    {categoryOptions.map((opt) => (
                      <li
                        key={opt}
                        role="option"
                        aria-selected={category === opt}
                        onClick={() => {
                          setCategory(opt);
                          setCategoryOpen(false);
                          requestAnimationFrame(() => textareaRef.current?.focus());
                        }}
                        className="cursor-pointer px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors"
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <SectionTitle>Message *</SectionTitle>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleMessageChange}
                placeholder="Type your announcement here..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#605BFF] resize-none"
                style={{ minHeight: 120 }}
                rows={5}
              />
              <CharacterCounter value={message} maxLength={150} />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="px-4 py-2 rounded-lg bg-[#605BFF] text-white hover:bg-[#5048e6] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendAnnouncementModal;