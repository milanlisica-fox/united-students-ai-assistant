import { Mountain, TrendingUp, PiggyBank, GraduationCap } from "lucide-react";
import { SUGGESTION_PROMPTS } from "@/constants/ai-experience";

const ICON_MAP: Record<string, React.ReactNode> = {
  mountain: <Mountain className="w-4 h-4" />,
  trending: <TrendingUp className="w-4 h-4" />,
  "piggy-bank": <PiggyBank className="w-4 h-4" />,
  graduation: <GraduationCap className="w-4 h-4" />,
};

type SuggestionCardsProps = {
  onSelect: (suggestionId: string) => void;
};

const SuggestionCards = ({ onSelect }: SuggestionCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SUGGESTION_PROMPTS.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelect(prompt.id)}
          className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-3 py-3 text-left text-sm text-foreground shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
            {ICON_MAP[prompt.icon]}
          </span>
          <span className="font-medium leading-tight">{prompt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SuggestionCards;
