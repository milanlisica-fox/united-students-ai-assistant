import { useState } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { usePropertyRecommendations } from "@/hooks/usePropertyRecommendations";
import MapBackground from "@/components/ai-experience/MapBackground";
import MobileLayout from "@/components/ai-experience/MobileLayout";
import DesktopLayout from "@/components/ai-experience/DesktopLayout";
import RecommendationsPanel from "@/components/ai-experience/RecommendationsPanel";
import SuggestionCards from "@/components/ai-experience/SuggestionCards";
import {
  getImageUrl,
  getPrice,
  getFavoritedFeatures,
} from "@/utils/propertyHelpers";

const AIExperience = () => {
  const [chatOpen, setChatOpen] = useState(false);

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

  // Render recommendations panel when ready
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

  // Shared props for both layouts
  const layoutProps = {
    stage,
    messages,
    desktopChatEndRef,
    mobileChatEndRef,
    roomClassOptions,
    contractTypeOptions,
    selectedRoomType,
    selectedRoomClass,
    selectedContractType,
    inputValue,
    filterCount,
    onInputChange: setInputValue,
    onSubmit: handleSubmit,
    onPickRoomType: handlePickRoomType,
    onPickRoomClass: handlePickRoomClass,
    onPickContractType: handlePickContractType,
    onSuggestionSelect: handleSuggestionSelect,
    renderRecommendations: recommendationsPanel,
    conversationalResults,
    renderSuggestionCards: suggestionCards,
  };

  return (
    <div className="min-h-screen bg-background relative">
      <MapBackground stage={stage} recommendations={recommendations} />

      <MobileLayout {...layoutProps} />

      <DesktopLayout
        {...layoutProps}
        filterCount={filterCount}
        chatOpen={chatOpen}
        onChatOpenChange={setChatOpen}
      />
    </div>
  );
};

export default AIExperience;
