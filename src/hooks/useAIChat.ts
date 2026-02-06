import { useEffect, useRef, useState } from "react";
import type {
  ChatMessage,
  ChatStage,
  ContractType,
  RoomClass,
  RoomType,
} from "@/types/ai-experience";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

interface UseAIChatReturn {
  messages: ChatMessage[];
  stage: ChatStage;
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedRoomType: RoomType | null;
  selectedRoomClass: RoomClass | null;
  selectedContractType: ContractType | null;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handlePickRoomType: (room: RoomType) => void;
  handlePickRoomClass: (roomClass: RoomClass) => void;
  handlePickContractType: (contractType: ContractType) => void;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState<ChatStage>("idle");
  const [inputValue, setInputValue] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(
    null
  );
  const [selectedRoomClass, setSelectedRoomClass] = useState<RoomClass | null>(
    null
  );
  const [selectedContractType, setSelectedContractType] =
    useState<ContractType | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  // Scroll to bottom when messages or stage changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, stage]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

  const scheduleResponse = (callback: () => void, delay = 300) => {
    const timeout = window.setTimeout(() => {
      callback();
      timeoutsRef.current = timeoutsRef.current.filter((id) => id !== timeout);
    }, delay);
    timeoutsRef.current.push(timeout);
  };

  const addMessage = (role: "ai" | "user", content: string) => {
    setMessages((prev) => [...prev, { id: generateId(), role, content }]);
  };

  const sendUserMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    addMessage("user", trimmed);
    setInputValue("");

    if (stage === "idle") {
      scheduleResponse(() => {
        addMessage(
          "ai",
          "Thanks for that! What kind of room are you after? Click on one of the options below to move on."
        );
        setStage("askedRoomType");
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendUserMessage(inputValue);
  };

  const handlePickRoomType = (room: RoomType) => {
    setSelectedRoomType(room);
    setSelectedRoomClass(null);
    setSelectedContractType(null);
    addMessage("user", room);

    scheduleResponse(() => {
      addMessage("ai", "Nice! Pick a room class that suits you best.");
      setStage("askedRoomClass");
    });
  };

  const handlePickRoomClass = (roomClass: RoomClass) => {
    setSelectedRoomClass(roomClass);
    setSelectedContractType(null);
    addMessage("user", roomClass);

    scheduleResponse(() => {
      addMessage(
        "ai",
        "Got it! How long would you like to stay? Pick a contract length that works for you."
      );
      setStage("askedContractType");
    });
  };

  const handlePickContractType = (contractType: ContractType) => {
    setSelectedContractType(contractType);
    addMessage("user", contractType);

    scheduleResponse(() => {
      addMessage(
        "ai",
        "Nice one! Based on what you're after, I've found a couple of places you might love 👇"
      );
      setStage("recommendations");
    });
  };

  return {
    messages,
    stage,
    inputValue,
    setInputValue,
    selectedRoomType,
    selectedRoomClass,
    selectedContractType,
    chatEndRef,
    handleSubmit,
    handlePickRoomType,
    handlePickRoomClass,
    handlePickContractType,
  };
}
