import React, { useState } from 'react';
import pako from 'pako';
import { saveFileToStorage } from '../utils/storage';
import { storeFileContent } from '../utils/fileLoader';

const FileUploader = ({ onFileProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    // Check if file has .als extension
    if (!file.name.toLowerCase().endsWith('.als')) {
      setError('Please select a valid .als file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await readFileAsArrayBuffer(file);
      
      // Decompress the gzipped content
      const decompressedData = pako.inflate(arrayBuffer);
      
      // Convert to string
      const xmlString = new TextDecoder('utf-8').decode(decompressedData);
      
      
      // Save file information to storage for auto-reload
      saveFileToStorage(file.name, file.name, file.lastModified);
      storeFileContent(xmlString, file.name, file.lastModified);
      
      // Pass the XML to parent component
      onFileProcessed(xmlString, file.name);
      
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Error processing file. Please make sure it\'s a valid .als file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="file-uploader">
      <div className="upload-area">
        <input
          type="file"
          id="file-input"
          accept=".als"
          onChange={handleFileChange}
          disabled={isProcessing}
          className="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          {isProcessing ? 'Processing...' : 'Choose .als file'}
        </label>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="file-info">
        <p>Select an Ableton Live file (.als) to analyze its XML content</p>
      </div>
    </div>
  );
};

export default FileUploader;
