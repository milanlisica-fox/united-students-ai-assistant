import { useMemo } from "react";
import type { ChatStage, PropertyData } from "@/types/ai-experience";
import PropertyMap from "@/components/map/PropertyMap";
import type { PropertyMapMarkers } from "@/components/map/mapHelpers";
import type { PropertyMarkerData, UniversityMarkerData } from "@/components/map/generateMarkers";
import mockData from "@/data/real-accomodations.json";

interface MapBackgroundProps {
  stage: ChatStage;
  recommendations?: PropertyData[];
}

// Extract university data from mock data
const universityMarkers: UniversityMarkerData[] =
  mockData.data.universityDataList.map((uni) => ({
    name: uni.name,
    campus: "campus" in uni ? (uni.campus as string) : undefined,
    latitude: uni.latitude,
    longitude: uni.longitude,
  }));

// Extract all property markers from mock data
const allPropertyMarkers: PropertyMarkerData[] = (
  mockData.data.propertyDataList as PropertyData[]
)
  .filter((p) => p.latitude && p.longitude)
  .map((p) => ({
    propertyId: p.propertyId,
    name: p.propertyName,
    latitude: p.latitude!,
    longitude: p.longitude!,
    soldOut: !p.availability,
    lowestPrice: p.priceRange?.lowest ?? null,
  }));

export default function MapBackground({ stage, recommendations }: MapBackgroundProps) {
  const isShowingResults = stage === "recommendations";

  const markers: PropertyMapMarkers = useMemo(() => {
    if (isShowingResults && recommendations && recommendations.length > 0) {
      // Show only recommended properties
      const recommendedIds = new Set(recommendations.map((r) => r.propertyId));
      return {
        properties: allPropertyMarkers.filter((p) =>
          recommendedIds.has(p.propertyId)
        ),
        universities: universityMarkers,
      };
    }

    // Show all properties
    return {
      properties: allPropertyMarkers,
      universities: universityMarkers,
    };
  }, [isShowingResults, recommendations]);

  return (
    <div className="fixed inset-0 z-0 lg:block hidden">
      <PropertyMap markers={markers} />
    </div>
  );
}
