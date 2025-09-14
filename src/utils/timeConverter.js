/**
 * Convert SMPTE time to timeline position
 * @param {Object} smpteTime - SMPTE time object with hours, minutes, seconds, frames
 * @param {Object} timeRange - Timeline time range {min, max}
 * @param {number} timelineWidth - Width of timeline in pixels
 * @returns {number} X position in pixels
 */
export const smpteToTimelinePosition = (smpteTime, timeRange, timelineWidth, currentBeats = null) => {
  if (!smpteTime || !timeRange) {
    return 0;
  }
  
  // Use beats if available, otherwise fall back to seconds
  let currentPosition;
  if (currentBeats !== null) {
    currentPosition = currentBeats;
  } else {
    // Fallback to seconds calculation
    const hoursToSeconds = smpteTime.hours * 3600;
    const minutesToSeconds = smpteTime.minutes * 60;
    currentPosition = hoursToSeconds + minutesToSeconds + smpteTime.seconds;
  }
  
  // Convert to timeline position
  const timeSpan = timeRange.max - timeRange.min;
  const normalizedTime = (currentPosition - timeRange.min) / timeSpan;
  
  // Clamp between 0 and 1
  const clampedTime = Math.max(0, Math.min(1, normalizedTime));
  const finalPosition = clampedTime * timelineWidth;
  
  
  return Math.round(finalPosition);
};

/**
 * Convert time string (HH:MM:SS.FFF) to seconds
 * @param {string} timeString - Time string in format "HH:MM:SS.FFF"
 * @returns {number} Time in seconds
 */
export const timeStringToSeconds = (timeString) => {
  if (!timeString) return 0;
  
  const parts = timeString.split(':');
  if (parts.length !== 3) return 0;
  
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const secondsParts = parts[2].split('.');
  const seconds = parseInt(secondsParts[0], 10) || 0;
  const frames = parseInt(secondsParts[1], 10) || 0;
  
  return (hours * 3600) + (minutes * 60) + seconds + (frames / 30);
};

/**
 * Format seconds to time string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const secondsToTimeString = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 30);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${frames.toString().padStart(3, '0')}`;
};

/**
 * Get current time in seconds from SMPTE object
 * @param {Object} smpteTime - SMPTE time object
 * @returns {number} Time in seconds
 */
export const getCurrentTimeInSeconds = (smpteTime) => {
  if (!smpteTime) {
    return 0;
  }
  
  return (smpteTime.hours * 3600) + 
         (smpteTime.minutes * 60) + 
         smpteTime.seconds;
};
