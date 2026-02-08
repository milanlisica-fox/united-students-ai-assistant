import type { ConversationalResult, PropertyData } from "@/types/ai-experience";

// Mapping of user-friendly search terms to actual feature titles in the data
const AMENITY_KEYWORDS: Record<string, string[]> = {
  gym: ["Gym"],
  "common room": ["Common area"],
  "common area": ["Common area"],
  cinema: ["Cinema room", "Access to cinema room in other property"],
  "cinema room": ["Cinema room", "Access to cinema room in other property"],
  "study space": ["Communal study space"],
  "study room": ["Communal study space"],
  "bike storage": ["Bike storage"],
  bike: ["Bike storage"],
  "music room": ["Music room"],
  music: ["Music room"],
  "outdoor space": ["Outdoor social space"],
  outdoor: ["Outdoor social space"],
  garden: ["Outdoor social space"],
  laundry: ["Laundry"],
  parking: ["Car parking on site (extra charge)"],
  "car parking": ["Car parking on site (extra charge)"],
  "tv lounge": ["TV Lounge"],
  tv: ["TV Lounge"],
  printing: ["Printing (extra charge)"],
  wifi: ["Ultrafast Broadband & Wi-Fi*", "Wi-Fi in your flat & communal areas"],
  broadband: ["Ultrafast Broadband & Wi-Fi*"],
  "vending machine": ["Vending machine"],
  vending: ["Vending machine"],
};

// Sorted by key length descending so longer phrases match first
const SORTED_KEYWORDS = Object.keys(AMENITY_KEYWORDS).sort(
  (a, b) => b.length - a.length
);

/**
 * Extract amenity keywords from free-form user input.
 * Returns the matched keyword phrases (e.g., ["gym", "common room"]).
 */
export function extractAmenityKeywords(userInput: string): string[] {
  const lower = userInput.toLowerCase();
  const matched: string[] = [];

  // Track which characters have been matched to avoid overlapping matches
  const used = new Set<number>();

  for (const keyword of SORTED_KEYWORDS) {
    let searchFrom = 0;
    while (true) {
      const idx = lower.indexOf(keyword, searchFrom);
      if (idx === -1) break;

      // Check no overlap with already matched characters
      let overlaps = false;
      for (let i = idx; i < idx + keyword.length; i++) {
        if (used.has(i)) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        matched.push(keyword);
        for (let i = idx; i < idx + keyword.length; i++) {
          used.add(i);
        }
        break; // Only match each keyword once
      }

      searchFrom = idx + 1;
    }
  }

  return matched;
}

/**
 * Get all feature titles from a property's feature categories.
 */
function getPropertyFeatureTitles(property: PropertyData): string[] {
  if (!property.features?.data) return [];
  return property.features.data.flatMap((cat) =>
    cat.features.map((f) => f.title)
  );
}

/**
 * Check if a property has a specific amenity keyword match.
 */
function propertyHasAmenity(
  featureTitles: string[],
  keyword: string
): boolean {
  const targetTitles = AMENITY_KEYWORDS[keyword] ?? [];
  return targetTitles.some((target) =>
    featureTitles.some(
      (ft) => ft.toLowerCase() === target.toLowerCase()
    )
  );
}

/**
 * Match properties against amenity keywords.
 * Returns perfect matches (all keywords) and close matches (missing exactly 1).
 */
export function matchPropertiesByAmenities(
  keywords: string[],
  properties: PropertyData[]
): { perfect: ConversationalResult[]; close: ConversationalResult[] } {
  const perfect: ConversationalResult[] = [];
  const close: ConversationalResult[] = [];

  for (const property of properties) {
    if (property.availability === false) continue;

    const featureTitles = getPropertyFeatureTitles(property);
    const matched: string[] = [];
    const missing: string[] = [];

    for (const keyword of keywords) {
      if (propertyHasAmenity(featureTitles, keyword)) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    }

    if (missing.length === 0 && matched.length > 0) {
      perfect.push({
        property,
        matchedFeatures: matched,
        missingFeatures: [],
        isCloseMatch: false,
      });
    } else if (missing.length === 1 && matched.length > 0) {
      close.push({
        property,
        matchedFeatures: matched,
        missingFeatures: missing,
        isCloseMatch: true,
      });
    }
  }

  return { perfect, close };
}

/**
 * Generate a natural-sounding AI response for conversational search results.
 */
export function generateConversationalResponse(
  perfect: ConversationalResult[],
  close: ConversationalResult[],
  keywords: string[]
): string {
  const keywordList = keywords.join(" and ");

  if (perfect.length > 0 && close.length > 0) {
    return `Great news! I found ${perfect.length} ${perfect.length === 1 ? "property" : "properties"} with ${keywordList}. I've also found ${close.length} close ${close.length === 1 ? "match" : "matches"} that might interest you too — have a look below 👇`;
  }

  if (perfect.length > 0) {
    return `I found ${perfect.length} ${perfect.length === 1 ? "property" : "properties"} with ${keywordList}! Here's what I've got for you 👇`;
  }

  if (close.length > 0) {
    return `I couldn't find an exact match for everything you asked for, but I found ${close.length} ${close.length === 1 ? "property" : "properties"} that ${close.length === 1 ? "comes" : "come"} close — ${close.length === 1 ? "it has" : "they have"} most of what you're looking for 👇`;
  }

  return "Hmm, I couldn't find any properties matching those features. Try asking about things like a gym, cinema room, common area, study space, or music room!";
}
