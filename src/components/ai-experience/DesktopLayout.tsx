import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AIAssistant from "@/components/AIAssistant";
import AIChatWidget from "@/components/AIChatWidget";
import ChatPanel from "@/components/ai-experience/ChatPanel";
import ChatInputSection from "@/components/ai-experience/ChatInputSection";
import type {
  ChatMessage,
  ChatStage,
  ContractType,
  RoomClass,
  RoomType,
} from "@/types/ai-experience";
import { GREETING_MESSAGE, ROOM_TYPE_OPTIONS } from "@/constants/ai-experience";

interface DesktopLayoutProps {
  stage: ChatStage;
  messages: ChatMessage[];
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  roomClassOptions: string[];
  contractTypeOptions: ContractType[];
  selectedRoomType: RoomType | null;
  selectedRoomClass: RoomClass | null;
  selectedContractType: ContractType | null;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onPickRoomType: (room: RoomType) => void;
  onPickRoomClass: (roomClass: RoomClass) => void;
  onPickContractType: (contractType: ContractType) => void;
  renderRecommendations: React.ReactNode;
  filterCount: number;
  chatOpen: boolean;
  onChatOpenChange: (open: boolean) => void;
}

export default function DesktopLayout({
  stage,
  messages,
  chatEndRef,
  roomClassOptions,
  contractTypeOptions,
  selectedRoomType,
  selectedRoomClass,
  selectedContractType,
  inputValue,
  onInputChange,
  onSubmit,
  onPickRoomType,
  onPickRoomClass,
  onPickContractType,
  renderRecommendations,
  filterCount,
  chatOpen,
  onChatOpenChange,
}: DesktopLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:flex h-screen relative z-10">
      <div className="w-[42%] relative flex flex-col">
        {/* Desktop Header */}
        <div className="fixed top-0 left-0 w-full z-20 px-3 pt-6">
          <div className="w-[42%] flex items-center gap-4">
            <div className="flex items-center justify-center px-4 py-4 rounded-2xl bg-white">
              <img
                src="/unite-students-real-logo.jpg"
                alt="Unite Students Logo"
                className="h-7 w-auto"
              />
            </div>
            <div className="flex items-center flex-1 px-4 py-3 rounded-2xl bg-white gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex-1 flex relative">
                <AIAssistant />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                style={{ backgroundColor: "#B4DADA" }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {filterCount} × Filter{filterCount !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </div>

        <div className="h-24 flex-shrink-0" />

        {/* Main Content Area */}
        <div className="relative z-20 bg-white rounded-tr-2xl flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-8 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">AI Experience</h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Results
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
              <ChatPanel
                stage={stage}
                messages={messages}
                greetingMessage={GREETING_MESSAGE}
                chatEndRef={chatEndRef}
                bubbleMaxWidthClass="max-w-[75%]"
                panelMaxWidthClass="max-w-[75%]"
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
                renderRecommendations={renderRecommendations}
              />
            </div>

            <ChatInputSection
              stage={stage}
              inputValue={inputValue}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              variant="desktop"
            />
          </div>
        </div>
      </div>

      <AIChatWidget
        open={chatOpen}
        onOpenChange={onChatOpenChange}
        placement="top-right"
      />

      <div className="hidden lg:block flex-1 relative" />
    </div>
  );
}
