import { Button } from "@/components/ui/button";
import { Building2, Users, GraduationCap, Dumbbell } from "lucide-react";

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
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded text-xs font-medium">
          {tag}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        
        <div className="flex gap-3 mb-4 flex-wrap">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-1 text-muted-foreground text-xs">
              {amenityIcons[amenity]}
              <span className="hidden sm:inline">{amenity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">From </span>
            <span className="font-bold text-xl">£{price}</span>
            <span className="text-sm text-muted-foreground"> per week</span>
          </div>
          
          <Button size="default">
            View rooms
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
