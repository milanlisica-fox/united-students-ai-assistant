import { Sparkles } from "lucide-react";

interface AIAssistantProps {
  onGetStarted?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AIAssistant = ({ open, onOpenChange }: AIAssistantProps) => {
  const handleClick = () => {
    if (onOpenChange) {
      onOpenChange(!open);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors whitespace-nowrap"
    >
      <Sparkles className="w-4 h-4 text-accent" />
      <span className="text-sm font-medium">Let AI help you find your perfect place</span>
    </button>
  );
};

export default AIAssistant;
