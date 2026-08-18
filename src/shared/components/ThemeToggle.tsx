import { Moon, Sun, SunMoon } from 'lucide-react';
import { useThemeStore, type Theme } from '@/app/providers/theme';

const NEXT_THEME: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const THEME_ICON: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: SunMoon,
};

const THEME_LABEL: Record<Theme, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
};

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const Icon = THEME_ICON[theme];

  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT_THEME[theme])}
      title={`${THEME_LABEL[theme]}. Click to switch to ${THEME_LABEL[NEXT_THEME[theme]].toLowerCase()}`}
      aria-label={`Current theme: ${THEME_LABEL[theme]}. Click to change.`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
