import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatStage } from "@/types/ai-experience";
import { GREETING_MESSAGE } from "@/constants/ai-experience";

interface ChatInputSectionProps {
  stage: ChatStage;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  variant?: "mobile" | "desktop";
}

export default function ChatInputSection({
  stage,
  inputValue,
  onInputChange,
  onSubmit,
  variant = "desktop",
}: ChatInputSectionProps) {
  const isSelectionStage =
    stage === "askedRoomType" ||
    stage === "askedRoomClass" ||
    stage === "askedLength" ||
    stage === "askedYear";

  const placeholder = isSelectionStage
    ? "Or type your answer instead..."
    : GREETING_MESSAGE;

  const inputClassName = `flex-1 bg-background border rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    isSelectionStage ? "border-input/50 opacity-60" : "border-input"
  }`;

  if (variant === "mobile") {
    return (
      <div className="border-t border-border px-4 py-4 bg-white shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 shrink-0">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold">AI Assistant</p>
            <p className="text-xs text-muted-foreground truncate">
              Here to make finding your next student home nice and easy
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputClassName} px-3 py-2`}
          />
          <Button type="submit" size="sm" className="px-4 shrink-0">
            Send
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="border-t border-border px-6 py-5 bg-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold">AI Assistant</p>
          <p className="text-xs text-muted-foreground">
            Here to make finding your next student home nice and easy
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-3">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClassName} px-4 py-3`}
        />
        <Button type="submit" size="sm" className="px-5">
          Send
        </Button>
      </form>
    </div>
  );
}
