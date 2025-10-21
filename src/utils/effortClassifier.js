/**
 * Classify color into effort zones
 * @param {Object} color - Color object with r, g, b properties
 * @returns {Object} - Effort data with effort percentage, zone name, and zone color
 */
export const classifyEffort = (color) => {
  const { r, g, b } = color;
  
  // Black zone: very dark colors
  if (r < 50 && g < 50 && b < 50 || r === 64 && g === 64 && b === 64) {
    return { effort: 92, zone: 'Nero', zoneColor: '#000000' };
  }
  
  // Green zone: G is dominant
  if (g > r && g > b) {
    return { effort: 20, zone: 'Verde', zoneColor: '#00ff00' };
  }
  
  // Yellow zone: R and G are both high
  if (r > g && g > b && r > 150 && g > 150) {
    return { effort: 55, zone: 'Giallo', zoneColor: '#ffff00' };
  }
  
  // Red zone: R is dominant
  if (r > g && r > b) {
    return { effort: 80, zone: 'Rosso', zoneColor: '#ff0000' };
  }
  
  // Default fallback
  return { effort: 50, zone: 'Medio', zoneColor: '#808080' };
};

/**
 * Get height multiplier based on effort level
 * @param {number} effort - Effort percentage (0-100)
 * @returns {number} - Height multiplier (1.0 = normal, higher = taller)
 */
export const getEffortHeightMultiplier = (effort) => {
  if (effort >= 90) return 2.5; // Black zone: 2.5x height
  if (effort >= 70) return 2.0; // Red zone: 2x height
  if (effort >= 50) return 1.5; // Yellow zone: 1.5x height
  return 1.0; // Green zone: normal height
};

