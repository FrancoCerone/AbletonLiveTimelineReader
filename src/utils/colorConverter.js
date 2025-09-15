/**
 * Color conversion utilities for Ableton Live files
 */



const abletonLive11Palette = [
  "#ff95a7", "#ffa62b","#cc9a29","#fdf901",
  "1cff31","#1cff31","#27ffa9","#5dffe8",
  "#8cc5ff","#5581e4","#93a8ff","#e554a1",
  "#e554a1","#ffffff",

  "#fd0101","#fd5301","#7f3f01","#fdf901",
  "#6dfd01","#01fd01","#01fd7f","#01fdd9",
  "#017ffd","#0153fd","#4b01fd","#e554a1",
  "#fd017f","#d9d9d9",

  "#fd7f7f","#fdc601","#b9a601","#e4fd01",
  "#c0fb02","#1cff31","#27ffa9","#d4fde1",
  "#8cc5ff","#5581e4","#e554a1","#e554a1",
  "#e5dce1","#aaaaaa",

  "#d99696","#d9a601","#a67f01","#c8fd01",
  "#7ffd01","#7eb14e","#89c2bb","#01afd9",
  "#86a6c2","#8494cc","#a696b6","#c0a0bf",
  "#bd7297","#7c7c7c",

  "#a63f01","#a65f01","#7f5f01","#dbc302",
  "#5fa601","#01a601","#01967f","#0196a6",
  "#014ba6","#013fa6","#5f01a6","#9601a6",
  "#a6015f","#404040"
];

/**
 * Converte un indice Ableton Live 11 (0–69) in RGB e HEX.
 * Se passi un numero > 69, ritorna null.
 * @param {number} idx — indice colore Ableton (0..69)
 * @returns {{r: number, g: number, b: number, hex: string} | null}
 */
export function abletonLive11ColorToRGB(idx) {
  if (typeof idx !== "number" || idx < 0 || idx >= abletonLive11Palette.length) {
    return null;
  }
  const hex = abletonLive11Palette[idx];
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);

  return { r, g, b, hex };
}

/**
 * Convert RGB object to CSS color string
 * @param {Object} rgb - RGB object with r, g, b properties
 * @returns {string} CSS color string (e.g., "rgb(255, 0, 0)")
 */
export function rgbToCSS(rgb) {
  if (!rgb || typeof rgb.r === 'undefined') {
    return '#808080'; // Fallback to gray
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Convert Ableton Live 11 color index directly to CSS color string
 * @param {number} colorIndex - The color index from .als file (0-69)
 * @returns {string} CSS color string
 */
export function abletonColorToCSS(colorIndex) {
  const colorData = abletonLive11ColorToRGB(colorIndex);
  if (!colorData) {
    return '#808080'; // Fallback to gray
  }
  return colorData.hex; // Return hex directly for better performance
}

/**
 * Get a lighter version of a color for hover effects
 * @param {Object} rgb - RGB object with r, g, b properties
 * @param {number} factor - Lightness factor (0-1, where 1 is no change)
 * @returns {string} CSS color string
 */
export function lightenColor(rgb, factor = 0.8) {
  if (!rgb || typeof rgb.r === 'undefined') {
    return '#808080';
  }
  
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * (1 - factor)));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * (1 - factor)));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * (1 - factor)));
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Get the full Ableton Live 11 palette
 * @returns {Array} Array of hex color strings
 */
export function getAbletonPalette() {
  return [...abletonLive11Palette];
}

/**
 * Get color name/index info for debugging
 * @param {number} colorIndex - The color index
 * @returns {Object} Color information object
 */
export function getColorInfo(colorIndex) {
  const colorData = abletonLive11ColorToRGB(colorIndex);
  if (!colorData) {
    return {
      index: colorIndex,
      valid: false,
      message: 'Invalid color index (must be 0-69)'
    };
  }
  
  return {
    index: colorIndex,
    valid: true,
    hex: colorData.hex,
    rgb: colorData,
    css: colorData.hex
  };
}
