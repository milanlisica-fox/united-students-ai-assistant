import { useState } from "react";
import { SlidersHorizontal, ChevronLeft, Sparkles, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AIAssistant from "@/components/AIAssistant";
import AIChatWidget from "@/components/AIChatWidget";
import AccommodationCard from "@/components/AccommodationCard";
import { accommodations } from "@/data/accommodations";
import mapStatic from "@/assets/map-static.jpg";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [sortBy, setSortBy] = useState("");
  const [isAIFiltered, setIsAIFiltered] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiInputValue, setAiInputValue] = useState("");
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  // Filtered accommodations when AI is active
  const filteredAccommodations = isAIFiltered ? accommodations.slice(0, 1) : accommodations;

  const handleAIGetStarted = () => {
    if (aiInputValue.trim()) {
      setIsAIFiltered(true);
      setAiInputValue("");
      setAiAssistantOpen(false);
    }
  };

  const handleModifySearch = () => {
    setAiAssistantOpen(true);
  };

  const handleClear = () => {
    setIsAIFiltered(false);
    setAiAssistantOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAIGetStarted();
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Full Screen Map Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={mapStatic} 
          alt="Map showing accommodation locations"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Left Panel - Listings (Hidden on mobile) */}
        <div className="hidden lg:block lg:w-[42%] relative flex flex-col">
          {/* Controls Bar - Fixed at top */}
          <div className="fixed top-0 left-0 w-full z-20 px-3 pt-6">
            <div className="w-[42%] flex items-stretch gap-4">
              <div className="flex items-center justify-center px-4 py-4 rounded-2xl bg-white shrink-0">
                <img 
                  src="/unite-students-real-logo.jpg" 
                  alt="Unite Students Logo" 
                  className="h-7 w-auto"
                />
              </div>
              <div className="flex items-center flex-1 px-4 py-3 rounded-2xl bg-white gap-4">
                <Button variant="ghost" size="sm" disabled className="gap-2 shrink-0 px-3">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex-1 flex relative min-w-0">
                  <AIAssistant />
                </div>
                <Button variant="outline" size="sm" className="gap-2 shrink-0 px-3" style={{ backgroundColor: '#B4DADA' }}>
                  <SlidersHorizontal className="w-4 h-4" />
                  0 × Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Gap - Shows map background */}
          <div className="h-24 flex-shrink-0" />

          {/* AI Assistant Input - Appears between control bar and results */}
          {aiAssistantOpen && (
            <div className="relative z-20 bg-white px-4 sm:px-6 py-3 sm:py-4 border-b">
              <div className="mb-3 sm:mb-4">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Hello! I'm your AI assistant. I can help you find the perfect accommodation based on your preferences.
                </p>
              </div>
              <div className="flex gap-2 items-end">
                <textarea
                  placeholder="Describe what you're looking for..."
                  value={aiInputValue}
                  onChange={(e) => setAiInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-h-[80px] sm:min-h-[100px] max-h-[200px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
                <Button
                  onClick={handleAIGetStarted}
                  size="icon"
                  className="h-10 w-10 flex-shrink-0 rounded-full"
                  disabled={!aiInputValue.trim()}
                >
                  <ArrowUpCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Results header - Fixed */}
          <div className="relative z-20 bg-white rounded-tr-none lg:rounded-tr-2xl">
            <div className="p-3 sm:p-6 pt-0 pb-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1">
                  <h2 className="text-base sm:text-lg font-semibold">
                    {isAIFiltered ? "My picks for you" : "22 results"}
                  </h2>
                  {isAIFiltered && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleModifySearch}
                        className="gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                        <span className="hidden sm:inline">Modify search</span>
                        <span className="sm:hidden">Modify</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClear}
                        className="text-xs sm:text-sm"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
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
          </div>

          {/* Scrollable Listings */}
          <div className="flex-1 overflow-y-auto relative z-20 bg-white">
            <div className="p-6 pt-0">
              <div className="grid gap-6">
                {filteredAccommodations.map((accommodation) => (
                  <AccommodationCard key={accommodation.id} {...accommodation} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Control Bar */}
        <div className="lg:hidden fixed top-0 left-0 w-full z-20 px-2 pt-2">
          <div className="flex flex-col gap-2">
            {/* First line: Logo + Filters */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center px-3 py-2 rounded-xl bg-white shrink-0">
                <img 
                  src="/unite-students-real-logo.jpg" 
                  alt="Unite Students Logo" 
                  className="h-6 w-auto"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2 flex-1 justify-center" style={{ backgroundColor: '#B4DADA' }}>
                <SlidersHorizontal className="w-4 h-4" />
                0 × Filters
              </Button>
            </div>
            {/* Second line: Back + AI Assistant */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled className="gap-2 shrink-0 px-2 sm:px-3 py-2 bg-white border border-border rounded-lg opacity-100 disabled:opacity-100">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <button
                type="button"
                onClick={() => navigate("/ai-experience")}
                className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white border border-border rounded-lg opacity-100 hover:bg-muted/50 transition-colors"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">Let AI help you find your perfect place</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: Search Results Section - Below control bar */}
        <div className="lg:hidden w-full relative z-10" style={{ marginTop: '120px' }}>
          {/* Mobile Results Header */}
          <div className="bg-white px-4 py-3 border-b">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">
                  {isAIFiltered ? "My picks for you" : "22 results"}
                </h2>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] text-xs">
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
              {isAIFiltered && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleModifySearch}
                    className="gap-1 sm:gap-2 text-xs"
                  >
                    <Sparkles className="w-3 h-3 text-accent" />
                    Modify search
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClear}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile AI Assistant Input */}
          {aiAssistantOpen && (
            <div className="bg-white px-4 py-3 border-b">
              <div className="mb-3">
                <p className="text-muted-foreground text-xs">
                  Hello! I'm your AI assistant. I can help you find the perfect accommodation based on your preferences.
                </p>
              </div>
              <div className="flex gap-2 items-end">
                <textarea
                  placeholder="Describe what you're looking for..."
                  value={aiInputValue}
                  onChange={(e) => setAiInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-h-[80px] max-h-[200px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
                <Button
                  onClick={handleAIGetStarted}
                  size="icon"
                  className="h-10 w-10 flex-shrink-0 rounded-full"
                  disabled={!aiInputValue.trim()}
                >
                  <ArrowUpCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Listings */}
          <div className="bg-white min-h-[calc(100vh-120px)] pb-4">
            <div className="p-4">
              <div className="grid gap-4">
                {filteredAccommodations.map((accommodation) => (
                  <AccommodationCard key={accommodation.id} {...accommodation} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <AIChatWidget open={chatOpen} onOpenChange={setChatOpen} placement="top-right" />

        {/* Right Panel - Map transparent overlay */}
        <div className="hidden lg:block flex-1 relative" />
      </div>
    </div>
  );
};

export default Index;
