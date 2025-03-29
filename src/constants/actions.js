// Message Actions
export const MESSAGE_ACTIONS = {
  GET_TRANSLATION: 'GET_TRANSLATION',
  LOGIN: 'LOGIN',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  SETTINGS: 'settings',
};

// Default Settings
export const DEFAULT_SETTINGS = {
  translateTo: {
    value: "fr",
    label: " French",
    flag: "https://flagcdn.com/fr.svg",
  },
  translateFrom: {
    value: "en",
    label: " English",
    flag: "https://flagcdn.com/us.svg",
  },
  extensionOn: true,
  autoSend: false,
}; 