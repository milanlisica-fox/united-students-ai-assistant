import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AIAssistantProps {
  className?: string;
  to?: string;
}

const AIAssistant = ({ className, to = "/ai-experience" }: AIAssistantProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors ${className ?? ""}`}
    >
      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent shrink-0" />
      <span className="text-xs sm:text-sm font-medium truncate">Let AI help you find your perfect place</span>
    </button>
  );
};

export default AIAssistant;
 
