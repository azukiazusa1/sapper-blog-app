// Theme system for Recap 2025

export type ThemeId = "orange" | "blue" | "purple" | "green" | "pink";

export interface ThemeColors {
  // Chat interface colors
  chatBackground: string; // Background gradient for chat interface
  inputFocusBorder: string; // Input field focus border color
  inputFocusRing: string; // Input field focus ring color
  buttonGradient: string; // Submit button gradient
  buttonHoverShadow: string; // Button hover shadow color

  // Code editor colors
  editorBuildTab: string; // Build tab gradient
  editorBuildTabHover: string; // Build tab hover gradient
  editorSpinner: string; // Loading spinner colors

  // Final recap section colors
  cardHoverBorder: string; // Card hover border color
  accentColor: string; // Primary accent background
  hoverAccentColor: string; // Hover accent background
  textAccentColor: string; // Text accent color
  hoverTextAccentColor: string; // Hover text accent color

  // Additional utility colors
  focusRing: string; // Focus ring color for accessibility
}

export interface Theme {
  id: ThemeId;
  name: string; // Japanese display name
  description: string; // Optional description
  colors: ThemeColors;
}

export const themes: Record<ThemeId, Theme> = {
  orange: {
    id: "orange",
    name: "オレンジ系",
    description: "暖かく活気のあるテーマ",
    colors: {
      // Chat interface
      chatBackground: "bg-gradient-to-b from-orange-900 to-red-900",
      inputFocusBorder: "border-orange-600",
      inputFocusRing: "ring-orange-600/10",
      buttonGradient: "bg-gradient-to-r from-orange-600 to-red-500",
      buttonHoverShadow: "shadow-orange-600/30",

      // Code editor
      editorBuildTab: "from-orange-600 to-red-500",
      editorBuildTabHover: "from-orange-700 to-red-600",
      editorSpinner: "border-orange-200 border-t-orange-600",

      // Final recap
      cardHoverBorder: "hover:border-orange-300",
      accentColor: "bg-orange-600",
      hoverAccentColor: "hover:bg-orange-700",
      textAccentColor: "text-orange-600",
      hoverTextAccentColor: "hover:text-orange-800",

      // Utility
      focusRing: "focus:ring-orange-300",
    },
  },

  blue: {
    id: "blue",
    name: "ブルー系",
    description: "落ち着きと清涼感のあるテーマ",
    colors: {
      // Chat interface
      chatBackground: "bg-gradient-to-b from-blue-900 to-cyan-900",
      inputFocusBorder: "border-blue-600",
      inputFocusRing: "ring-blue-600/10",
      buttonGradient: "bg-gradient-to-r from-blue-600 to-cyan-500",
      buttonHoverShadow: "shadow-blue-600/30",

      // Code editor
      editorBuildTab: "from-blue-600 to-cyan-500",
      editorBuildTabHover: "from-blue-700 to-cyan-600",
      editorSpinner: "border-blue-200 border-t-blue-600",

      // Final recap
      cardHoverBorder: "hover:border-blue-300",
      accentColor: "bg-blue-600",
      hoverAccentColor: "hover:bg-blue-700",
      textAccentColor: "text-blue-600",
      hoverTextAccentColor: "hover:text-blue-800",

      // Utility
      focusRing: "focus:ring-blue-300",
    },
  },

  purple: {
    id: "purple",
    name: "パープル系",
    description: "神秘的で優雅なテーマ",
    colors: {
      // Chat interface
      chatBackground: "bg-gradient-to-b from-purple-900 to-pink-900",
      inputFocusBorder: "border-purple-600",
      inputFocusRing: "ring-purple-600/10",
      buttonGradient: "bg-gradient-to-r from-purple-600 to-pink-500",
      buttonHoverShadow: "shadow-purple-600/30",

      // Code editor
      editorBuildTab: "from-purple-600 to-pink-500",
      editorBuildTabHover: "from-purple-700 to-pink-600",
      editorSpinner: "border-purple-200 border-t-purple-600",

      // Final recap
      cardHoverBorder: "hover:border-purple-300",
      accentColor: "bg-purple-600",
      hoverAccentColor: "hover:bg-purple-700",
      textAccentColor: "text-purple-600",
      hoverTextAccentColor: "hover:text-purple-800",

      // Utility
      focusRing: "focus:ring-purple-300",
    },
  },

  green: {
    id: "green",
    name: "グリーン系",
    description: "自然で落ち着いたテーマ",
    colors: {
      // Chat interface
      chatBackground: "bg-gradient-to-b from-green-900 to-emerald-900",
      inputFocusBorder: "border-green-600",
      inputFocusRing: "ring-green-600/10",
      buttonGradient: "bg-gradient-to-r from-green-600 to-emerald-500",
      buttonHoverShadow: "shadow-green-600/30",

      // Code editor
      editorBuildTab: "from-green-600 to-emerald-500",
      editorBuildTabHover: "from-green-700 to-emerald-600",
      editorSpinner: "border-green-200 border-t-green-600",

      // Final recap
      cardHoverBorder: "hover:border-green-300",
      accentColor: "bg-green-600",
      hoverAccentColor: "hover:bg-green-700",
      textAccentColor: "text-green-600",
      hoverTextAccentColor: "hover:text-green-800",

      // Utility
      focusRing: "focus:ring-green-300",
    },
  },

  pink: {
    id: "pink",
    name: "ピンク系",
    description: "ビビットで楽しいテーマ",
    colors: {
      // Chat interface
      chatBackground: "bg-gradient-to-b from-pink-900 to-rose-900",
      inputFocusBorder: "border-pink-600",
      inputFocusRing: "ring-pink-600/10",
      buttonGradient: "bg-gradient-to-r from-pink-600 to-rose-500",
      buttonHoverShadow: "shadow-pink-600/30",

      // Code editor
      editorBuildTab: "from-pink-600 to-rose-500",
      editorBuildTabHover: "from-pink-700 to-rose-600",
      editorSpinner: "border-pink-200 border-t-pink-600",

      // Final recap
      cardHoverBorder: "hover:border-pink-300",
      accentColor: "bg-pink-600",
      hoverAccentColor: "hover:bg-pink-700",
      textAccentColor: "text-pink-600",
      hoverTextAccentColor: "hover:text-pink-800",

      // Utility
      focusRing: "focus:ring-pink-300",
    },
  },
};

export const defaultTheme: ThemeId = "orange";

// Helper function to get theme by ID
export function getTheme(themeId: ThemeId): Theme {
  return themes[themeId];
}
