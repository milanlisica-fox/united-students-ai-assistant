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
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors whitespace-nowrap ${className ?? ""}`}
    >
      <Sparkles className="w-4 h-4 text-accent" />
      <span className="text-sm font-medium">Let AI help you find your perfect place</span>
    </button>
  );
};

export default AIAssistant;
 
