import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createPortal } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AIAssistantProps {
  onGetStarted?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ChatStage = "idle" | "askedRoomType" | "askedLength" | "recommendations";

type Message = {
  id: string;
  role: "ai" | "user";
  content: string;
};

type RoomType = "En-suite" | "Non-en-suite" | "Studio" | "Accessible rooms";
type StayLength = "Full year" | "Academic year";

const AIAssistant = ({ onGetStarted: _onGetStarted, open: _open, onOpenChange: _onOpenChange }: AIAssistantProps) => {

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [stage, setStage] = useState<ChatStage>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [selectedStayLength, setSelectedStayLength] = useState<StayLength | null>(null);
  const [viewRoomOpen, setViewRoomOpen] = useState<boolean>(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => {
    const next = !isChatOpen;
    setIsChatOpen(next);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, stage]);

  const recommendations = useMemo(
    () => [
      {
        id: "rec-1",
        image: "/placeholder.svg",
        title: "Cozy Studio near Downtown",
        description: "1 bed • 1 bath • 25 m² • £850/month",
      },
      {
        id: "rec-2",
        image: "/placeholder.svg",
        title: "Modern En-suite by Campus",
        description: "1 bed • Shared kitchen • 18 m² • £720/month",
      },
    ],
    []
  );

  const safeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: Message = { id: safeId(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, msg]);

    // After first user message, prompt for room type
    if (stage === "idle") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: safeId(),
            role: "ai",
            content:
              "Thanks for sharing! What room type would you like?",
          },
        ]);
        setStage("askedRoomType");
      }, 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(input);
    setInput("");
  };

  const handlePickRoomType = (room: RoomType) => {
    setSelectedRoomType(room);
    setMessages((prev) => [
      ...prev,
      { id: safeId(), role: "user", content: room },
    ]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: safeId(),
          role: "ai",
          content: "Got it! What is desired length of stay?",
        },
      ]);
      setStage("askedLength");
    }, 300);
  };

  const handlePickStayLength = (length: StayLength) => {
    setSelectedStayLength(length);
    setMessages((prev) => [
      ...prev,
      { id: safeId(), role: "user", content: length },
    ]);
    setTimeout(() => {
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
    }, 300);
  };

  const handleViewRoom = (id: string) => {
    setActiveRoomId(id);
    setViewRoomOpen(true);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors whitespace-nowrap"
      >
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium">Let AI help you find your perfect place</span>
      </button>

      {isChatOpen &&
        createPortal(
          <div className="fixed bottom-4 left-4 z-[2147483647] w-[360px] max-w-[calc(100vw-2rem)]">
            <Card className="border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">AI Assistant</span>
              </div>
              <button
                aria-label="Close chat"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={toggleChat}
              >
                ×
              </button>
            </div>

            <div className="h-[360px] p-3 overflow-y-auto space-y-2">
              {/* Intro message if empty */}
              {messages.length === 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="max-w-[85%] rounded-2xl bg-muted text-foreground px-3 py-2 text-sm">
                    Hi! Tell me what you're looking for and I’ll help you find great options.
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "ai"
                      ? "flex justify-start animate-in fade-in slide-in-from-bottom-1"
                      : "flex justify-end animate-in fade-in slide-in-from-bottom-1"
                  }
                >
                  <div
                    className={
                      m.role === "ai"
                        ? "max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm"
                        : "max-w-[85%] rounded-2xl bg-accent text-accent-foreground px-3 py-2 text-sm"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Room type options */}
              {stage === "askedRoomType" && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm">
                      What room type would you like?
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["En-suite", "Non-en-suite", "Studio", "Accessible rooms"] as RoomType[]).map(
                      (label) => (
                        <Button
                          key={label}
                          size="sm"
                          variant={selectedRoomType === label ? "default" : "secondary"}
                          className="justify-center"
                          onClick={() => handlePickRoomType(label)}
                        >
                          {label}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Stay length options */}
              {stage === "askedLength" && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm">
                      Got it! What is desired length of stay?
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Full year", "Academic year"] as StayLength[]).map((label) => (
                      <Button
                        key={label}
                        size="sm"
                        variant={selectedStayLength === label ? "default" : "secondary"}
                        className="justify-center"
                        onClick={() => handlePickStayLength(label)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {stage === "recommendations" && (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm">
                      Great choice! Based on your preferences, here are two options you might like 👇
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {recommendations.map((rec) => (
                      <Card key={rec.id} className="overflow-hidden border-border">
                        <div className="flex gap-3 p-3">
                          <img
                            src={rec.image}
                            alt={rec.title}
                            className="w-20 h-20 rounded object-cover bg-muted"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{rec.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {rec.description}
                            </div>
                            <div className="mt-2">
                              <Button size="sm" onClick={() => handleViewRoom(rec.id)}>
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

            <form onSubmit={handleSubmit} className="p-3 border-t border-border flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" size="sm" className="shrink-0">
                Send
              </Button>
            </form>
            </Card>
          </div>,
          document.body
        )}

      <Dialog open={viewRoomOpen} onOpenChange={setViewRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accommodation detail</DialogTitle>
            <DialogDescription>
              Mocked detail view for room ID: {activeRoomId || "-"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="w-full h-40 bg-muted rounded" />
            <p className="text-sm text-muted-foreground">
              This is a placeholder modal. Hook up navigation or detailed content later.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setViewRoomOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistant;
