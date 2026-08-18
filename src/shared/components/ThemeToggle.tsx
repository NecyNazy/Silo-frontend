import { Moon, Sun, SunMoon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(NEXT_THEME[theme])}
      title={`${THEME_LABEL[theme]}. Click to switch to ${THEME_LABEL[NEXT_THEME[theme]].toLowerCase()}`}
      aria-label={`Current theme: ${THEME_LABEL[theme]}. Click to change.`}
      className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-control text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="inline-flex"
        >
          <Icon className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
