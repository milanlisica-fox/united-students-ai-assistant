import type { ConversationalResult, PropertyData } from "@/types/ai-experience";
import mockData from "@/data/real-accomodations.json";

const properties = mockData.data.propertyDataList as PropertyData[];

function findProperty(id: string): PropertyData | undefined {
  return properties.find((p) => p.propertyId === id);
}

type SuggestionResponse = {
  userMessage: string;
  aiResponse: string;
  results: ConversationalResult[];
};

const SUGGESTION_RESPONSES: Record<string, () => SuggestionResponse> = {
  view: () => {
    const stVincents = findProperty("STVNCT")!;
    const brassFounders = findProperty("BRSSFD")!;
    return {
      userMessage: "Rooms with a view",
      aiResponse:
        "Great taste! Here are properties where students love the views. St Vincents Place is set in a beautifully restored Victorian church with stunning architecture, and Brass Founders has gorgeous city views from the upper floors 👇",
      results: [
        {
          property: stVincents,
          matchedFeatures: ["outdoor social space", "cinema room"],
          missingFeatures: [],
          isCloseMatch: false,
        },
        {
          property: brassFounders,
          matchedFeatures: ["outdoor social space", "cinema room"],
          missingFeatures: [],
          isCloseMatch: false,
        },
      ],
    };
  },

  popular: () => {
    const archways = findProperty("ARCHWA")!;
    const stVincents = findProperty("STVNCT")!;
    const brassFounders = findProperty("BRSSFD")!;
    return {
      userMessage: "Most booked rooms last year",
      aiResponse:
        "Here are last year's most popular picks! Archways was the #1 most booked property in Sheffield thanks to its unbeatable city-centre location and great value. St Vincents Place and Brass Founders were close behind 👇",
      results: [
        {
          property: archways,
          matchedFeatures: ["city centre", "most booked"],
          missingFeatures: [],
          isCloseMatch: false,
        },
        {
          property: stVincents,
          matchedFeatures: ["highly rated", "popular"],
          missingFeatures: [],
          isCloseMatch: false,
        },
        {
          property: brassFounders,
          matchedFeatures: ["gym", "social spaces"],
          missingFeatures: [],
          isCloseMatch: false,
        },
      ],
    };
  },

  value: () => {
    const westhillHall = findProperty("WSTHLL")!;
    const archways = findProperty("ARCHWA")!;
    return {
      userMessage: "Best value for money",
      aiResponse:
        "Looking for the best bang for your buck? Westhill Hall starts from just £84/week and Archways from £89/week — both with great facilities included. That's bills, Wi-Fi, and contents insurance all covered! 👇",
      results: [
        {
          property: westhillHall,
          matchedFeatures: ["from £84/week", "bills included"],
          missingFeatures: [],
          isCloseMatch: false,
        },
        {
          property: archways,
          matchedFeatures: ["from £89/week", "city centre"],
          missingFeatures: [],
          isCloseMatch: false,
        },
      ],
    };
  },

  freshers: () => {
    const stVincents = findProperty("STVNCT")!;
    const brassFounders = findProperty("BRSSFD")!;
    const archways = findProperty("ARCHWA")!;
    return {
      userMessage: "Popular with first-year students",
      aiResponse:
        "Starting uni? These are the top picks for first-years! They all have brilliant social spaces to help you meet people, plus en-suite options so you get your own bathroom. St Vincents Place even has a cinema room and music room! 👇",
      results: [
        {
          property: stVincents,
          matchedFeatures: ["social spaces", "cinema room", "music room"],
          missingFeatures: [],
          isCloseMatch: false,
        },
        {
          property: brassFounders,
          matchedFeatures: ["gym", "common area", "study space"],
          missingFeatures: [],
          isCloseMatch: false,
        },
        {
          property: archways,
          matchedFeatures: ["city centre", "TV lounge", "great value"],
          missingFeatures: [],
          isCloseMatch: false,
        },
      ],
    };
  },
};

export function getSuggestionResponse(
  suggestionId: string
): SuggestionResponse | undefined {
  const factory = SUGGESTION_RESPONSES[suggestionId];
  return factory?.();
}
