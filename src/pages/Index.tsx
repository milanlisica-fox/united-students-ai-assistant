import { useMemo, useState } from "react";
import {
  SlidersHorizontal,
  ChevronLeft,
  Sparkles,
  ArrowUpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AIAssistant from "@/components/AIAssistant";
import AIChatWidget from "@/components/AIChatWidget";
import PropertySearchCard from "@/components/property-search/PropertySearchCard";
import mockData from "@/data/real-accomodations.json";
import generateBookingUrl from "@/utils/generateBookingUrl";
import PropertyMap from "@/components/map/PropertyMap";
import type { PropertyMapMarkers } from "@/components/map/mapHelpers";
import type {
  PropertyMarkerData,
  UniversityMarkerData,
} from "@/components/map/generateMarkers";
import { useAIChat } from "@/hooks/useAIChat";
import { usePropertyRecommendations } from "@/hooks/usePropertyRecommendations";
import ChatPanel from "@/components/ai-experience/ChatPanel";
import ChatInputSection from "@/components/ai-experience/ChatInputSection";
import RecommendationsPanel from "@/components/ai-experience/RecommendationsPanel";
import {
  getImageUrl,
  getPrice,
  getFavoritedFeatures,
} from "@/utils/propertyHelpers";
import SuggestionCards from "@/components/ai-experience/SuggestionCards";
import { GREETING_MESSAGE, ROOM_TYPE_OPTIONS } from "@/constants/ai-experience";
import type { RoomType, RoomClass, ContractType } from "@/types/ai-experience";

// Types for property data (used by listings panel)
interface PropertyFeature {
  title: string;
  iconText: string;
  favorited: boolean;
}

interface PropertyFeatureCategory {
  category: string;
  features: PropertyFeature[];
}

interface ListingPropertyData {
  propertyId: string;
  propertyName: string;
  availability: boolean;
  lowestPrice?: number;
  priceRange?: { lowest: number; highest: number };
  features: { data: PropertyFeatureCategory[] };
  images?: Array<{ image: { previewUrl?: string; thumbUrl?: string } }>;
  propertySlug: string;
  citySlug: string;
  featuredAttribute?: { text: string };
}

// Listing helper functions
const getListingPrice = (property: ListingPropertyData): number | undefined => {
  return property.lowestPrice ?? property.priceRange?.lowest;
};

const getListingImageUrl = (
  property: ListingPropertyData,
): string | undefined => {
  const firstImage = property.images?.[0];
  if (!firstImage?.image) return undefined;
  return firstImage.image.previewUrl || firstImage.image.thumbUrl;
};

const getListingFavoritedFeatures = (property: ListingPropertyData) => {
  const allFeatures = property.features.data.flatMap((cat) => cat.features);
  const favorited = allFeatures.filter((f) => f.favorited);
  return favorited.slice(0, 3).map((f) => ({
    icon: f.iconText,
    text: f.title,
  }));
};

// Map marker data
const universityMarkers: UniversityMarkerData[] =
  mockData.data.universityDataList.map((uni) => ({
    name: uni.name,
    campus: "campus" in uni ? (uni.campus as string) : undefined,
    latitude: uni.latitude,
    longitude: uni.longitude,
  }));

const allPropertyMarkers: PropertyMarkerData[] = (
  mockData.data.propertyDataList as ListingPropertyData[]
)
  .filter((p: any) => p.latitude && p.longitude)
  .map((p: any) => ({
    propertyId: p.propertyId,
    name: p.propertyName,
    latitude: p.latitude,
    longitude: p.longitude,
    soldOut: !p.availability,
    lowestPrice: p.priceRange?.lowest ?? null,
  }));

// Default to 2026/2027 academic year for AI results
const DEFAULT_TENANCY_WEEKS = 51;
const DEFAULT_YEAR_CONFIG = {
  academicYear: "26/27",
  checkinDate: "2026-09-05",
  checkoutDate: "2027-08-28",
};

const generateFullListingBookingUrl = (
  property: ListingPropertyData,
): string => {
  const bookingPath = generateBookingUrl({
    cityId: "SF",
    cityCode: "SF",
    cityName: "Sheffield",
    buildingCode: property.propertyId,
    buildingName: property.propertyName,
    roomClass: "LARGE STANDARD DOUBLE",
    roomType: "STUDIO",
    tenancyType: "DIRECT_LET",
    academicYear: DEFAULT_YEAR_CONFIG.academicYear,
    checkinDate: DEFAULT_YEAR_CONFIG.checkinDate,
    checkoutDate: DEFAULT_YEAR_CONFIG.checkoutDate,
    canTrackAbandonedCheckout: "true",
  });
  return `https://www.unitestudents.com/v2${bookingPath}`;
};

type PageMode = "listings" | "ai-chat";

const Index = () => {
  const [mode, setMode] = useState<PageMode>("listings");
  const [sortBy, setSortBy] = useState("");
  const [isAIFiltered, setIsAIFiltered] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiInputValue, setAiInputValue] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  // AI Chat hooks
  const {
    messages,
    stage,
    inputValue,
    setInputValue,
    selectedRoomType,
    selectedRoomClass,
    selectedContractType,
    conversationalResults,
    desktopChatEndRef,
    mobileChatEndRef,
    handleSubmit,
    handlePickRoomType,
    handlePickRoomClass,
    handlePickContractType,
    handleSuggestionSelect,
  } = useAIChat();

  const {
    recommendations,
    roomClassOptions,
    contractTypeOptions,
    filterCount,
    getBookingUrlForProperty,
  } = usePropertyRecommendations({
    selectedRoomType,
    selectedRoomClass,
    selectedContractType,
  });

  // Dynamic map markers based on mode and AI stage
  const mapMarkers: PropertyMapMarkers = useMemo(() => {
    if (
      mode === "ai-chat" &&
      stage === "recommendations" &&
      recommendations.length > 0
    ) {
      const recommendedIds = new Set(recommendations.map((r) => r.propertyId));
      return {
        properties: allPropertyMarkers.filter((p) =>
          recommendedIds.has(p.propertyId),
        ),
        universities: universityMarkers,
      };
    }
    return { properties: allPropertyMarkers, universities: universityMarkers };
  }, [mode, stage, recommendations]);

  // Recommendations panel for AI chat
  const recommendationsPanel =
    selectedContractType && stage === "recommendations" ? (
      <RecommendationsPanel
        recommendations={recommendations}
        selectedRoomType={selectedRoomType}
        selectedRoomClass={selectedRoomClass}
        selectedContractType={selectedContractType}
        getImageUrl={getImageUrl}
        getPrice={getPrice}
        getFavoritedFeatures={getFavoritedFeatures}
        getBookingUrlForProperty={getBookingUrlForProperty}
      />
    ) : null;

  // Suggestion cards for the idle screen
  const suggestionCards =
    stage === "idle" && messages.length === 0 ? (
      <SuggestionCards onSelect={handleSuggestionSelect} />
    ) : null;

  // Listing properties from mock data
  const realProperties = mockData.data
    .propertyDataList as ListingPropertyData[];
  const displayProperties = isAIFiltered
    ? realProperties.slice(0, 1)
    : realProperties;

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
    <div className="h-screen bg-background relative overflow-hidden">
      {/* Full Screen Map Background */}
      <div className="fixed inset-0 z-0">
        <PropertyMap markers={mapMarkers} />
      </div>

      <div className="flex h-screen relative z-10 overflow-hidden pointer-events-none">
        {/* Desktop Left Panel */}
        <div className="hidden lg:flex lg:w-[42%] relative flex-col overflow-hidden pointer-events-auto">
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
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={mode === "listings"}
                  className="gap-2 shrink-0 px-3"
                  onClick={() => setMode("listings")}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex-1 flex relative min-w-0">
                  <AIAssistant onClick={() => setMode("ai-chat")} />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 shrink-0 px-3"
                  style={{ backgroundColor: "#B4DADA" }}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {mode === "ai-chat"
                    ? `${filterCount} × Filter${filterCount !== 1 ? "s" : ""}`
                    : "0 × Filters"}
                </Button>
              </div>
            </div>
          </div>

          {/* Gap - Shows map background */}
          <div className="h-24 flex-shrink-0" />

          {/* === LISTINGS MODE === */}
          {mode === "listings" && (
            <>
              {/* AI Assistant Input */}
              {aiAssistantOpen && (
                <div className="relative z-20 bg-white px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0">
                  <div className="mb-3 sm:mb-4">
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Hello! I'm your AI assistant. I can help you find the
                      perfect accommodation based on your preferences.
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

              {/* Results header */}
              <div className="relative z-20 bg-white rounded-tr-none lg:rounded-tr-2xl shrink-0">
                <div className="p-3 sm:p-6 pt-0 pb-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1">
                      <h2 className="text-base sm:text-lg font-semibold">
                        {isAIFiltered
                          ? "My picks for you"
                          : `${displayProperties.length} results`}
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
                            <span className="hidden sm:inline">
                              Modify search
                            </span>
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
                        <SelectItem value="price-high">
                          Price: High to low
                        </SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to high
                        </SelectItem>
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
                    {displayProperties.map((property) => (
                      <PropertySearchCard
                        key={property.propertyId}
                        propertyId={property.propertyId}
                        propertyName={property.propertyName}
                        image={getListingImageUrl(property)}
                        price={getListingPrice(property)}
                        features={getListingFavoritedFeatures(property)}
                        propertyPageLink={`/student-accommodation/${property.citySlug}/${property.propertySlug}`}
                        cta={
                          isAIFiltered
                            ? {
                                type: "book-now",
                                text: "Book now",
                                bookingUrl:
                                  generateFullListingBookingUrl(property),
                              }
                            : {
                                type: property.availability
                                  ? "view-rooms"
                                  : "sold-out",
                                text: property.availability
                                  ? "View rooms"
                                  : "Sold out",
                              }
                        }
                        tenancyWeeks={
                          isAIFiltered ? DEFAULT_TENANCY_WEEKS : undefined
                        }
                        tag={property.featuredAttribute?.text}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* === AI CHAT MODE === */}
          {mode === "ai-chat" && (
            <div className="relative z-20 bg-white rounded-tr-2xl flex-1 flex flex-col overflow-hidden">
              <div className="px-6 pt-8 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold">AI Experience</h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMode("listings")}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Results
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
                  <ChatPanel
                    stage={stage}
                    messages={messages}
                    greetingMessage={GREETING_MESSAGE}
                    chatEndRef={desktopChatEndRef}
                    bubbleMaxWidthClass="max-w-[75%]"
                    panelMaxWidthClass="max-w-[75%]"
                    roomTypeOptions={ROOM_TYPE_OPTIONS}
                    roomClassOptions={roomClassOptions}
                    contractTypeOptions={contractTypeOptions}
                    selectedRoomType={selectedRoomType}
                    selectedRoomClass={selectedRoomClass}
                    selectedContractType={selectedContractType}
                    onPickRoomType={(value) =>
                      handlePickRoomType(value as RoomType)
                    }
                    onPickRoomClass={(value) =>
                      handlePickRoomClass(value as RoomClass)
                    }
                    onPickContractType={(value) =>
                      handlePickContractType(value as ContractType)
                    }
                    onSuggestionSelect={handleSuggestionSelect}
                    renderRecommendations={recommendationsPanel}
                    conversationalResults={conversationalResults}
                    renderSuggestionCards={suggestionCards}
                  />
                </div>

                <ChatInputSection
                  stage={stage}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSubmit={handleSubmit}
                  variant="desktop"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Control Bar (only in listings mode) */}
        {mode === "listings" && (
          <div className="lg:hidden fixed top-0 left-0 w-full z-20 px-2 pt-2 pointer-events-auto">
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
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 flex-1 justify-center"
                  style={{ backgroundColor: "#B4DADA" }}
                >
                  <SlidersHorizontal className="w-4 h-4" />0 × Filters
                </Button>
              </div>
              {/* Second line: Back + AI Assistant */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="gap-2 shrink-0 px-2 sm:px-3 py-2 bg-white border border-border rounded-lg opacity-100 disabled:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("ai-chat")}
                  className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white border border-border rounded-lg opacity-100 hover:bg-muted/50 transition-colors"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    Let AI help you find your perfect place
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Search Results Section (only in listings mode) */}
        {mode === "listings" && (
          <div className="lg:hidden w-full relative z-10 pt-[120px] h-screen flex flex-col overflow-hidden pointer-events-auto">
            {/* Mobile Results Header */}
            <div className="bg-white px-4 py-3 border-b shrink-0">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">
                    {isAIFiltered
                      ? "My picks for you"
                      : `${displayProperties.length} results`}
                  </h2>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] text-xs">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="offers">Offers</SelectItem>
                      <SelectItem value="price-high">
                        Price: High to low
                      </SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to high
                      </SelectItem>
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
              <div className="bg-white px-4 py-3 border-b shrink-0">
                <div className="mb-3">
                  <p className="text-muted-foreground text-xs">
                    Hello! I'm your AI assistant. I can help you find the
                    perfect accommodation based on your preferences.
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
            <div className="bg-white flex-1 overflow-y-auto pb-4">
              <div className="p-4">
                <div className="grid gap-4">
                  {displayProperties.map((property) => (
                    <PropertySearchCard
                      key={property.propertyId}
                      propertyId={property.propertyId}
                      propertyName={property.propertyName}
                      image={getListingImageUrl(property)}
                      price={getListingPrice(property)}
                      features={getListingFavoritedFeatures(property)}
                      propertyPageLink={`www.unitestudents.com/student-accommodation/${property.citySlug}/${property.propertySlug}`}
                      cta={
                        isAIFiltered
                          ? {
                              type: "book-now",
                              text: "Book now",
                              bookingUrl:
                                generateFullListingBookingUrl(property),
                            }
                          : {
                              type: property.availability
                                ? "view-rooms"
                                : "sold-out",
                              text: property.availability
                                ? "View rooms"
                                : "Sold out",
                            }
                      }
                      tenancyWeeks={
                        isAIFiltered ? DEFAULT_TENANCY_WEEKS : undefined
                      }
                      tag={property.featuredAttribute?.text}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: AI Chat Full-Screen Overlay */}
        {mode === "ai-chat" && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background pointer-events-auto">
            <div className="h-full flex flex-col">
              {/* Mobile Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 -ml-2"
                    onClick={() => setMode("listings")}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                  <h1 className="text-lg font-semibold">AI Experience</h1>
                </div>
                <div className="flex items-center justify-center px-3 py-2 rounded-xl bg-white">
                  <img
                    src="/unite-students-real-logo.jpg"
                    alt="Unite Students Logo"
                    className="h-6 w-auto"
                  />
                </div>
              </div>

              {/* Mobile Chat Content */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <ChatPanel
                    stage={stage}
                    messages={messages}
                    greetingMessage={GREETING_MESSAGE}
                    chatEndRef={mobileChatEndRef}
                    bubbleMaxWidthClass="max-w-[85%]"
                    panelMaxWidthClass="max-w-[85%]"
                    roomTypeOptions={ROOM_TYPE_OPTIONS}
                    roomClassOptions={roomClassOptions}
                    contractTypeOptions={contractTypeOptions}
                    selectedRoomType={selectedRoomType}
                    selectedRoomClass={selectedRoomClass}
                    selectedContractType={selectedContractType}
                    onPickRoomType={(value) =>
                      handlePickRoomType(value as RoomType)
                    }
                    onPickRoomClass={(value) =>
                      handlePickRoomClass(value as RoomClass)
                    }
                    onPickContractType={(value) =>
                      handlePickContractType(value as ContractType)
                    }
                    onSuggestionSelect={handleSuggestionSelect}
                    renderRecommendations={recommendationsPanel}
                    conversationalResults={conversationalResults}
                    renderSuggestionCards={suggestionCards}
                  />
                </div>

                <ChatInputSection
                  stage={stage}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSubmit={handleSubmit}
                  variant="mobile"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-auto">
          <AIChatWidget
            open={chatOpen}
            onOpenChange={setChatOpen}
            placement="top-right"
          />
        </div>

        {/* Right Panel - Map transparent overlay */}
        <div className="hidden lg:block flex-1 relative" />
      </div>
    </div>
  );
};

export default Index;
