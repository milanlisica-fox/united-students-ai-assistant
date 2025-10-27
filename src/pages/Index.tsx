import { useState } from "react";
import { SlidersHorizontal, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AIAssistant from "@/components/AIAssistant";
import AccommodationCard from "@/components/AccommodationCard";
import accommodation1 from "@/assets/accommodation-1.jpg";
import accommodation2 from "@/assets/accommodation-2.jpg";
import accommodation3 from "@/assets/accommodation-3.jpg";
import accommodation4 from "@/assets/accommodation-4.jpg";
import mapStatic from "@/assets/map-static.jpg";

const accommodations = [
  {
    id: 1,
    image: accommodation1,
    tag: "Upgraded common areas for 2024",
    title: "Stapleton House",
    price: 264,
    amenities: ["Common area", "Outdoor social space", "Communal study space"],
  },
  {
    id: 2,
    image: accommodation2,
    tag: "Close to Waterloo attractions",
    title: "Moonraker Point",
    price: 265,
    amenities: ["Common area", "Communal study space"],
  },
  {
    id: 3,
    image: accommodation3,
    tag: "Close to the Tower of London",
    title: "Drapery Place",
    price: 225,
    amenities: ["Gym", "Common area", "Communal study space"],
  },
  {
    id: 4,
    image: accommodation4,
    tag: "East London location",
    title: "Pacific Court",
    price: 263,
    amenities: ["Common area", "Outdoor social space"],
  },
];

const Index = () => {
  const [sortBy, setSortBy] = useState("");

  return (
    <div className="min-h-screen bg-background relative">
      {/* Full Screen Map Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={mapStatic} 
          alt="Map showing accommodation locations"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Left Panel - Listings */}
        <div className="w-[42%] relative flex flex-col">
          {/* Controls Bar - Fixed at top */}
          <div className="fixed top-0 left-0 w-[42%] z-20 px-3 pt-6">
            <div className="flex items-center px-4 py-3 rounded-2xl bg-white gap-4">
              <img 
                src="/unite-students-logo.svg" 
                alt="Unite Students Logo" 
                className="h-10 w-auto"
              />
              <div className="flex-1"></div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" disabled className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <AIAssistant />
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  5 × Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Gap - Shows map background */}
          <div className="h-24 flex-shrink-0" />

          {/* Results header - Fixed */}
          <div className="relative z-20 bg-white rounded-tr-2xl">
            <div className="p-6 pt-0 pb-2">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white">
                <h2 className="text-lg font-semibold">22 results</h2>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="offers">Offers</SelectItem>
                    <SelectItem value="price-high">Price: High to low</SelectItem>
                    <SelectItem value="price-low">Price: Low to high</SelectItem>
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
                {accommodations.map((accommodation) => (
                  <AccommodationCard key={accommodation.id} {...accommodation} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Map transparent overlay */}
        <div className="hidden lg:block flex-1 relative" />
      </div>
    </div>
  );
};

export default Index;
