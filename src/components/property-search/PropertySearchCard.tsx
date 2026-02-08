import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Home,
  Users,
  BookOpen,
  Dumbbell,
  Tv,
  Building2,
  Coffee,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icon mapping for features - maps iconText to lucide icons
const getFeatureIcon = (iconText: string): React.ReactNode => {
  switch (iconText) {
    case "r": // Common area
      return <Home className="w-4 h-4" />;
    case "-": // Cinema room
      return <Tv className="w-4 h-4" />;
    case "\u201C": // Communal study space (Unicode left double quote)
      return <BookOpen className="w-4 h-4" />;
    case "X": // Gym
      return <Dumbbell className="w-4 h-4" />;
    case "v": // Outdoor social space
      return <Users className="w-4 h-4" />;
    default:
      return <Building2 className="w-4 h-4" />;
  }
};

export interface PropertySearchCardProps {
  propertyId: string;
  propertyName: string;
  image?: string;
  price?: number;
  tenancyWeeks?: number; // Number of weeks for the tenancy
  features: Array<{ icon: string; text: string }>;
  propertyPageLink: string;
  cta: {
    type: "view-rooms" | "sold-out" | "book-now";
    text: string;
    bookingUrl?: string; // Full URL for "book-now" type
  };
  tag?: string;
  isSelected?: boolean;
  onViewRooms?: () => void;
}

const PropertySearchCard = ({
  propertyId,
  propertyName,
  image,
  price,
  tenancyWeeks,
  features,
  propertyPageLink,
  cta,
  tag,
  isSelected = false,
  onViewRooms,
}: PropertySearchCardProps) => {
  return (
    <div
      className="relative w-full overflow-hidden"
      data-testid="property-card"
      data-property-id={propertyId}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl bg-white shadow-sm",
          "md:h-[13.125rem] md:flex-row",
          "lg:h-48",
          "border border-gray-200",
          isSelected && "ring-4 ring-teal-500"
        )}
      >
        {/* Image Section */}
        <div
          className={cn(
            "relative h-32 w-full overflow-hidden flex-shrink-0",
            "md:h-full md:w-[11rem]",
            "lg:w-[12rem]"
          )}
        >
          {image ? (
            <img
              src={image}
              alt={propertyName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {tag && (
            <span className="absolute left-2 top-2 z-20 inline-block rounded-full bg-yellow-400 py-1 px-2 text-xs font-normal text-gray-900">
              {tag}
            </span>
          )}
        </div>

        {/* Content Section */}
        <div
          className={cn(
            "flex flex-col justify-between p-3",
            "min-w-0 flex-1 md:p-4"
          )}
        >
          <div className="flex flex-col">
            {/* Property Name with External Link */}
            <a
              href={propertyPageLink}
              rel="noopener noreferrer"
              target="_blank"
              className="relative z-30"
            >
              <span
                className={cn(
                  "inline-flex items-center gap-1 max-w-[65%] font-semibold text-base leading-5 text-gray-900 hover:underline"
                )}
              >
                {propertyName}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </span>
            </a>

            {/* Features */}
            <div className="my-1 flex w-full min-w-0 basis-full flex-wrap gap-x-3 gap-y-1">
              {features.slice(0, 3).map((feature) => (
                <div
                  className="flex items-center gap-1 text-xs font-normal text-gray-700"
                  key={feature.text}
                >
                  {getFeatureIcon(feature.icon)}
                  <span className="whitespace-normal">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price and CTA */}
          <div className="mt-2 flex w-full items-end justify-between gap-3">
            {(cta.type === "view-rooms" || cta.type === "book-now") && price ? (
              <div className="flex flex-col flex-1 min-w-0">
                {/* Single line layout for larger screens */}
                <div className="hidden xl:block text-xs font-normal text-gray-500">
                  From{" "}
                  <span className="text-lg font-bold text-gray-900">
                    £{price}
                  </span>{" "}
                  Per week
                </div>
                {/* Two line layout for smaller screens */}
                <div className="xl:hidden">
                  <div className="text-xs font-normal text-gray-500 whitespace-nowrap">
                    From{" "}
                    <span className="text-lg font-bold text-gray-900">
                      £{price}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Per week</div>
                </div>
                {/* Tenancy weeks on separate line for book-now */}
                {cta.type === "book-now" && tenancyWeeks && (
                  <div className="text-xs text-gray-500">
                    {tenancyWeeks} weeks
                  </div>
                )}
              </div>
            ) : (
              <div />
            )}

            <Button
              onClick={() => {
                if (cta.type === "book-now" && cta.bookingUrl) {
                  window.open(cta.bookingUrl, "_blank");
                } else if (onViewRooms) {
                  onViewRooms();
                }
              }}
              disabled={cta.type === "sold-out"}
              className={cn(
                "min-w-28 rounded-full flex-shrink-0 whitespace-nowrap",
                cta.type === "sold-out" &&
                  "bg-yellow-400 text-gray-900 hover:bg-yellow-400 cursor-not-allowed"
              )}
              size="sm"
            >
              {cta.text}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySearchCard;
