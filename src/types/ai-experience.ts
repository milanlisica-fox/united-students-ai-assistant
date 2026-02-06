// Types for AI Experience chat flow
export type ChatStage =
  | "idle"
  | "askedRoomType"
  | "askedRoomClass"
  | "askedContractType"
  | "recommendations";

export type ChatMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
};

export type RoomType = "En-suite" | "Studio" | "Accessible rooms";
export type RoomClass = string;

// Contract type options - matches contractName in availability bands
export type ContractType = "Full Year" | "Academic Year" | "Semester";

// Availability band from property room data
export type AvailabilityBand = {
  contractLengthWeeks: number;
  contractStartDate: string;
  contractEndDate: string;
  contractOriginalStartDate?: string;
  price: number;
  contractName: string;
};

// Selected contract for booking
export type SelectedContract = {
  propertyId: string;
  contractType: ContractType;
  band: AvailabilityBand;
};

// Types for property data
export interface PropertyFeature {
  title: string;
  iconText: string;
  favorited: boolean;
}

export interface PropertyFeatureCategory {
  category: string;
  features: PropertyFeature[];
}

export interface PropertyData {
  propertyId: string;
  propertyName: string;
  availability: boolean;
  lowestPrice?: number;
  priceRange?: { lowest: number; highest: number };
  features: { data: PropertyFeatureCategory[] };
  images?: Array<{ image: { previewUrl?: string; thumbUrl?: string } }>;
  propertySlug: string;
  citySlug: string;
  featuredAttribute?: { text: string };
  roomTypes?: string[];
  latitude?: number;
  longitude?: number;
}

// Room classification types
export type RoomClassification = {
  classification: string;
  tenancyType?: string;
  roomTypeName?: string;
  availabilityBands?: AvailabilityBand[];
  soldOut?: boolean;
  lowestPrice?: number;
};

export type PropertyRoomData = {
  name?: string;
  roomClassifications?: RoomClassification[];
};

export type PropertyRoomsPayload = {
  data?: {
    rooms?: PropertyRoomData[];
  };
};

// Booking selection type - includes availability band for correct dates
export type BookingRoomSelection = {
  roomClass: string;
  roomType: string;
  tenancyType: string;
  availabilityBand?: AvailabilityBand;
} | null;
