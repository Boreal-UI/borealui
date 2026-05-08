/**
 * -----------------------------------------------------
 * Color Scheme Registry
 * -----------------------------------------------------
 * Provides utility functions for managing theme color schemes
 * used throughout the application.
 *
 * Includes:
 * - registerColorScheme: adds custom color schemes at runtime.
 * - getAllColorSchemes: retrieves all registered schemes.
 */

"use client";

import { ColorScheme } from "@/types/types";
import { defaultColorSchemes } from "./Themes";

const colorSchemes: ColorScheme[] = [...defaultColorSchemes];

/**
 * Registers custom color schemes.
 *
 * If a scheme with the same name exists, it will be skipped unless `override` is true.
 *
 * @param {ColorScheme[]} customSchemes - An array of color schemes to register.
 * @param {boolean} [override=false] - Whether to replace existing schemes with the same name.
 *
 * @example
 * registerColorScheme([ { name: "ocean", ... } ], true);
 */
export const registerColorScheme = (
  customSchemes: ColorScheme[],
  override: boolean = false,
) => {
  for (const scheme of customSchemes) {
    const index = colorSchemes.findIndex((s) => s.name === scheme.name);
    if (index === -1) {
      colorSchemes.push(scheme);
    } else if (override) {
      colorSchemes[index] = scheme;
    } else if (process.env.NODE_ENV === "development") {
      console.warn(`Color scheme "${scheme.name}" already exists. Skipping.`);
    }
  }
};

/**
 * Removes a color scheme by its name.
 *
 * @param {string} name - The name of the color scheme to remove.
 * @returns {boolean} True if a scheme was removed, false if it was not found.
 *
 * @example
 * removeColorScheme("darkMode"); // returns true if it existed
 */
export function removeColorScheme(name: string): boolean {
  const index = colorSchemes.findIndex((s) => s.name === name);
  if (index !== -1) {
    colorSchemes.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Returns a copy of all registered color schemes.
 *
 * @returns {ColorScheme[]} An array of all registered color schemes.
 *
 * @example
 * const themes = getAllColorSchemes();
 * console.log(themes.map((t) => t.name));
 */
export function getAllColorSchemes(): ColorScheme[] {
  return [...colorSchemes];
}
