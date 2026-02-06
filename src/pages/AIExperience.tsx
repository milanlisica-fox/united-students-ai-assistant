import { useState } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { usePropertyRecommendations } from "@/hooks/usePropertyRecommendations";
import MapBackground from "@/components/ai-experience/MapBackground";
import MobileLayout from "@/components/ai-experience/MobileLayout";
import DesktopLayout from "@/components/ai-experience/DesktopLayout";
import RecommendationsPanel from "@/components/ai-experience/RecommendationsPanel";
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
    chatEndRef,
    handleSubmit,
    handlePickRoomType,
    handlePickRoomClass,
    handlePickContractType,
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

  // Shared props for both layouts
  const layoutProps = {
    stage,
    messages,
    chatEndRef,
    roomClassOptions,
    contractTypeOptions,
    selectedRoomType,
    selectedRoomClass,
    selectedContractType,
    inputValue,
    onInputChange: setInputValue,
    onSubmit: handleSubmit,
    onPickRoomType: handlePickRoomType,
    onPickRoomClass: handlePickRoomClass,
    onPickContractType: handlePickContractType,
    renderRecommendations: recommendationsPanel,
  };

  return (
    <div className="min-h-screen bg-background relative">
      <MapBackground stage={stage} />

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
