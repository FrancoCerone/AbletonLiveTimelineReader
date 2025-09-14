/**
 * Local storage utilities for file persistence
 */

const STORAGE_KEYS = {
  FILE_PATH: 'ableton_file_path',
  FILE_NAME: 'ableton_file_name',
  FILE_LAST_MODIFIED: 'ableton_file_last_modified'
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
