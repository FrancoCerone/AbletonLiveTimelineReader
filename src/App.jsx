import React, { useState, useEffect } from 'react';
import HamburgerMenu from './components/HamburgerMenu';
import Timeline from './components/Timeline';
import EffortAnalysis from './components/EffortAnalysis';
import { parseAbletonXML } from './utils/xmlParser';
import { mockClips, mockXML } from './utils/mockData';
import { getFileFromStorage, saveZoomValues, getZoomValues } from './utils/storage';
import { loadFileFromPath } from './utils/fileLoader';
import './App.css';

function App() {
  const [xmlContent, setXmlContent] = useState('');
  const [clips, setClips] = useState([]);
  const [showXmlPreview, setShowXmlPreview] = useState(false);
  const [parseError, setParseError] = useState('');
  const [loadedFileName, setLoadedFileName] = useState('');
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  // Load zoom values from localStorage or use defaults
  const savedZoomValues = getZoomValues();
  const [zoomLevel, setZoomLevel] = useState(savedZoomValues.zoomLevel);
  const [timelineVerticalZoom, setTimelineVerticalZoom] = useState(savedZoomValues.timelineVerticalZoom);
  const [effortZoomLevel, setEffortZoomLevel] = useState(savedZoomValues.effortZoomLevel);
  const [effortHorizontalZoom, setEffortHorizontalZoom] = useState(savedZoomValues.effortHorizontalZoom);

  const handleFileProcessed = (xml, fileName = '') => {
    setXmlContent(xml);
    setParseError('');
    if (fileName) {
      setLoadedFileName(fileName);
    }
    
    try {
      // Parse the XML and extract clips
      const parsedClips = parseAbletonXML(xml);
      setClips(parsedClips);
    } catch (error) {
      console.error('Error parsing XML:', error);
      setParseError(error.message);
      setClips([]);
    }
  };

  // Zoom functions
  const minZoom = 0.1;
  const maxZoom = 5;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, maxZoom));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, minZoom));
  };
  
  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  // Timeline vertical zoom functions
  const handleTimelineVerticalZoomIn = () => {
    setTimelineVerticalZoom(prev => Math.min(prev * 1.2, maxZoom));
  };
  
  const handleTimelineVerticalZoomOut = () => {
    setTimelineVerticalZoom(prev => Math.max(prev / 1.2, minZoom));
  };
  
  const handleTimelineVerticalZoomReset = () => {
    setTimelineVerticalZoom(1);
  };

  // Effort chart zoom functions
  const handleEffortZoomIn = () => {
    setEffortZoomLevel(prev => Math.min(prev * 1.2, maxZoom));
  };
  
  const handleEffortZoomOut = () => {
    setEffortZoomLevel(prev => Math.max(prev / 1.2, minZoom));
  };
  
  const handleEffortZoomReset = () => {
    setEffortZoomLevel(1);
  };

  // Effort chart horizontal zoom functions
  const handleEffortHorizontalZoomIn = () => {
    setEffortHorizontalZoom(prev => Math.min(prev * 1.2, maxZoom));
  };
  
  const handleEffortHorizontalZoomOut = () => {
    setEffortHorizontalZoom(prev => Math.max(prev / 1.2, minZoom));
  };
  
  const handleEffortHorizontalZoomReset = () => {
    setEffortHorizontalZoom(1);
  };

  const handleLoadMockData = () => {
    setXmlContent(mockXML);
    setClips(mockClips);
    setParseError('');
    setLoadedFileName('Mock Data');
  };

  // Auto-load file on app startup
  useEffect(() => {
    const autoLoadFile = async () => {
      const savedFile = getFileFromStorage();
      if (savedFile) {
        setIsAutoLoading(true);
        
        try {
          const fileData = await loadFileFromPath(savedFile.filePath);
          setLoadedFileName(fileData.name);
          handleFileProcessed(fileData.content);
        } catch (error) {
          console.error('Failed to auto-load file:', error);
          setParseError('Failed to auto-load saved file. Please select a new file.');
        } finally {
          setIsAutoLoading(false);
        }
      }
    };

    autoLoadFile();
  }, []);

  // Save zoom values to localStorage whenever they change
  useEffect(() => {
    saveZoomValues({
      zoomLevel,
      timelineVerticalZoom,
      effortZoomLevel,
      effortHorizontalZoom
    });
  }, [zoomLevel, timelineVerticalZoom, effortZoomLevel, effortHorizontalZoom]);

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle shortcuts when not typing in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'g':
          event.preventDefault();
          handleZoomOut();
          break;
        case 'h':
          event.preventDefault();
          handleZoomIn();
          break;
        case 'd':
          event.preventDefault();
          handleTimelineVerticalZoomOut();
          break;
        case 'f':
          event.preventDefault();
          handleTimelineVerticalZoomIn();
          break;
        case 'v':
          event.preventDefault();
          handleEffortZoomOut();
          break;
        case 'b':
          event.preventDefault();
          handleEffortZoomIn();
          break;
        case 'n':
          event.preventDefault();
          handleEffortHorizontalZoomOut();
          break;
        case 'm':
          event.preventDefault();
          handleEffortHorizontalZoomIn();
          break;
        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [zoomLevel, timelineVerticalZoom, effortZoomLevel, effortHorizontalZoom]); // Include all zoom levels in dependencies

  return (
    <div className="app">
      {/* Hamburger Menu */}
      <HamburgerMenu 
        onFileProcessed={handleFileProcessed}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        timelineVerticalZoom={timelineVerticalZoom}
        onTimelineVerticalZoomIn={handleTimelineVerticalZoomIn}
        onTimelineVerticalZoomOut={handleTimelineVerticalZoomOut}
        onTimelineVerticalZoomReset={handleTimelineVerticalZoomReset}
        effortZoomLevel={effortZoomLevel}
        onEffortZoomIn={handleEffortZoomIn}
        onEffortZoomOut={handleEffortZoomOut}
        onEffortZoomReset={handleEffortZoomReset}
        effortHorizontalZoom={effortHorizontalZoom}
        onEffortHorizontalZoomIn={handleEffortHorizontalZoomIn}
        onEffortHorizontalZoomOut={handleEffortHorizontalZoomOut}
        onEffortHorizontalZoomReset={handleEffortHorizontalZoomReset}
      />
      
      {/* Auto-loading indicator */}
      {isAutoLoading && (
        <div className="auto-loading-overlay">
          <div className="auto-loading-content">
            <div className="loading-spinner"></div>
            <p>Auto-loading saved file...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="app-main">
        {/* File loaded indicator */}
        {loadedFileName && !isAutoLoading && (
          <div className="file-indicator">
            <span className="file-icon">📁</span>
            <span className="file-name">{loadedFileName}</span>
          </div>
        )}
        

        
        {/* Error message */}
        {parseError && (
          <div className="error-overlay">
            <div className="error-content">
              <h3>⚠️ Parsing Error</h3>
              <p>{parseError}</p>
            </div>
          </div>
        )}
        
        {/* Timeline */}
        {clips.length > 0 ? (
          <>
            <div className="timeline-container">
              <Timeline clips={clips} zoomLevel={zoomLevel} verticalZoom={timelineVerticalZoom} />
            </div>
            <EffortAnalysis clips={clips} zoomLevel={effortZoomLevel} horizontalZoom={effortHorizontalZoom} />
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h1>Ableton Live Timeline</h1>
              <p>Click the menu button in the top-left corner to load a .als file</p>
              <div className="welcome-actions">
                <button 
                  className="demo-button"
                  onClick={handleLoadMockData}
                >
                  Try Demo Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
