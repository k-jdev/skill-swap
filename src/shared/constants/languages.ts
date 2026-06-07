export type TeachingLanguage = {
  value: string;
  label: string;
  group: string;
};

export const TEACHING_LANGUAGES: TeachingLanguage[] = [
  // Most Popular
  { value: "english", label: "English", group: "Most Popular" },
  { value: "spanish", label: "Spanish", group: "Most Popular" },
  { value: "french", label: "French", group: "Most Popular" },
  { value: "german", label: "German", group: "Most Popular" },
  {
    value: "chinese-mandarin",
    label: "Chinese (Mandarin)",
    group: "Most Popular",
  },
  { value: "arabic", label: "Arabic", group: "Most Popular" },
  { value: "portuguese", label: "Portuguese", group: "Most Popular" },
  { value: "russian", label: "Russian", group: "Most Popular" },

  // European
  { value: "ukrainian", label: "Ukrainian", group: "European" },
  { value: "polish", label: "Polish", group: "European" },
  { value: "italian", label: "Italian", group: "European" },
  { value: "dutch", label: "Dutch", group: "European" },
  { value: "swedish", label: "Swedish", group: "European" },
  { value: "norwegian", label: "Norwegian", group: "European" },
  { value: "danish", label: "Danish", group: "European" },
  { value: "finnish", label: "Finnish", group: "European" },
  { value: "czech", label: "Czech", group: "European" },
  { value: "slovak", label: "Slovak", group: "European" },
  { value: "hungarian", label: "Hungarian", group: "European" },
  { value: "romanian", label: "Romanian", group: "European" },
  { value: "greek", label: "Greek", group: "European" },
  { value: "turkish", label: "Turkish", group: "European" },

  // Asian
  { value: "japanese", label: "Japanese", group: "Asian" },
  { value: "korean", label: "Korean", group: "Asian" },
  { value: "hindi", label: "Hindi", group: "Asian" },
  { value: "chinese-cantonese", label: "Chinese (Cantonese)", group: "Asian" },
  { value: "vietnamese", label: "Vietnamese", group: "Asian" },
  { value: "thai", label: "Thai", group: "Asian" },
  { value: "indonesian", label: "Indonesian", group: "Asian" },
  { value: "bengali", label: "Bengali", group: "Asian" },
  { value: "urdu", label: "Urdu", group: "Asian" },
  { value: "persian", label: "Persian (Farsi)", group: "Asian" },

  // Middle Eastern & African
  { value: "hebrew", label: "Hebrew", group: "Middle Eastern & African" },
  { value: "swahili", label: "Swahili", group: "Middle Eastern & African" },
];

export const TEACHING_LANGUAGE_GROUPS = [
  ...new Set(TEACHING_LANGUAGES.map((l) => l.group)),
];
