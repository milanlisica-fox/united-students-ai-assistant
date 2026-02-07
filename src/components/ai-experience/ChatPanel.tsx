import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";
import ChatStepPanel from "./ChatStepPanel";

type ChatStage =
  | "idle"
  | "askedRoomType"
  | "askedRoomClass"
  | "askedContractType"
  | "recommendations";

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
};

type ChatPanelProps = {
  stage: ChatStage;
  messages: ChatMessage[];
  greetingMessage: string;
  chatEndRef: RefObject<HTMLDivElement | null>;
  bubbleMaxWidthClass: string;
  panelMaxWidthClass: string;
  roomTypeOptions: string[];
  roomClassOptions: string[];
  contractTypeOptions: string[];
  selectedRoomType?: string | null;
  selectedRoomClass?: string | null;
  selectedContractType?: string | null;
  onPickRoomType: (value: string) => void;
  onPickRoomClass: (value: string) => void;
  onPickContractType: (value: string) => void;
  renderRecommendations?: ReactNode;
};

const ChatPanel = ({
  stage,
  messages,
  greetingMessage,
  chatEndRef,
  bubbleMaxWidthClass,
  panelMaxWidthClass,
  roomTypeOptions,
  roomClassOptions,
  contractTypeOptions,
  selectedRoomType,
  selectedRoomClass,
  selectedContractType,
  onPickRoomType,
  onPickRoomClass,
  onPickContractType,
  renderRecommendations,
}: ChatPanelProps) => {
  return (
    <div className="space-y-4">
      {messages.length === 0 && stage === "idle" && (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className={cn(
              bubbleMaxWidthClass,
              "rounded-2xl bg-muted px-4 py-3 text-sm text-foreground",
            )}
          >
            {greetingMessage}
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.role === "ai"
              ? "flex justify-start animate-in fade-in slide-in-from-bottom-1"
              : "flex justify-end animate-in fade-in slide-in-from-bottom-1"
          }
        >
          <div
            className={cn(
              bubbleMaxWidthClass,
              message.role === "ai"
                ? "rounded-2xl bg-muted px-4 py-3 text-sm text-foreground"
                : "rounded-2xl bg-accent px-4 py-3 text-sm text-accent-foreground",
            )}
          >
            {message.content}
          </div>
        </div>
      ))}

      {stage === "askedRoomType" && (
        <ChatStepPanel
          title="Choose a room type"
          options={roomTypeOptions}
          selectedOption={selectedRoomType}
          onSelect={onPickRoomType}
          maxWidthClass={panelMaxWidthClass}
        />
      )}

      {stage === "askedRoomClass" && (
        <ChatStepPanel
          title="Choose a room class"
          options={roomClassOptions}
          selectedOption={selectedRoomClass}
          onSelect={onPickRoomClass}
          maxWidthClass={panelMaxWidthClass}
        />
      )}

      {stage === "askedContractType" && (
        <ChatStepPanel
          title="Select your contract length"
          options={contractTypeOptions}
          selectedOption={selectedContractType}
          onSelect={onPickContractType}
          maxWidthClass={panelMaxWidthClass}
        />
      )}

      {stage === "recommendations" && renderRecommendations}

      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatPanel;
