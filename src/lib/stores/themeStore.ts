import { get, writable } from "svelte/store";

// Valid theme values
export type TTheme = "1" | "2" | "3" | "4" | "5" | "6";

// Theme order for cycling
const themeOrder: TTheme[] = ["1", "2", "3", "4", "5", "6"];

// localStorage key for theme
const THEME_STORAGE_KEY = "selected-theme";

const createThemeStore = () => {
  // Initialize with default theme '1'
  const { subscribe, set } = writable<TTheme>("1");

  // If we're in the browser, initialize with stored/current theme
  if (typeof window !== "undefined") {
    // Try localStorage first, then data-theme attribute, then default to '1'
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as TTheme;
    const dataTheme = document.documentElement.dataset.theme as TTheme;
    const initialTheme = storedTheme || dataTheme || "1";

    // Validate theme value
    const validTheme = themeOrder.includes(initialTheme) ? initialTheme : "1";
    set(validTheme);
  }

  return {
    subscribe,
    set: (newTheme: TTheme) => {
      // Update the store
      set(newTheme);

      // If in browser, sync with HTML and localStorage
      if (typeof window !== "undefined") {
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      }
    },
  };
};

export const themeStore = createThemeStore();

// Convenience method to change theme
export const changeTheme = (newTheme: TTheme) => themeStore.set(newTheme);

// Toggle through themes in order
export const toggleTheme = () => {
  const currentTheme = get(themeStore);

  const currentIndex = themeOrder.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themeOrder.length;

  themeStore.set(themeOrder[nextIndex]);
};
