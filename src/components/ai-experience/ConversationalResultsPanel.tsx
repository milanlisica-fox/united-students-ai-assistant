import { Badge } from "@/components/ui/badge";
import PropertySearchCard from "@/components/property-search/PropertySearchCard";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { ConversationalResult } from "@/types/ai-experience";
import {
  getImageUrl,
  getPrice,
  getFavoritedFeatures,
  generateFullBookingUrl,
} from "@/utils/propertyHelpers";
import type { PropertyData } from "@/types/ai-experience";

/** Generate a default booking URL for a property (picks first available room) */
const getDefaultBookingUrl = (property: PropertyData): string | undefined => {
  // Try En-suite first as it's the most common, fall back to Studio
  const roomTypes = ["En-suite", "Studio"] as const;
  for (const roomType of roomTypes) {
    const url = generateFullBookingUrl(property, roomType, "STANDARD DOUBLE");
    if (url) return url;
    // Try without specific room class — generateFullBookingUrl's underlying
    // getBookingRoomSelection will fall back to first available classification
    const urlAlt = generateFullBookingUrl(property, roomType, "LARGE STANDARD DOUBLE");
    if (urlAlt) return urlAlt;
  }
  return undefined;
};

type ConversationalResultsPanelProps = {
  results: ConversationalResult[];
};

const ConversationalResultsPanel = ({
  results,
}: ConversationalResultsPanelProps) => {
  const perfectMatches = results.filter((r) => !r.isCloseMatch);
  const closeMatches = results.filter((r) => r.isCloseMatch);

  return (
    <div className="space-y-5 pt-1 animate-in fade-in slide-in-from-bottom-2">
      {/* Perfect matches */}
      {perfectMatches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            Perfect {perfectMatches.length === 1 ? "match" : "matches"}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {perfectMatches[0].matchedFeatures.map((feature) => (
              <Badge
                key={feature}
                variant="secondary"
                className="gap-1 px-3 py-1.5 text-xs bg-teal-50 text-teal-700 border-teal-200"
              >
                {feature}
              </Badge>
            ))}
          </div>
          <div className="space-y-4">
            {perfectMatches.map((result) => {
              const bookingUrl = getDefaultBookingUrl(result.property);
              return (
                <PropertySearchCard
                  key={result.property.propertyId}
                  propertyId={result.property.propertyId}
                  propertyName={result.property.propertyName}
                  image={getImageUrl(result.property)}
                  price={getPrice(result.property)}
                  features={getFavoritedFeatures(result.property)}
                  propertyPageLink={`https://www.unitestudents.com/student-accommodation/${result.property.citySlug}/${result.property.propertySlug}`}
                  cta={
                    bookingUrl
                      ? { type: "book-now", text: "Book a room", bookingUrl }
                      : { type: "view-rooms", text: "View rooms" }
                  }
                  tag={result.property.featuredAttribute?.text}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Close matches */}
      {closeMatches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Close {closeMatches.length === 1 ? "match" : "matches"}
          </div>
          <div className="space-y-4">
            {closeMatches.map((result) => {
              const bookingUrl = getDefaultBookingUrl(result.property);
              return (
                <div key={result.property.propertyId} className="space-y-2">
                  <p className="text-xs text-muted-foreground px-1">
                    Has{" "}
                    <span className="font-medium text-foreground">
                      {result.matchedFeatures.join(", ")}
                    </span>
                    {" but no "}
                    <span className="font-medium text-foreground">
                      {result.missingFeatures.join(", ")}
                    </span>
                  </p>
                  <PropertySearchCard
                    propertyId={result.property.propertyId}
                    propertyName={result.property.propertyName}
                    image={getImageUrl(result.property)}
                    price={getPrice(result.property)}
                    features={getFavoritedFeatures(result.property)}
                    propertyPageLink={`https://www.unitestudents.com/student-accommodation/${result.property.citySlug}/${result.property.propertySlug}`}
                    cta={
                      bookingUrl
                        ? { type: "book-now", text: "Book a room", bookingUrl }
                        : { type: "view-rooms", text: "View rooms" }
                    }
                    tag={result.property.featuredAttribute?.text}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No results at all */}
      {results.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No properties found matching those features.</p>
          <p className="text-sm mt-1">
            Try asking about a gym, cinema room, study space, or common area.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConversationalResultsPanel;
