import {writable, get} from 'svelte/store';

// Valid theme values
    export type Theme = '1' | '2' | '3';

// Theme order for cycling
const themeOrder: Theme[] = ['1', '2', '3'];

// localStorage key for theme
const THEME_STORAGE_KEY = 'selected-theme';

function createThemeStore() {
  // Initialize with default theme '1'
  const {subscribe, set} = writable<Theme>('1');

  // If we're in the browser, initialize with stored/current theme
  if (typeof window !== 'undefined') {
    // Try localStorage first, then data-theme attribute, then default to '1'
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    const dataTheme = document.documentElement.dataset.theme as Theme;
    const initialTheme = storedTheme || dataTheme || '1';

    // Validate theme value
    const validTheme = themeOrder.includes(initialTheme) ? initialTheme : '1';
    set(validTheme);
  }

  return {
    subscribe,
    set: (newTheme: Theme) => {
      // Update the store
      set(newTheme);

      // If in browser, sync with HTML and localStorage
      if (typeof window !== 'undefined') {
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      }
    }
  };
}

export const theme = createThemeStore();

// Convenience method to change theme
export const changeTheme = (newTheme: Theme) => theme.set(newTheme);

// Toggle through themes in order
export const toggleTheme = () => {
  const currentTheme = get(theme);

  const currentIndex = themeOrder.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themeOrder.length;

  theme.set(themeOrder[nextIndex]);
};
