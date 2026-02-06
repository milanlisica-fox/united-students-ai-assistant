import { Badge } from "@/components/ui/badge";
import PropertySearchCard from "@/components/property-search/PropertySearchCard";
import { Clock, Home, Sparkles } from "lucide-react";

type RecommendationProperty = {
  propertyId: string;
  propertyName: string;
  propertySlug: string;
  citySlug: string;
  availability?: boolean;
  lowestPrice?: number;
  priceRange?: { lowest: number; highest: number };
  features: {
    data: Array<{
      category: string;
      features: Array<{ title: string; iconText: string; favorited: boolean }>;
    }>;
  };
  images?: Array<{ image: { previewUrl?: string; thumbUrl?: string } }>;
  featuredAttribute?: { text: string };
};

type RecommendationsPanelProps = {
  recommendations: RecommendationProperty[];
  selectedRoomType?: string | null;
  selectedRoomClass?: string | null;
  selectedContractType?: string | null;
  getImageUrl: (property: RecommendationProperty) => string | undefined;
  getPrice: (property: RecommendationProperty) => number | undefined;
  getFavoritedFeatures: (
    property: RecommendationProperty
  ) => Array<{ icon: string; text: string }>;
  getBookingUrlForProperty: (
    property: RecommendationProperty
  ) => string | undefined;
};

const RecommendationsPanel = ({
  recommendations,
  selectedRoomType,
  selectedRoomClass,
  selectedContractType,
  getImageUrl,
  getPrice,
  getFavoritedFeatures,
  getBookingUrlForProperty,
}: RecommendationsPanelProps) => {
  return (
    <div className="space-y-4 pt-1 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-wrap gap-2">
        {selectedRoomType && (
          <Badge
            variant="secondary"
            className="gap-1 px-3 py-1.5 text-xs bg-teal-50 text-teal-700 border-teal-200"
          >
            <Home className="w-3 h-3" />
            {selectedRoomType}
          </Badge>
        )}
        {selectedRoomClass && (
          <Badge
            variant="secondary"
            className="gap-1 px-3 py-1.5 text-xs bg-teal-50 text-teal-700 border-teal-200"
          >
            <Sparkles className="w-3 h-3" />
            {selectedRoomClass}
          </Badge>
        )}
        {selectedContractType && (
          <Badge
            variant="secondary"
            className="gap-1 px-3 py-1.5 text-xs bg-teal-50 text-teal-700 border-teal-200"
          >
            <Clock className="w-3 h-3" />
            {selectedContractType}
          </Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Found {recommendations.length}{" "}
        {recommendations.length === 1 ? "property" : "properties"} matching your
        criteria
      </p>

      <div className="space-y-4">
        {recommendations.map((property) => (
          <PropertySearchCard
            key={property.propertyId}
            propertyId={property.propertyId}
            propertyName={property.propertyName}
            image={getImageUrl(property)}
            price={getPrice(property)}
            features={getFavoritedFeatures(property)}
            propertyPageLink={`https://www.unitestudents.com/student-accommodation/${property.citySlug}/${property.propertySlug}`}
            cta={{
              type: "book-now",
              text: "Book now",
              bookingUrl: getBookingUrlForProperty(property),
            }}
            tag={property.featuredAttribute?.text}
          />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No properties found matching your criteria.</p>
          <p className="text-sm mt-1">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPanel;
