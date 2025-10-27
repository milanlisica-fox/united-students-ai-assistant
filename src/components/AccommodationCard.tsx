import { Button } from "@/components/ui/button";
import { Building2, Users, GraduationCap, Dumbbell, ExternalLink } from "lucide-react";

interface AccommodationCardProps {
  image: string;
  tag: string;
  title: string;
  price: number;
  amenities: string[];
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  "Common area": <Building2 className="w-4 h-4" />,
  "Outdoor social space": <Users className="w-4 h-4" />,
  "Communal study space": <GraduationCap className="w-4 h-4" />,
  "Gym": <Dumbbell className="w-4 h-4" />,
};

const AccommodationCard = ({ image, tag, title, price, amenities }: AccommodationCardProps) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow flex flex-col md:flex-row">
      {/* Image Section - Left Side */}
      <div className="relative w-full h-24 md:w-1/2 md:h-[170px] flex-shrink-0">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded text-xs font-medium">
          {tag}
        </div>
      </div>
      
      {/* Content Section - Right Side */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Title with external link icon */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
          
          {/* Amenities */}
          <div className="flex gap-2 mb-2 flex-wrap">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-0.5 text-muted-foreground text-sm">
                {amenityIcons[amenity]}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price and Button */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-sm text-muted-foreground">From </span>
            <span className="font-bold text-xl">£{price}</span>
            <span className="text-sm text-muted-foreground"> Per week</span>
          </div>
          
          <Button size="sm" className="rounded-full min-w-[140px]">
            View rooms
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
