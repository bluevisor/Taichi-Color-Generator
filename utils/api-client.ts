/**
 * API Client for Taichi Color Generator
 * 
 * This file provides helper functions to interact with the API endpoints.
 * Use these functions in your React components to generate and export themes.
 */

// Configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-domain.vercel.app/api' 
  : '/api';

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeMetadata {
  style: string;
  timestamp: number;
  philosophy: string;
}

export interface GenerateThemeResponse {
  success: boolean;
  theme?: Theme;
  metadata?: ThemeMetadata;
  error?: string;
  code?: string;
  retryAfter?: number;
}

export interface ExportThemeResponse {
  success: boolean;
  format?: string;
  content?: string;
  filename?: string;
  error?: string;
  code?: string;
  retryAfter?: number;
}

export type ThemeStyle = 'yin-yang' | 'five-elements' | 'bagua' | 'random';
export type ExportFormat = 'css' | 'scss' | 'less' | 'tailwind' | 'json';

/**
 * Generate a new theme using the API
 * 
 * @param style - Theme generation style
 * @param baseColor - Optional base color in hex format
 * @param lockedColors - Optional array of color tokens to preserve
 * @returns Promise with theme data or error
 */
export async function generateTheme(
  style: ThemeStyle = 'random',
  baseColor?: string,
  lockedColors?: string[]
): Promise<GenerateThemeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        style,
        baseColor,
        lockedColors
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to generate theme',
        code: data.code,
        retryAfter: data.retryAfter
      };
    }

    return data;
  } catch (error) {
    console.error('Error generating theme:', error);
    return {
      success: false,
      error: 'Network error while generating theme',
      code: 'NETWORK_ERROR'
    };
  }
}

/**
 * Export a theme in the specified format
 * 
 * @param theme - Theme object to export
 * @param format - Export format (css, scss, less, tailwind, json)
 * @param options - Optional export options
 * @returns Promise with exported content or error
 */
export async function exportTheme(
  theme: Theme,
  format: ExportFormat = 'css',
  options?: {
    prefix?: string;
    includeComments?: boolean;
  }
): Promise<ExportThemeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/export-theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        theme,
        format,
        options
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to export theme',
        code: data.code,
        retryAfter: data.retryAfter
      };
    }

    return data;
  } catch (error) {
    console.error('Error exporting theme:', error);
    return {
      success: false,
      error: 'Network error while exporting theme',
      code: 'NETWORK_ERROR'
    };
  }
}

/**
 * Download exported theme as a file
 * 
 * @param content - File content
 * @param filename - Filename for download
 * @param mimeType - MIME type for the file
 */
export function downloadThemeFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Handle rate limit errors with user-friendly messages
 * 
 * @param retryAfter - Seconds until rate limit resets
 * @returns User-friendly error message
 */
export function getRateLimitMessage(retryAfter?: number): string {
  if (!retryAfter) {
    return 'Rate limit exceeded. Please try again later.';
  }

  if (retryAfter < 60) {
    return `Rate limit exceeded. Please try again in ${retryAfter} seconds.`;
  }

  const minutes = Math.ceil(retryAfter / 60);
  return `Rate limit exceeded. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
}

/**
 * Example usage in a React component:
 * 
 * ```tsx
 * import { generateTheme, exportTheme, downloadThemeFile } from './utils/api-client';
 * 
 * function ThemeGenerator() {
 *   const handleGenerate = async () => {
 *     const result = await generateTheme('yin-yang', '#3B82F6');
 *     
 *     if (result.success && result.theme) {
 *       console.log('Generated theme:', result.theme);
 *       console.log('Philosophy:', result.metadata?.philosophy);
 *     } else {
 *       console.error('Error:', result.error);
 *     }
 *   };
 * 
 *   const handleExport = async (theme: Theme) => {
 *     const result = await exportTheme(theme, 'css', {
 *       prefix: 'my-app',
 *       includeComments: true
 *     });
 *     
 *     if (result.success && result.content && result.filename) {
 *       downloadThemeFile(result.content, result.filename, 'text/css');
 *     } else {
 *       console.error('Error:', result.error);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleGenerate}>Generate Theme</button>
 *     </div>
 *   );
 * }
 * ```
 */
