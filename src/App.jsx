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
  
  // Font size state with localStorage persistence
  const [clipFontSize, setClipFontSize] = useState(() => {
    const saved = localStorage.getItem('clipFontSize');
    return saved ? parseInt(saved) : 24; // Default to 24px
  });
  
  // Histogram granularity state with localStorage persistence
  const [histogramGranularity, setHistogramGranularity] = useState(() => {
    const saved = localStorage.getItem('histogramGranularity');
    return saved ? parseFloat(saved) : 2.0; // Default to 2 seconds per bar
  });

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
  const maxZoom = 10;

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

  // Font size controls
  const handleFontSizeIncrease = () => {
    const newSize = Math.min(clipFontSize + 4, 48); // Max 48px
    setClipFontSize(newSize);
    localStorage.setItem('clipFontSize', newSize.toString());
  };

  const handleFontSizeDecrease = () => {
    const newSize = Math.max(clipFontSize - 4, 8); // Min 8px
    setClipFontSize(newSize);
    localStorage.setItem('clipFontSize', newSize.toString());
  };

  const handleFontSizeReset = () => {
    setClipFontSize(24);
    localStorage.setItem('clipFontSize', '24');
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

  // Histogram granularity functions
  const handleGranularityIncrease = () => {
    setHistogramGranularity(prev => Math.min(prev + 0.5, 10.0)); // Max 10 seconds per bar
  };
  
  const handleGranularityDecrease = () => {
    setHistogramGranularity(prev => Math.max(prev - 0.5, 0.5)); // Min 0.5 seconds per bar
  };
  
  const handleGranularityReset = () => {
    setHistogramGranularity(2.0); // Default 2 seconds per bar
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

  // Save font size to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clipFontSize', clipFontSize.toString());
  }, [clipFontSize]);

  // Save histogram granularity to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('histogramGranularity', histogramGranularity.toString());
  }, [histogramGranularity]);

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
        case 'j':
          event.preventDefault();
          handleGranularityDecrease();
          break;
        case 'k':
          event.preventDefault();
          handleGranularityIncrease();
          break;
        case '-':
          event.preventDefault();
          handleFontSizeDecrease();
          break;
        case '+':
        case '=':
          event.preventDefault();
          handleFontSizeIncrease();
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
        clipFontSize={clipFontSize}
        onFontSizeIncrease={handleFontSizeIncrease}
        onFontSizeDecrease={handleFontSizeDecrease}
        onFontSizeReset={handleFontSizeReset}
        histogramGranularity={histogramGranularity}
        onGranularityIncrease={handleGranularityIncrease}
        onGranularityDecrease={handleGranularityDecrease}
        onGranularityReset={handleGranularityReset}
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
              <Timeline clips={clips} zoomLevel={zoomLevel} verticalZoom={timelineVerticalZoom} clipFontSize={clipFontSize} />
            </div>
            <EffortAnalysis clips={clips} zoomLevel={effortZoomLevel} horizontalZoom={effortHorizontalZoom} histogramGranularity={histogramGranularity} />
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
