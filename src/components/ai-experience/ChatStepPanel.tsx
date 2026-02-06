import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatStepPanelProps = {
  title: string;
  subtitle?: string;
  options: string[];
  selectedOption?: string | null;
  onSelect: (value: string) => void;
  maxWidthClass: string;
};

const ChatStepPanel = ({
  title,
  subtitle = "Click on an option below ↓",
  options,
  selectedOption,
  onSelect,
  maxWidthClass,
}: ChatStepPanelProps) => {
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
      <div
        className={cn(
          maxWidthClass,
          "rounded-2xl bg-muted/80 px-4 py-4 text-sm border-2 border-primary/20"
        )}
      >
        <p className="font-medium mb-2">{title}</p>
        <p className="text-xs text-muted-foreground mb-3 italic">{subtitle}</p>
        {options.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {options.map((label) => (
              <Button
                key={label}
                size="sm"
                variant={selectedOption === label ? "default" : "secondary"}
                className="w-full justify-center cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 font-medium hover:brightness-95 text-xs sm:text-sm whitespace-normal break-words text-center leading-snug"
                style={{
                  backgroundColor: "#ffc105",
                  color: "#000000",
                  borderColor: "#ffc105",
                }}
                onClick={() => onSelect(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No options available.</p>
        )}
      </div>
    </div>
  );
};

export default ChatStepPanel;
