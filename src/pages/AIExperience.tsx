import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AIAssistant from "@/components/AIAssistant";
import AIChatWidget from "@/components/AIChatWidget";
import AccommodationCard from "@/components/AccommodationCard";
import { accommodations, Accommodation } from "@/data/accommodations";
import mapStatic from "@/assets/map-static.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ChatStage = "idle" | "askedRoomType" | "askedLength" | "recommendations";
type ChatMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
};

type RoomType = "En-suite" | "Non-en-suite" | "Studio" | "Accessible rooms";
type StayLength = "Full year" | "Academic year";

const greetingMessage = "Hi! Tell me what you're looking for and I’ll help you find great options.";

const AIExperience = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState<ChatStage>("idle");
  const [inputValue, setInputValue] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [selectedStayLength, setSelectedStayLength] = useState<StayLength | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeAccommodation, setActiveAccommodation] = useState<Accommodation | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const recommendations = useMemo(() => accommodations.slice(0, 2), []);

  const safeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, stage]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

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

    setMessages((prev) => [...prev, { id: safeId(), role: "user", content: trimmed }]);
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
    setMessages((prev) => [...prev, { id: safeId(), role: "user", content: room }]);

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
    setMessages((prev) => [...prev, { id: safeId(), role: "user", content: length }]);

    scheduleResponse(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: safeId(),
          role: "ai",
          content: "Great choice! Based on your preferences, here are two options you might like 👇",
        },
      ]);
      setStage("recommendations");
    });
  };

  const handleOpenAccommodation = (accommodation: Accommodation) => {
    setActiveAccommodation(accommodation);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 z-0">
        <img
          src={mapStatic}
          alt="Map showing accommodation locations"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex h-screen relative z-10">
        <div className="w-[42%] relative flex flex-col">
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
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate(-1)}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex-1 flex relative">
                  <AIAssistant />
                </div>
                <Button variant="outline" size="sm" className="gap-2" style={{ backgroundColor: "#B4DADA" }}>
                  <SlidersHorizontal className="w-4 h-4" />
                  4 × Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="h-24 flex-shrink-0" />

          <div className="relative z-20 bg-white rounded-tr-2xl flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-8 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">AI Experience</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Share your preferences and I’ll tailor options for you.
                  </p>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="offers">Offers</SelectItem>
                    <SelectItem value="price-high">Price: High to low</SelectItem>
                    <SelectItem value="price-low">Price: Low to high</SelectItem>
                    <SelectItem value="a-to-z">A to Z</SelectItem>
                    <SelectItem value="z-to-a">Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white">
                {messages.length === 0 && stage === "idle" && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
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
                          ? "max-w-[75%] rounded-2xl bg-muted px-4 py-3 text-sm text-foreground"
                          : "max-w-[75%] rounded-2xl bg-accent px-4 py-3 text-sm text-accent-foreground"
                      }
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {stage === "askedRoomType" && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                    <div className="max-w-[75%] rounded-2xl bg-muted/80 px-4 py-4 text-sm">
                      <p className="font-medium mb-3">Choose a room type</p>
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
                  </div>
                )}

                {stage === "askedLength" && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                    <div className="max-w-[75%] rounded-2xl bg-muted/80 px-4 py-4 text-sm">
                      <p className="font-medium mb-3">Select your stay length</p>
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
                  </div>
                )}

                {stage === "recommendations" && (
                  <div className="space-y-4 pt-1 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-4">
                      {recommendations.map((accommodation) => (
                        <div key={accommodation.id} className="flex justify-start">
                          <div className="w-full max-w-lg">
                            <AccommodationCard
                              {...accommodation}
                              viewButtonLabel="View room"
                              onView={() => handleOpenAccommodation(accommodation)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-border px-6 py-5 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">AI Assistant</p>
                    <p className="text-xs text-muted-foreground">Ready to help you discover great places</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder={greetingMessage}
                    className="flex-1 bg-background border border-input rounded-lg px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button type="submit" size="sm" className="px-5">
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <button
          aria-label="Open AI Assistant chat"
          onClick={() => setChatOpen(true)}
          className="fixed top-4 right-4 z-50 h-20 w-20 rounded-full bg-yellow-400 shadow-lg hover:bg-yellow-300 flex items-center justify-center"
        >
          <Bot className="w-10 h-10 text-black" />
        </button>

        <AIChatWidget open={chatOpen} onOpenChange={setChatOpen} placement="top-right" />

        <div className="hidden lg:block flex-1 relative" />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeAccommodation?.title ?? "Accommodation details"}</DialogTitle>
            <DialogDescription>
              {activeAccommodation
                ? `${activeAccommodation.tag} • £${activeAccommodation.price} per week`
                : "Select a room to see more information."}
            </DialogDescription>
          </DialogHeader>
          {activeAccommodation && (
            <div className="space-y-4">
              <img
                src={activeAccommodation.image}
                alt={activeAccommodation.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-base font-semibold mb-2">Amenities</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {activeAccommodation.amenities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button>View details</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIExperience;

