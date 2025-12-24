
export interface ColorToken {
  hex: string;
  name: string; // e.g., "Primary", "Background"
}

export interface ThemeTokens {
  bg: string;
  card: string;
  card2: string;
  text: string;
  textMuted: string;
  textOnColor: string;  // Text color for use on colored backgrounds (primary, secondary, etc.)
  primary: string;
  primaryFg: string;
  secondary: string;
  secondaryFg: string;
  accent: string;
  accentFg: string;
  border: string;
  ring: string;
  good: string;
  goodFg: string;
  warn: string;
  warnFg: string;
  bad: string;
  badFg: string;
}

export interface DualTheme {
  id: string;
  timestamp: number;
  light: ThemeTokens;
  dark: ThemeTokens;
  seed: string; // The base hue or hex used to generate
  mode: GenerationMode;
}

export type GenerationMode = 'random' | 'monochrome' | 'analogous' | 'complementary' | 'split-complementary' | 'triadic' | 'image';

export type ColorFormat = 'hex' | 'rgb' | 'cmyk' | 'hsl' | 'lab' | 'lch' | 'oklch' | 'display-p3';

export interface DesignOptions {
  borderWidth: number;   // 0 - 3
  shadowStrength: number; // 0 - 4
  gradientLevel: number; // 0 - 2
  radius: number;        // 0 - 5
  brightnessLevel: number; // 1 - 5, compresses colors toward bright(5) or dark(1), 3 is normal
  contrastLevel: number; // 1 - 5
  saturationLevel: number; // 0 - 4
}

export type LockedColors = Partial<Record<keyof ThemeTokens, boolean>>;
