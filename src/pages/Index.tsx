import { useState } from "react";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
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
  const [sortBy, setSortBy] = useState("recommended");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Listings */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Controls Bar */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" disabled className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              
              <AIAssistant />
              
              <Button variant="outline" size="sm" className="ml-auto gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                5 × Filters
              </Button>
            </div>

            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">22 results</h2>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Listings Grid */}
            <div className="grid gap-6">
              {accommodations.map((accommodation) => (
                <AccommodationCard key={accommodation.id} {...accommodation} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="hidden lg:block w-[50%] relative border-l">
          <div className="absolute inset-0 bg-muted">
            <img 
              src={mapStatic} 
              alt="Map showing accommodation locations"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
