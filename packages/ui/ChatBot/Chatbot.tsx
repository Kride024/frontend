// Chatbot.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import responses from "./response.json";
import { RENTALS_BASE } from "@packages/config/constants";
import { extractRoomAndArea, generatePropertySearchUrl } from "./generate";

import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import FormModal from "./FormModal";

import { FormDataState, Message } from "./types";

const apiUrl = `${import.meta.env.VITE_API_URL ?? ""}`;

const initialFormState: FormDataState = {
  name: "",
  mobile: "",
  userType: "",
  countries: [],
  selectedCountry: null,
  isDropdownOpen: false,
  searchTerm: "",
  userTypes: [],
  loadingUserTypes: false,
  isSubmitting: false,
  filteredCountries: [],
};

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      setMessages([
        {
          type: "bot",
          text: "👋 Welcome to RufRent - your one-stop solution for hassle-free renting and posting! How can I help you today?",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const { data: countries } = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd"
        );

        const mapped = countries.map((country: any) => ({
          name: country.name.common,
          code: country.idd?.root + (country.idd?.suffixes?.[0] || ""),
          flag: country.flags?.png || "",
        }));

        setFormData((prev) => ({ ...prev, countries: mapped }));
        const india = mapped.find((c: any) => c.name === "India");
        if (india) {
          setFormData((prev) => ({ ...prev, selectedCountry: india }));
        }
      } catch (error) {
        console.error("Failed to load country data:", error);
      }
    }

    async function fetchUserTypes() {
      try {
        setFormData((prev) => ({ ...prev, loadingUserTypes: true }));
        const url = `${import.meta.env.VITE_API_URL}/getEnquirerCatCode`;
        const response = await axios.get(url);

        if (response.data.success) {
          setFormData((prev) => ({
            ...prev,
            userTypes: response.data.data,
          }));
        }
      } catch (error) {
        console.error("Failed to load user types:", error);
      } finally {
        setFormData((prev) => ({ ...prev, loadingUserTypes: false }));
      }
    }

    if (showForm) {
      fetchCountries();
      fetchUserTypes();
    }
  }, [showForm]);

  useEffect(() => {
    if (formData.countries.length > 0) {
      const filtered = formData.countries.filter((country) =>
        country.name.toLowerCase().includes(formData.searchTerm.toLowerCase())
      );
      setFormData((prev) => ({ ...prev, filteredCountries: filtered }));
    }
  }, [formData.searchTerm, formData.countries]);

  const handleFormSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent
  ) => {
    e.preventDefault();
    setFormError(null);
    setFormData((prev) => ({ ...prev, isSubmitting: true }));

    if (!formData.name || !formData.mobile || !formData.userType) {
      setFormError("Please fill all required fields");
      setFormData((prev) => ({ ...prev, isSubmitting: false }));
      return;
    }

    if (formData.mobile.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number");
      setFormData((prev) => ({ ...prev, isSubmitting: false }));
      return;
    }

    try {
      const selectedUserType = formData.userTypes.find(
        (type) =>
          type.category.toLowerCase() === formData.userType.toLowerCase()
      );

      if (!selectedUserType) {
        throw new Error("Invalid user type selected");
      }

      const payload = {
        usercat: selectedUserType.id,
        name: formData.name,
        country_code: formData.selectedCountry?.code,
        mobile_no: formData.mobile,
        status: 25,
      };

      const url = `${import.meta.env.VITE_API_URL}/addNewEnquiryRecord`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Thank you! We will contact you shortly." },
        {
          type: "bot",
          text: "Back to Main Menu",
          clickable: true,
          key: "9",
        },
      ]);
      setShowForm(false);
      setFormData(initialFormState);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setFormError(error.message);
    } finally {
      setFormData((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      if (/favourite/i.test(userMessage)) {
        const intentId = 4;
        const intent = (responses as any).intents.find(
          (i: any) => i.intent_id === intentId
        );
        if (intent) {
          let combinedMessage = intent.title;
          if (intent.steps && intent.steps.length > 0) {
            combinedMessage +=
              "\n\n" + intent.steps.map((step: string) => `• ${step}`).join("\n");
          }

          setMessages((prev) => [...prev, { type: "bot", text: combinedMessage }]);

          if (intent.link) {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: intent.link,
                isLink: true,
                buttonText: intent.button_text || "Visit Page",
              },
            ]);
          }
        }
        setIsTyping(false);
        return;
      }

      const classifyResponse = await axios.post(`${apiUrl}/chatbot/classify`, {
        message: userMessage,
      });

      const intentId = parseInt(classifyResponse.data.predictedClass, 10);
      const intents = (responses as any).intents as any[];

      if (intentId === 0) {
        setShowForm(true);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "I'll help you schedule a callback. Please fill out the form below:",
          },
        ]);
        setIsTyping(false);
        return;
      }

      const intent = intents.find((i) => i.intent_id === intentId);

      if (intent) {
        let combinedMessage = intent.title;
        if (intent.steps && intent.steps.length > 0) {
          combinedMessage +=
            "\n\n" + intent.steps.map((step: string) => `• ${step}`).join("\n");
        }

        setMessages((prev) => [...prev, { type: "bot", text: combinedMessage }]);

        if (intent.intent_id === 2) {
          const { rooms, community } = extractRoomAndArea(userMessage);
          const searchUrl = generatePropertySearchUrl(
            rooms,
            community,
            RENTALS_BASE
          );
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: searchUrl,
              isLink: true,
              buttonText: intent.button_text || "Explore More Properties",
            },
          ]);
        } else if (intent.link) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: intent.link,
              isLink: true,
              buttonText: intent.button_text || "Visit Page",
            },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "I'm not sure how to help with that. Could you please rephrase your question?",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text:
            "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleModalClose = () => {
    setShowForm(false);
    setFormData(initialFormState);
    setFormError(null);
  };

  return (
    <div
      className="    fixed bottom-2 right-0 sm:bottom-4 sm:right-4
    w-[75%] sm:w-96
    h-[70vh] sm:h-[600px]
    bg-white rounded-l-lg sm:rounded-lg
    shadow-lg flex flex-col z-50"
    >
      <ChatHeader onClose={onClose} />
      <ChatMessageList
        messages={messages}
        isTyping={isTyping}
        chatRef={chatRef}
      />
      <ChatInput
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSubmit={handleSendMessage}
      />
      <FormModal
        isOpen={showForm}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        formErrors={formError}
      />
    </div>
  );
};

export default Chatbot;
