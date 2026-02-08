import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { accommodations, Accommodation } from "@/data/accommodations";

type ChatStage = "idle" | "askedRoomType" | "askedLength" | "recommendations";

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
};

type RoomType = "En-suite" | "Non-en-suite" | "Studio" | "Accessible rooms";
type StayLength = "Full year" | "Academic year";

interface AIChatWidgetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "bottom-left" | "top-right";
}

const greetingMessage =
  "Hi! Tell me what you're looking for and I’ll help you find great options.";

const AIChatWidget = ({
  open,
  onOpenChange,
  placement = "top-right",
}: AIChatWidgetProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;

  const setOpen = (value: boolean) => {
    if (open === undefined) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState<ChatStage>("idle");
  const [inputValue, setInputValue] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(
    null,
  );
  const [selectedStayLength, setSelectedStayLength] =
    useState<StayLength | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeAccommodation, setActiveAccommodation] =
    useState<Accommodation | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const recommendations = useMemo(() => accommodations.slice(0, 2), []);

  const safeId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, stage, isOpen]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      timeoutsRef.current = [];
      setMessages([]);
      setStage("idle");
      setInputValue("");
      setSelectedRoomType(null);
      setSelectedStayLength(null);
      setDialogOpen(false);
      setActiveAccommodation(null);
    }
  }, [isOpen]);

  const scheduleResponse = (callback: () => void, delay = 300) => {
    const timeout = window.setTimeout(() => {
      callback();
      timeoutsRef.current = timeoutsRef.current.filter((id) => id !== timeout);
    }, delay);
    timeoutsRef.current.push(timeout);
  };

  const sendUserMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: safeId(), role: "user", content: trimmed },
    ]);
    setInputValue("");

    if (stage === "idle") {
      scheduleResponse(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: safeId(),
            role: "ai",
            content: "Thanks for sharing! What room type would you like?",
          },
        ]);
        setStage("askedRoomType");
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendUserMessage(inputValue);
  };

  const handlePickRoomType = (room: RoomType) => {
    setSelectedRoomType(room);
    setMessages((prev) => [
      ...prev,
      { id: safeId(), role: "user", content: room },
    ]);

    scheduleResponse(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: safeId(),
          role: "ai",
          content: "Got it! What is desired length of stay?",
        },
      ]);
      setStage("askedLength");
    });
  };

  const handlePickStayLength = (length: StayLength) => {
    setSelectedStayLength(length);
    setMessages((prev) => [
      ...prev,
      { id: safeId(), role: "user", content: length },
    ]);

    scheduleResponse(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: safeId(),
          role: "ai",
          content:
            "Great choice! Based on your preferences, here are two options you might like 👇",
        },
      ]);
      setStage("recommendations");
    });
  };

  const formatDescription = (accommodation: Accommodation) => {
    const amenitySnippet = accommodation.amenities.slice(0, 2).join(" • ");
    return `£${accommodation.price} per week${amenitySnippet ? ` • ${amenitySnippet}` : ""}`;
  };

  const handleOpenAccommodation = (accommodation: Accommodation) => {
    setActiveAccommodation(accommodation);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {createPortal(
        <div
          className={
            placement === "top-right"
              ? "fixed top-4 right-4 lg:right-4 lg:top-4 lg:w-[360px] lg:max-w-[calc(100vw-2rem)] bottom-0 left-0 lg:bottom-auto lg:left-auto w-full lg:max-w-none lg:h-auto h-[50vh] z-[2147483647]"
              : "fixed bottom-4 left-4 z-[2147483647] w-[360px] max-w-[calc(100vw-2rem)] lg:h-auto h-[50vh]"
          }
        >
          <Card className="border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-xl overflow-hidden h-full flex flex-col lg:h-auto">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">AI Assistant</span>
              </div>
              <button
                aria-label="Close chat"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleClose}
              >
                ×
              </button>
            </div>

            <div className="flex-1 lg:h-[360px] p-3 overflow-y-auto space-y-2">
              {messages.length === 0 && stage === "idle" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="max-w-[85%] rounded-2xl bg-muted text-foreground px-3 py-2 text-sm">
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
                    className={
                      message.role === "ai"
                        ? "max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm"
                        : "max-w-[85%] rounded-2xl bg-accent text-accent-foreground px-3 py-2 text-sm"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {stage === "askedRoomType" && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        "En-suite",
                        "Non-en-suite",
                        "Studio",
                        "Accessible rooms",
                      ] as RoomType[]
                    ).map((label) => (
                      <Button
                        key={label}
                        size="sm"
                        variant={
                          selectedRoomType === label ? "default" : "secondary"
                        }
                        className="justify-center"
                        onClick={() => handlePickRoomType(label)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {stage === "askedLength" && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-2 gap-2">
                    {(["Full year", "Academic year"] as StayLength[]).map(
                      (label) => (
                        <Button
                          key={label}
                          size="sm"
                          variant={
                            selectedStayLength === label
                              ? "default"
                              : "secondary"
                          }
                          className="justify-center"
                          onClick={() => handlePickStayLength(label)}
                        >
                          {label}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {stage === "recommendations" && (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-1 gap-3">
                    {recommendations.map((accommodation) => (
                      <Card
                        key={accommodation.id}
                        className="overflow-hidden border-border"
                      >
                        <div className="flex gap-3 p-3">
                          <img
                            src={accommodation.image}
                            alt={accommodation.title}
                            className="w-20 h-20 rounded object-cover bg-muted"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                              {accommodation.tag}
                            </div>
                            <div className="text-sm font-semibold truncate mt-1">
                              {accommodation.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDescription(accommodation)}
                            </div>
                            <div className="mt-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleOpenAccommodation(accommodation)
                                }
                              >
                                View room
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-border flex items-center gap-2 shrink-0"
            >
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" size="sm" className="shrink-0">
                Send
              </Button>
            </form>
          </Card>
        </div>,
        document.body,
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeAccommodation?.title ?? "Accommodation detail"}
            </DialogTitle>
            <DialogDescription>
              {activeAccommodation
                ? `${activeAccommodation.tag} • £${activeAccommodation.price} per week`
                : "Select a room to see details"}
            </DialogDescription>
          </DialogHeader>
          {activeAccommodation && (
            <div className="space-y-3">
              <img
                src={activeAccommodation.image}
                alt={activeAccommodation.title}
                className="w-full h-48 object-cover rounded"
              />
              <div>
                <h3 className="text-sm font-semibold mb-2">Amenities</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {activeAccommodation.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                >
                  View details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChatWidget;
