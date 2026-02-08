import { useMemo } from "react";
import type {
  ContractType,
  PropertyData,
  RoomClass,
  RoomType,
} from "@/types/ai-experience";
import { ROOM_TYPE_DATA_MAPPING } from "@/constants/ai-experience";
import {
  generateFullBookingUrl,
  getAvailabilityBandsForProperty,
  getAvailableContractTypes,
  getBookingRoomSelection,
  getRoomClassificationsForProperty,
} from "@/utils/propertyHelpers";
import mockData from "@/data/real-accomodations.json";

interface UsePropertyRecommendationsProps {
  selectedRoomType: RoomType | null;
  selectedRoomClass: RoomClass | null;
  selectedContractType: ContractType | null;
}

interface UsePropertyRecommendationsReturn {
  recommendations: PropertyData[];
  roomClassOptions: string[];
  contractTypeOptions: ContractType[];
  filterCount: number;
  getBookingUrlForProperty: (property: PropertyData) => string | undefined;
}

export function usePropertyRecommendations({
  selectedRoomType,
  selectedRoomClass,
  selectedContractType,
}: UsePropertyRecommendationsProps): UsePropertyRecommendationsReturn {
  // Real properties from mock data
  const realProperties = mockData.data.propertyDataList as PropertyData[];

  // Get room class options based on selected room type
  const roomClassOptions = useMemo(() => {
    if (!selectedRoomType) return [];

    const options = new Set<string>();
    realProperties.forEach((property) => {
      if (property.availability === false) return;
      const classifications = getRoomClassificationsForProperty(
        property.propertyId,
        selectedRoomType
      );
      classifications.forEach((entry) => {
        if (!entry.soldOut) {
          options.add(entry.classification);
        }
      });
    });
    return Array.from(options).sort();
  }, [realProperties, selectedRoomType]);

  // Filter properties based on selected room type, room class, and contract type
  const recommendations = useMemo(() => {
    let filtered = realProperties;

    if (selectedRoomType) {
      const targetRoomTypes = ROOM_TYPE_DATA_MAPPING[selectedRoomType] || [];
      filtered = realProperties.filter((property) => {
        // Exclude unavailable properties
        if (property.availability === false) {
          return false;
        }
        if (!targetRoomTypes.length) {
          return true;
        }

        // Check if property has the room type in its roomTypes array
        const roomTypes = property.roomTypes ?? [];
        const hasRoomTypeInList = roomTypes.some((rt) =>
          targetRoomTypes.includes(rt.toUpperCase().trim())
        );

        if (!hasRoomTypeInList) {
          return false;
        }

        // IMPORTANT: Also verify the property has actual room classifications for this room type
        // This catches cases where a property lists a room type but has no available classifications
        const classifications = getRoomClassificationsForProperty(
          property.propertyId,
          selectedRoomType
        );

        // Only include properties that have at least one non-sold-out classification
        return classifications.some((entry) => !entry.soldOut);
      });
    }

    if (selectedRoomType && selectedRoomClass) {
      filtered = filtered.filter((property) => {
        const classifications = getRoomClassificationsForProperty(
          property.propertyId,
          selectedRoomType
        );
        if (!classifications.length) return false;
        return classifications.some(
          (entry) =>
            entry.classification === selectedRoomClass && !entry.soldOut
        );
      });
    }

    // Filter by contract type if selected
    if (selectedRoomType && selectedRoomClass && selectedContractType) {
      filtered = filtered.filter((property) => {
        const bands = getAvailabilityBandsForProperty(
          property.propertyId,
          selectedRoomType,
          selectedRoomClass
        );
        return bands.some((band) => band.contractName === selectedContractType);
      });
    }

    // Return up to 3 properties
    return filtered.slice(0, 3);
  }, [
    realProperties,
    selectedRoomType,
    selectedRoomClass,
    selectedContractType,
  ]);

  // Get available contract types based on filtered properties and selections
  const contractTypeOptions = useMemo(() => {
    if (!selectedRoomType || !selectedRoomClass) return [];

    // Get contract types from properties that match room type and class
    const filteredForContractTypes = realProperties.filter((property) => {
      if (property.availability === false) return false;
      const classifications = getRoomClassificationsForProperty(
        property.propertyId,
        selectedRoomType
      );
      return classifications.some(
        (entry) => entry.classification === selectedRoomClass && !entry.soldOut
      );
    });

    return getAvailableContractTypes(
      filteredForContractTypes,
      selectedRoomType,
      selectedRoomClass
    );
  }, [realProperties, selectedRoomType, selectedRoomClass]);

  // Count of active filters
  const filterCount = useMemo(() => {
    let count = 0;
    if (selectedRoomType) count++;
    if (selectedRoomClass) count++;
    if (selectedContractType) count++;
    return count;
  }, [selectedRoomType, selectedRoomClass, selectedContractType]);

  // Generate booking URL for a property
  // Returns undefined if the property doesn't have a valid booking configuration
  const getBookingUrlForProperty = (property: PropertyData) => {
    if (!selectedRoomType || !selectedRoomClass || !selectedContractType) {
      return undefined;
    }

    // Check if the property has valid room classifications for the selected type
    const bookingSelection = getBookingRoomSelection(
      property.propertyId,
      selectedRoomType,
      selectedRoomClass,
      selectedContractType
    );

    if (!bookingSelection || !bookingSelection.availabilityBand) {
      // No valid booking configuration exists for this property/room type/class/contract combination
      return undefined;
    }

    // Generate the URL - will return null if configuration is invalid
    const url = generateFullBookingUrl(
      property,
      selectedRoomType,
      selectedRoomClass,
      selectedContractType
    );

    return url ?? undefined;
  };

  return {
    recommendations,
    roomClassOptions,
    contractTypeOptions,
    filterCount,
    getBookingUrlForProperty,
  };
}
