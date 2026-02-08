import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ChatPanel from "@/components/ai-experience/ChatPanel";
import ChatInputSection from "@/components/ai-experience/ChatInputSection";
import type {
  ChatMessage,
  ChatStage,
  ConversationalResult,
  ContractType,
  RoomClass,
  RoomType,
} from "@/types/ai-experience";
import { GREETING_MESSAGE, ROOM_TYPE_OPTIONS } from "@/constants/ai-experience";

interface MobileLayoutProps {
  stage: ChatStage;
  messages: ChatMessage[];
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  roomClassOptions: string[];
  contractTypeOptions: ContractType[];
  selectedRoomType: RoomType | null;
  selectedRoomClass: RoomClass | null;
  selectedContractType: ContractType | null;
  inputValue: string;
  filterCount: number;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onPickRoomType: (room: RoomType) => void;
  onPickRoomClass: (roomClass: RoomClass) => void;
  onPickContractType: (contractType: ContractType) => void;
  onSuggestionSelect: (suggestionId: string) => void;
  renderRecommendations: React.ReactNode;
  conversationalResults?: ConversationalResult[];
  renderSuggestionCards?: React.ReactNode;
}

export default function MobileLayout({
  stage,
  messages,
  chatEndRef,
  roomClassOptions,
  contractTypeOptions,
  selectedRoomType,
  selectedRoomClass,
  selectedContractType,
  inputValue,
  filterCount,
  onInputChange,
  onSubmit,
  onPickRoomType,
  onPickRoomClass,
  onPickContractType,
  onSuggestionSelect,
  renderRecommendations,
  conversationalResults,
  renderSuggestionCards,
}: MobileLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 -ml-2"
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">AI Experience</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {filterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs transition-transform duration-200 animate-in zoom-in-95"
                style={{ backgroundColor: "#B4DADA" }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {filterCount} × Filter{filterCount !== 1 ? "s" : ""}
              </Button>
            )}
            <div className="flex items-center justify-center px-3 py-2 rounded-xl bg-white">
              <img
                src="/unite-students-real-logo.jpg"
                alt="Unite Students Logo"
                className="h-6 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ChatPanel
              stage={stage}
              messages={messages}
              greetingMessage={GREETING_MESSAGE}
              chatEndRef={chatEndRef}
              bubbleMaxWidthClass="max-w-[85%]"
              panelMaxWidthClass="max-w-[85%]"
              roomTypeOptions={ROOM_TYPE_OPTIONS}
              roomClassOptions={roomClassOptions}
              contractTypeOptions={contractTypeOptions}
              selectedRoomType={selectedRoomType}
              selectedRoomClass={selectedRoomClass}
              selectedContractType={selectedContractType}
              onPickRoomType={(value) => onPickRoomType(value as RoomType)}
              onPickRoomClass={(value) => onPickRoomClass(value as RoomClass)}
              onPickContractType={(value) =>
                onPickContractType(value as ContractType)
              }
              onSuggestionSelect={onSuggestionSelect}
              renderRecommendations={renderRecommendations}
              conversationalResults={conversationalResults}
              renderSuggestionCards={renderSuggestionCards}
            />
          </div>

          <ChatInputSection
            stage={stage}
            inputValue={inputValue}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
            variant="mobile"
          />
        </div>
      </div>
    </div>
  );
}
