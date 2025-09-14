/**
 * File loading utilities for automatic file reloading
 */

/**
 * Load file from File API using a file path (for automatic reloading)
 * Note: This is a simplified approach. In a real application, you might need
 * to store the file content in IndexedDB or use a different persistence strategy.
 */
export const loadFileFromPath = async (filePath) => {
  try {
    // Since we can't directly access files by path in the browser,
    // we'll need to store the file content when it's first loaded
    // and retrieve it from storage
    
    const storedFileData = localStorage.getItem('ableton_file_content');
    if (storedFileData) {
      const fileData = JSON.parse(storedFileData);
      return {
        content: fileData.content,
        name: fileData.name,
        lastModified: fileData.lastModified
      };
    }
    
    throw new Error('No stored file content found');
  } catch (error) {
    console.error('Error loading file from path:', error);
    throw error;
  }
};

/**
 * Store file content for later retrieval
 * @param {string} content - File content as string
 * @param {string} fileName - Name of the file
 * @param {number} lastModified - Last modified timestamp
 */
export const storeFileContent = (content, fileName, lastModified) => {
  try {
    const fileData = {
      content,
      name: fileName,
      lastModified
    };
    localStorage.setItem('ableton_file_content', JSON.stringify(fileData));
  } catch (error) {
    console.error('Error storing file content:', error);
  }
};

/**
 * Clear stored file content
 */
export const clearStoredFileContent = () => {
  try {
    localStorage.removeItem('ableton_file_content');
  } catch (error) {
    console.error('Error clearing stored file content:', error);
  }
};
