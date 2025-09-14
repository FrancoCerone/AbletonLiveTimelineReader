/**
 * Local storage utilities for file persistence
 */

const STORAGE_KEYS = {
  FILE_PATH: 'ableton_file_path',
  FILE_NAME: 'ableton_file_name',
  FILE_LAST_MODIFIED: 'ableton_file_last_modified',
  ZOOM_LEVEL: 'timeline_zoom_level',
  TIMELINE_VERTICAL_ZOOM: 'timeline_vertical_zoom',
  EFFORT_ZOOM_LEVEL: 'effort_zoom_level',
  EFFORT_HORIZONTAL_ZOOM: 'effort_horizontal_zoom'
};

/**
 * Save file information to localStorage
 * @param {string} filePath - Path to the file
 * @param {string} fileName - Name of the file
 * @param {number} lastModified - Last modified timestamp
 */
export const saveFileToStorage = (filePath, fileName, lastModified) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FILE_PATH, filePath);
    localStorage.setItem(STORAGE_KEYS.FILE_NAME, fileName);
    localStorage.setItem(STORAGE_KEYS.FILE_LAST_MODIFIED, lastModified.toString());
  } catch (error) {
    console.error('Error saving file to storage:', error);
  }
};

/**
 * Get saved file information from localStorage
 * @returns {Object|null} File information or null if not found
 */
export const getFileFromStorage = () => {
  try {
    const filePath = localStorage.getItem(STORAGE_KEYS.FILE_PATH);
    const fileName = localStorage.getItem(STORAGE_KEYS.FILE_NAME);
    const lastModified = localStorage.getItem(STORAGE_KEYS.FILE_LAST_MODIFIED);

    if (filePath && fileName && lastModified) {
      return {
        filePath,
        fileName,
        lastModified: parseInt(lastModified, 10)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting file from storage:', error);
    return null;
  }
};

/**
 * Clear saved file information from localStorage
 */
export const clearFileFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.FILE_PATH);
    localStorage.removeItem(STORAGE_KEYS.FILE_NAME);
    localStorage.removeItem(STORAGE_KEYS.FILE_LAST_MODIFIED);
  } catch (error) {
    console.error('Error clearing file from storage:', error);
  }
};

/**
 * Check if file still exists and hasn't been modified
 * @param {string} filePath - Path to check
 * @param {number} savedLastModified - Saved last modified timestamp
 * @returns {Promise<boolean>} True if file exists and hasn't changed
 */
export const isFileStillValid = async (filePath, savedLastModified) => {
  try {
    // Note: In a real browser environment, we can't directly access file system
    // This is a placeholder for the concept. In practice, we'd need to:
    // 1. Store the file content in IndexedDB
    // 2. Or use a different approach for file persistence
    
    // For now, we'll assume the file is valid if it exists in storage
    return true;
  } catch (error) {
    console.error('Error checking file validity:', error);
    return false;
  }
};

/**
 * Save zoom values to localStorage
 * @param {Object} zoomValues - Object containing all zoom values
 */
export const saveZoomValues = (zoomValues) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ZOOM_LEVEL, zoomValues.zoomLevel.toString());
    localStorage.setItem(STORAGE_KEYS.TIMELINE_VERTICAL_ZOOM, zoomValues.timelineVerticalZoom.toString());
    localStorage.setItem(STORAGE_KEYS.EFFORT_ZOOM_LEVEL, zoomValues.effortZoomLevel.toString());
    localStorage.setItem(STORAGE_KEYS.EFFORT_HORIZONTAL_ZOOM, zoomValues.effortHorizontalZoom.toString());
  } catch (error) {
    console.error('Error saving zoom values to storage:', error);
  }
};

/**
 * Get saved zoom values from localStorage
 * @returns {Object} Zoom values with defaults
 */
export const getZoomValues = () => {
  try {
    return {
      zoomLevel: parseFloat(localStorage.getItem(STORAGE_KEYS.ZOOM_LEVEL)) || 1,
      timelineVerticalZoom: parseFloat(localStorage.getItem(STORAGE_KEYS.TIMELINE_VERTICAL_ZOOM)) || 1,
      effortZoomLevel: parseFloat(localStorage.getItem(STORAGE_KEYS.EFFORT_ZOOM_LEVEL)) || 1,
      effortHorizontalZoom: parseFloat(localStorage.getItem(STORAGE_KEYS.EFFORT_HORIZONTAL_ZOOM)) || 1
    };
  } catch (error) {
    console.error('Error getting zoom values from storage:', error);
    return {
      zoomLevel: 1,
      timelineVerticalZoom: 1,
      effortZoomLevel: 1,
      effortHorizontalZoom: 1
    };
  }
};

/**
 * Clear saved zoom values from localStorage
 */
export const clearZoomValues = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ZOOM_LEVEL);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE_VERTICAL_ZOOM);
    localStorage.removeItem(STORAGE_KEYS.EFFORT_ZOOM_LEVEL);
    localStorage.removeItem(STORAGE_KEYS.EFFORT_HORIZONTAL_ZOOM);
  } catch (error) {
    console.error('Error clearing zoom values from storage:', error);
  }
};
