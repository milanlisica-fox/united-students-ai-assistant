import type { ContractType, RoomType } from "@/types/ai-experience";

// Greeting message for the AI assistant
export const GREETING_MESSAGE =
  "What kind of place are you after? I'll sort out some options that match.";

// Room type options available for selection
export const ROOM_TYPE_OPTIONS: RoomType[] = [
  "En-suite",
  "Studio",
  "Accessible rooms",
];

// Contract type options - these map to contractName in availability bands
export const CONTRACT_TYPE_OPTIONS: ContractType[] = [
  "Full Year",
  "Academic Year",
  "Semester",
];

// Mapping of user-friendly room types to data room types
export const ROOM_TYPE_DATA_MAPPING: Record<RoomType, string[]> = {
  "En-suite": ["ENSUITE", "ENSUITE: TWO BED FLAT", "ENSUITE: THREE BED FLAT"],
  Studio: ["STUDIO"],
  "Accessible rooms": ["PARTLY ACCESSIBLE STUDIO", "ACCESSIBLE"],
};

// Suggestion prompts for the idle screen
export const SUGGESTION_PROMPTS = [
  { id: "view", label: "Rooms with a view", icon: "mountain" },
  { id: "popular", label: "Most booked rooms last year", icon: "trending" },
  { id: "value", label: "Best value for money", icon: "piggy-bank" },
  { id: "freshers", label: "Popular with first-year students", icon: "graduation" },
] as const;

export type SuggestionPromptId = (typeof SUGGESTION_PROMPTS)[number]["id"];

// Helper to get academic year string from dates (e.g., "26/27")
export const getAcademicYearFromDate = (startDate: string): string => {
  const date = new Date(startDate);
  const year = date.getFullYear();
  const shortYear = year.toString().slice(-2);
  const nextShortYear = (year + 1).toString().slice(-2);
  return `${shortYear}/${nextShortYear}`;
};
