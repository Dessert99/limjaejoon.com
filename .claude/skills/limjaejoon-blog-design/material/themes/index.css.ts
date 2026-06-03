import { spring } from './spring.css';
import { summer } from './summer.css';
import { autumn } from './autumn.css';
import { winter } from './winter.css';
import { night } from './night.css';

/**
 * Season registry. Each value is the class string createTheme() generated for
 * that season; assign one to a root element to activate its palette:
 *   document.documentElement.className = seasonThemes['night'];
 *
 * Order matters for the segmented switcher UI (봄·여름·가을·겨울·밤).
 */
export const seasonThemes = { spring, summer, autumn, winter, night } as const;

export type Season = keyof typeof seasonThemes;

export const seasonMeta: Record<Season, { ko: string; en: string; scheme: 'light' | 'dark' }> = {
  spring: { ko: '봄', en: 'Spring', scheme: 'light' },
  summer: { ko: '여름', en: 'Summer', scheme: 'light' },
  autumn: { ko: '가을', en: 'Autumn', scheme: 'light' },
  winter: { ko: '겨울', en: 'Winter', scheme: 'light' },
  night: { ko: '밤', en: 'Night', scheme: 'dark' },
};

/** Pick a season from the current month — spring default, 밤 is manual only. */
export function seasonForMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}
