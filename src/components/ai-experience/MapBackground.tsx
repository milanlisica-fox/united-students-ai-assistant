import type { ChatStage } from "@/types/ai-experience";
import mapStatic from "@/assets/map-static.jpg";
import mapResults from "@/assets/map-resultsmap.png";

interface MapBackgroundProps {
  stage: ChatStage;
}

export default function MapBackground({ stage }: MapBackgroundProps) {
  const isShowingResults = stage === "recommendations";

  return (
    <div className="fixed inset-0 z-0 lg:block hidden">
      <img
        key={isShowingResults ? "results" : "static"}
        src={isShowingResults ? mapResults : mapStatic}
        alt="Map showing accommodation locations"
        className="w-full h-full object-cover animate-in fade-in duration-500"
      />
    </div>
  );
}
