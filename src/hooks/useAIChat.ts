import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChatMessage,
  ChatStage,
  ConversationalResult,
  ContractType,
  RoomClass,
  RoomType,
} from "@/types/ai-experience";
import {
  extractAmenityKeywords,
  matchPropertiesByAmenities,
  generateConversationalResponse,
} from "@/utils/amenityMatcher";
import mockData from "@/data/real-accomodations.json";
import type { PropertyData } from "@/types/ai-experience";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const realProperties = mockData.data.propertyDataList as PropertyData[];

interface UseAIChatReturn {
  messages: ChatMessage[];
  stage: ChatStage;
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedRoomType: RoomType | null;
  selectedRoomClass: RoomClass | null;
  selectedContractType: ContractType | null;
  conversationalResults: ConversationalResult[];
  desktopChatEndRef: React.RefObject<HTMLDivElement | null>;
  mobileChatEndRef: React.RefObject<HTMLDivElement | null>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handlePickRoomType: (room: RoomType) => void;
  handlePickRoomClass: (roomClass: RoomClass) => void;
  handlePickContractType: (contractType: ContractType) => void;
  handleSuggestionSelect: (suggestionId: string) => void;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState<ChatStage>("idle");
  const [inputValue, setInputValue] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(
    null,
  );
  const [selectedRoomClass, setSelectedRoomClass] = useState<RoomClass | null>(
    null,
  );
  const [selectedContractType, setSelectedContractType] =
    useState<ContractType | null>(null);
  const [conversationalResults, setConversationalResults] = useState<
    ConversationalResult[]
  >([]);

  const desktopChatEndRef = useRef<HTMLDivElement | null>(null);
  const mobileChatEndRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  // Scroll both sentinel elements into view (one is hidden via CSS, so only the visible one matters)
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      desktopChatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      mobileChatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  // Scroll to bottom when messages or stage change (only for guided flow, not conversational results).
  useEffect(() => {
    if (stage === "conversationalResults") return;
    scrollToBottom();
    const t1 = window.setTimeout(scrollToBottom, 200);
    const t2 = window.setTimeout(scrollToBottom, 600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [messages, stage, scrollToBottom]);

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

  const handleConversationalQuery = (text: string) => {
    const keywords = extractAmenityKeywords(text);
    if (keywords.length === 0) return false;

    const { perfect, close } = matchPropertiesByAmenities(
      keywords,
      realProperties,
    );
    const response = generateConversationalResponse(perfect, close, keywords);

    scheduleResponse(() => {
      addMessage("ai", response);
      setConversationalResults([...perfect, ...close]);
      setStage("conversationalResults");
    });

    return true;
  };

  const sendUserMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    addMessage("user", trimmed);
    setInputValue("");

    if (stage === "idle") {
      // Try conversational discovery first
      const handled = handleConversationalQuery(trimmed);
      if (!handled) {
        // Fall through to guided flow
        scheduleResponse(() => {
          addMessage(
            "ai",
            "Thanks for that! What kind of room are you after? Click on one of the options below to move on.",
          );
          setStage("askedRoomType");
        });
      }
    } else if (stage === "conversationalResults") {
      // Allow follow-up queries in conversational mode
      const handled = handleConversationalQuery(trimmed);
      if (!handled) {
        scheduleResponse(() => {
          addMessage(
            "ai",
            "I'm not sure what you're looking for — try asking about specific amenities like a gym, cinema room, study space, or common area!",
          );
        });
      }
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
        "Got it! How long would you like to stay? Pick a contract length that works for you.",
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
        "Nice one! Based on what you're after, I've found a couple of places you might love 👇",
      );
      setStage("recommendations");
    });
  };

  const handleSuggestionSelect = (suggestionId: string) => {
    // Imported lazily to avoid circular deps — the actual function is in suggestionResponses
    import("@/utils/suggestionResponses").then(({ getSuggestionResponse }) => {
      const suggestion = getSuggestionResponse(suggestionId);
      if (!suggestion) return;

      addMessage("user", suggestion.userMessage);

      scheduleResponse(() => {
        addMessage("ai", suggestion.aiResponse);
        setConversationalResults(suggestion.results);
        setStage("conversationalResults");
      });
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
    conversationalResults,
    desktopChatEndRef,
    mobileChatEndRef,
    handleSubmit,
    handlePickRoomType,
    handlePickRoomClass,
    handlePickContractType,
    handleSuggestionSelect,
  };
}
