/**
 * ---------------------------------------------------------------------
 * Themes.ts
 * ---------------------------------------------------------------------
 * A curated list of predefined color schemes used for theming
 * in the Boreal UI system. Each scheme follows the `ColorScheme`
 * interface and defines a unique aesthetic by setting:
 *
 * - primaryColor: Main accent color for buttons, links, highlights
 * - secondaryColor: Complementary accent
 * - tertiaryColor: Alternative accent
 * - quaternaryColor: Another alternative accent
 * - backgroundColor: Default background for surfaces
 *
 * These schemes are typically used in theme switchers,
 * brand customization, or design system previews.
 *
 *
 * Example usage:
 *   const currentTheme = defaultColorSchemes.find(t => t.name === "Ocean Breeze");
 */

import { ColorScheme } from "@/types/types";

export const defaultColorSchemes: readonly ColorScheme[] = [
  {
    name: "Autumn Glow",
    primaryColor: "#c58686",
    secondaryColor: "#CC8430",
    tertiaryColor: "#b19476",
    quaternaryColor: "#b9a27b",
    backgroundColor: "#F5F5F5",
  },
  {
    name: "Autumn Leaves",
    primaryColor: "#d2691e",
    secondaryColor: "#c56c2c",
    tertiaryColor: "#b65f37",
    quaternaryColor: "#e9a569",
    backgroundColor: "#f5f5dc",
  },
  {
    name: "Berry Burst",
    primaryColor: "#b57077",
    secondaryColor: "#9183a3",
    tertiaryColor: "#a58c95",
    quaternaryColor: "#bb959b",
    backgroundColor: "#EDEDED",
  },
  {
    name: "Berry Patch",
    primaryColor: "#d31212",
    secondaryColor: "#be4343",
    tertiaryColor: "#c04833",
    quaternaryColor: "#aa6006",
    backgroundColor: "#4d3e3e",
  },
  {
    name: "Citrus Zest",
    primaryColor: "#ffa500",
    secondaryColor: "#ff4500",
    tertiaryColor: "#ff6347",
    quaternaryColor: "#ffa07a",
    backgroundColor: "#ffffff",
  },
  {
    name: "Coral Reef",
    primaryColor: "#ff6f61",
    secondaryColor: "#b8774c",
    tertiaryColor: "#d4a25d",
    quaternaryColor: "#aa8181",
    backgroundColor: "#f0f0f0",
  },
  {
    name: "Cyberpunk Pulse",
    primaryColor: "#792348ff",
    secondaryColor: "#8338ec",
    tertiaryColor: "#4f1bca",
    quaternaryColor: "#b33d06",
    backgroundColor: "#000000ff",
  },
  {
    name: "Eclipse Night",
    primaryColor: "#6e728a",
    secondaryColor: "#636374",
    tertiaryColor: "#575963",
    quaternaryColor: "#6957a3",
    backgroundColor: "#2b2b2b",
  },
  {
    name: "Electric Violet",
    primaryColor: "#9c3ef5",
    secondaryColor: "#983fbe",
    tertiaryColor: "#794e97",
    quaternaryColor: "#bb30bb",
    backgroundColor: "#464355",
  },
  {
    name: "Forest Dusk",
    primaryColor: "#286d52",
    secondaryColor: "#725431",
    tertiaryColor: "#2c7160",
    quaternaryColor: "#5f5037",
    backgroundColor: "#222e2e",
  },
  {
    name: "Golden Hour",
    primaryColor: "#B58800",
    secondaryColor: "#9574cc",
    tertiaryColor: "#B5A163",
    quaternaryColor: "#a38cd1",
    backgroundColor: "#dbdbd9",
  },
  {
    name: "Lavender Mist",
    primaryColor: "#b4b4c7",
    secondaryColor: "#af87ff",
    tertiaryColor: "#a491c9",
    quaternaryColor: "#bba1bb",
    backgroundColor: "#f5f5f5",
  },
  {
    name: "Lime Plum",
    primaryColor: "#50801a",
    secondaryColor: "#735992",
    tertiaryColor: "#6d7c28",
    quaternaryColor: "#5a4e7e",
    backgroundColor: "#382650",
  },
  {
    name: "Midnight Bloom",
    primaryColor: "#6b16c0",
    secondaryColor: "#be4984",
    tertiaryColor: "#8b008b",
    quaternaryColor: "#c21d75",
    backgroundColor: "#1c1c1c",
  },
  {
    name: "Mint Chocolate",
    primaryColor: "#215542",
    secondaryColor: "#1e683e",
    tertiaryColor: "#2f725c",
    quaternaryColor: "#426a7a",
    backgroundColor: "#221504",
  },
  {
    name: "Minty Fresh",
    primaryColor: "#53b953",
    secondaryColor: "#3eb489",
    tertiaryColor: "#5aa88e",
    quaternaryColor: "#8ba7a5",
    backgroundColor: "#c6dfdb",
  },
  {
    name: "Ocean Breeze",
    primaryColor: "#02a899",
    secondaryColor: "#de6559",
    tertiaryColor: "#729E9A",
    quaternaryColor: "#ffa17f",
    backgroundColor: "#d9dbd9",
  },
  {
    name: "Ocean Depths",
    primaryColor: "#0077be",
    secondaryColor: "#177081",
    tertiaryColor: "#07696b",
    quaternaryColor: "#547a6e",
    backgroundColor: "#2e3133",
  },
  {
    name: "Rose Midnight",
    primaryColor: "#ad0747",
    secondaryColor: "#0a5a94",
    tertiaryColor: "#C7004B",
    quaternaryColor: "#347192",
    backgroundColor: "#0B1220",
  },
  {
    name: "Rose Quartz",
    primaryColor: "#d98768",
    secondaryColor: "#a37981",
    tertiaryColor: "#9e7f7f",
    quaternaryColor: "#f1b8a0",
    backgroundColor: "#f7f4f2",
  },
  {
    name: "Sapphire Storm",
    primaryColor: "#0f52ba",
    secondaryColor: "#526d91",
    tertiaryColor: "#4a6fa5",
    quaternaryColor: "#657380",
    backgroundColor: "#000000",
  },
  {
    name: "Sunrise Glow",
    primaryColor: "#ff4500",
    secondaryColor: "#ff6347",
    tertiaryColor: "#ff7f50",
    quaternaryColor: "#d8b699",
    backgroundColor: "#ffffff",
  },
  {
    name: "Sunset",
    primaryColor: "#7f4ac4",
    secondaryColor: "#7d533b",
    tertiaryColor: "#905da8",
    quaternaryColor: "#ac4d0e",
    backgroundColor: "#2b2b2b",
  },
  {
    name: "Tropical Sunrise",
    primaryColor: "#DAA200",
    secondaryColor: "#d9a76c",
    tertiaryColor: "#AD8A59",
    quaternaryColor: "#e5cb9b",
    backgroundColor: "#fcfbf7",
  },
  {
    name: "Vintage Ember",
    primaryColor: "#D4AA7D",
    secondaryColor: "#9e8d8d",
    tertiaryColor: "#B78457",
    quaternaryColor: "#ffdcb0",
    backgroundColor: "#c2bfbf",
  },
  {
    name: "Contrast Test",
    primaryColor: "#7f4ac4",
    secondaryColor: "#7d533b",
    tertiaryColor: "#905da8",
    quaternaryColor: "#ac4d0e",
    backgroundColor: "#ffffff",
  },
];
