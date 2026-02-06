import type {
  AvailabilityBand,
  BookingRoomSelection,
  ContractType,
  PropertyData,
  PropertyRoomsPayload,
  RoomClass,
  RoomClassification,
  RoomType,
} from "@/types/ai-experience";
import {
  getAcademicYearFromDate,
  ROOM_TYPE_DATA_MAPPING,
} from "@/constants/ai-experience";
import generateBookingUrl from "@/utils/generateBookingUrl";

// Import property room data
import stVincentsData from "@/data/st-vincents-place.json";
import archwaysData from "@/data/archways.json";
import brassFoundersData from "@/data/brass-founders.json";
import westhillHallData from "@/data/westhill-hall.json";

// Property rooms data by ID
export const propertyRoomsById: Record<string, PropertyRoomsPayload> = {
  STVNCT: stVincentsData as PropertyRoomsPayload,
  ARCHWA: archwaysData as PropertyRoomsPayload,
  BRSSFD: brassFoundersData as PropertyRoomsPayload,
  WSTHLL: westhillHallData as PropertyRoomsPayload,
};

/**
 * Get the price from a property (lowest price or range lowest)
 */
export const getPrice = (property: PropertyData): number | undefined => {
  return property.lowestPrice ?? property.priceRange?.lowest;
};

/**
 * Get the image URL from a property's first image
 */
export const getImageUrl = (property: PropertyData): string | undefined => {
  const firstImage = property.images?.[0];
  if (!firstImage?.image) return undefined;
  return firstImage.image.previewUrl || firstImage.image.thumbUrl;
};

/**
 * Get the favorited features from a property (up to 3)
 */
export const getFavoritedFeatures = (property: PropertyData) => {
  const allFeatures = property.features.data.flatMap((cat) => cat.features);
  const favorited = allFeatures.filter((f) => f.favorited);
  return favorited.slice(0, 3).map((f) => ({
    icon: f.iconText,
    text: f.title,
  }));
};

/**
 * Get room classifications for a property based on room type
 */
export const getRoomClassificationsForProperty = (
  propertyId: string,
  roomType: RoomType
): RoomClassification[] => {
  const rooms = propertyRoomsById[propertyId]?.data?.rooms ?? [];
  const targetRoomTypes = ROOM_TYPE_DATA_MAPPING[roomType] ?? [];
  if (!targetRoomTypes.length) return [];

  const matchingRooms = rooms.filter((room) => {
    if (!room?.name) return false;
    return targetRoomTypes.includes(room.name.toUpperCase().trim());
  });

  return matchingRooms.flatMap((room) => room.roomClassifications ?? []);
};

/**
 * Get availability bands for a property/room type/class combination
 */
export const getAvailabilityBandsForProperty = (
  propertyId: string,
  roomType: RoomType,
  roomClass: RoomClass
): AvailabilityBand[] => {
  const classifications = getRoomClassificationsForProperty(
    propertyId,
    roomType
  );
  const matching = classifications.find(
    (entry) => entry.classification === roomClass && !entry.soldOut
  );

  if (!matching?.availabilityBands) return [];

  // Filter out bands without required fields and cast to proper type
  return matching.availabilityBands.filter(
    (band): band is AvailabilityBand =>
      typeof band.contractLengthWeeks === "number" &&
      typeof band.contractStartDate === "string" &&
      typeof band.contractEndDate === "string" &&
      typeof band.price === "number" &&
      typeof band.contractName === "string"
  );
};

/**
 * Get unique contract types available across all properties for a room type/class
 */
export const getAvailableContractTypes = (
  properties: PropertyData[],
  roomType: RoomType,
  roomClass: RoomClass
): ContractType[] => {
  const contractNames = new Set<string>();

  properties.forEach((property) => {
    const bands = getAvailabilityBandsForProperty(
      property.propertyId,
      roomType,
      roomClass
    );
    bands.forEach((band) => {
      contractNames.add(band.contractName);
    });
  });

  // Map to ContractType and filter valid types
  const validTypes: ContractType[] = ["Full Year", "Academic Year", "Semester"];
  return validTypes.filter((type) => contractNames.has(type));
};

/**
 * Get booking room selection for a property with availability band
 */
export const getBookingRoomSelection = (
  propertyId: string,
  roomType: RoomType,
  roomClass: RoomClass,
  contractType?: ContractType
): BookingRoomSelection => {
  const classifications = getRoomClassificationsForProperty(
    propertyId,
    roomType
  );
  if (!classifications.length) return null;

  const matching =
    classifications.find((entry) => entry.classification === roomClass) ??
    classifications.find((entry) => !entry.soldOut) ??
    classifications[0];

  if (!matching) return null;

  // Find the appropriate availability band
  let availabilityBand: AvailabilityBand | undefined;
  if (contractType && matching.availabilityBands) {
    availabilityBand = matching.availabilityBands.find(
      (band) => band.contractName === contractType
    ) as AvailabilityBand | undefined;
  }

  // If no specific contract type or not found, use the first available band
  if (!availabilityBand && matching.availabilityBands?.length) {
    availabilityBand = matching.availabilityBands[0] as AvailabilityBand;
  }

  return {
    roomClass: matching.classification,
    roomType:
      matching.roomTypeName ??
      ROOM_TYPE_DATA_MAPPING[roomType]?.[0] ??
      "STUDIO",
    tenancyType: matching.tenancyType ?? "DIRECT_LET",
    availabilityBand,
  };
};

/**
 * Format date from ISO string to YYYY-MM-DD
 */
const formatDateForBooking = (isoDate: string): string => {
  return isoDate.split("T")[0];
};

/**
 * Generate full booking URL for a property
 * Returns null if no valid booking configuration exists
 */
export const generateFullBookingUrl = (
  property: PropertyData,
  selectedRoomType: RoomType,
  selectedRoomClass: RoomClass,
  contractType?: ContractType
): string | null => {
  const bookingSelection = getBookingRoomSelection(
    property.propertyId,
    selectedRoomType,
    selectedRoomClass,
    contractType
  );

  // If no valid booking selection exists, return null
  if (!bookingSelection) {
    return null;
  }

  // Get dates from availability band
  const band = bookingSelection.availabilityBand;
  if (!band) {
    return null;
  }

  const checkinDate = formatDateForBooking(band.contractStartDate);
  const checkoutDate = formatDateForBooking(band.contractEndDate);
  const academicYear = getAcademicYearFromDate(band.contractStartDate);

  const bookingPath = generateBookingUrl({
    cityId: "SF",
    cityCode: "SF",
    cityName: "Sheffield",
    buildingCode: property.propertyId,
    buildingName: property.propertyName,
    roomClass: bookingSelection.roomClass,
    roomType: bookingSelection.roomType,
    tenancyType: bookingSelection.tenancyType,
    academicYear,
    checkinDate,
    checkoutDate,
    canTrackAbandonedCheckout: "true",
  });

  return `https://www.unitestudents.com/v2${bookingPath}`;
};
