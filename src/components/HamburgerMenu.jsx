import React, { useState } from 'react';
import FileUploader from './FileUploader';
import './HamburgerMenu.css';

const HamburgerMenu = ({ onFileProcessed, zoomLevel, onZoomIn, onZoomOut, onZoomReset, timelineVerticalZoom, onTimelineVerticalZoomIn, onTimelineVerticalZoomOut, onTimelineVerticalZoomReset, effortZoomLevel, onEffortZoomIn, onEffortZoomOut, onEffortZoomReset, effortHorizontalZoom, onEffortHorizontalZoomIn, onEffortHorizontalZoomOut, onEffortHorizontalZoomReset, clipFontSize, onFontSizeIncrease, onFontSizeDecrease, onFontSizeReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h3>Menu</h3>
              <button className="close-button" onClick={closeMenu}>
                ×
              </button>
            </div>
            
            <div className="menu-content">
              <div className="menu-section">
                <h4>File</h4>
                <FileUploader onFileProcessed={onFileProcessed} />
              </div>
              
              {/* Timeline Horizontal Zoom Controls */}
              <div className="menu-section">
                <h4>Timeline Horizontal Zoom</h4>
                <div className="zoom-controls">
                  <button onClick={onZoomOut} className="zoom-btn" disabled={zoomLevel <= 0.1} title="Timeline Horizontal Zoom Out (G)">
                    −
                  </button>
                  <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                  <button onClick={onZoomIn} className="zoom-btn" disabled={zoomLevel >= 5} title="Timeline Horizontal Zoom In (H)">
                    +
                  </button>
                  <button onClick={onZoomReset} className="zoom-reset-btn" title="Reset Timeline Horizontal Zoom">
                    Reset
                  </button>
                </div>
                <div className="keyboard-shortcuts">
                  <p className="shortcut-hint">
                    <span className="key">G</span> Zoom Out • <span className="key">H</span> Zoom In
                  </p>
                </div>
              </div>
              
              {/* Timeline Vertical Zoom Controls */}
              <div className="menu-section">
                <h4>Timeline Vertical Zoom</h4>
                <div className="zoom-controls">
                  <button onClick={onTimelineVerticalZoomOut} className="zoom-btn" disabled={timelineVerticalZoom <= 0.5} title="Timeline Vertical Zoom Out (D)">
                    −
                  </button>
                  <span className="zoom-level">{Math.round(timelineVerticalZoom * 100)}%</span>
                  <button onClick={onTimelineVerticalZoomIn} className="zoom-btn" disabled={timelineVerticalZoom >= 5} title="Timeline Vertical Zoom In (F)">
                    +
                  </button>
                  <button onClick={onTimelineVerticalZoomReset} className="zoom-reset-btn" title="Reset Timeline Vertical Zoom">
                    Reset
                  </button>
                </div>
                <div className="keyboard-shortcuts">
                  <p className="shortcut-hint">
                    <span className="key">D</span> Zoom Out • <span className="key">F</span> Zoom In
                  </p>
                </div>
              </div>
              
              {/* Effort Chart Vertical Zoom Controls */}
              <div className="menu-section">
                <h4>Effort Chart Vertical Zoom</h4>
                <div className="zoom-controls">
                  <button onClick={onEffortZoomOut} className="zoom-btn" disabled={effortZoomLevel <= 0.5} title="Effort Vertical Zoom Out (V)">
                    −
                  </button>
                  <span className="zoom-level">{Math.round(effortZoomLevel * 100)}%</span>
                  <button onClick={onEffortZoomIn} className="zoom-btn" disabled={effortZoomLevel >= 5} title="Effort Vertical Zoom In (B)">
                    +
                  </button>
                  <button onClick={onEffortZoomReset} className="zoom-reset-btn" title="Reset Effort Vertical Zoom">
                    Reset
                  </button>
                </div>
                <div className="keyboard-shortcuts">
                  <p className="shortcut-hint">
                    <span className="key">V</span> Zoom Out • <span className="key">B</span> Zoom In
                  </p>
                </div>
              </div>
              
              {/* Effort Chart Horizontal Zoom Controls */}
              <div className="menu-section">
                <h4>Effort Chart Horizontal Zoom</h4>
                <div className="zoom-controls">
                  <button onClick={onEffortHorizontalZoomOut} className="zoom-btn" disabled={effortHorizontalZoom <= 0.5} title="Effort Horizontal Zoom Out (N)">
                    −
                  </button>
                  <span className="zoom-level">{Math.round(effortHorizontalZoom * 100)}%</span>
                  <button onClick={onEffortHorizontalZoomIn} className="zoom-btn" disabled={effortHorizontalZoom >= 5} title="Effort Horizontal Zoom In (M)">
                    +
                  </button>
                  <button onClick={onEffortHorizontalZoomReset} className="zoom-reset-btn" title="Reset Effort Horizontal Zoom">
                    Reset
                  </button>
                </div>
                <div className="keyboard-shortcuts">
                  <p className="shortcut-hint">
                    <span className="key">N</span> Zoom Out • <span className="key">M</span> Zoom In
                  </p>
                </div>
              </div>
              
              {/* Future menu items will go here */}
              <div className="menu-section">
                <h4>Tools</h4>
                <p className="menu-placeholder">More tools coming soon...</p>
              </div>
              
              <div className="menu-section">
                <h4>Clip Font Size</h4>
                <div className="zoom-controls">
                  <button onClick={onFontSizeDecrease} className="zoom-btn" title="Decrease font size">
                    A-
                  </button>
                  <span className="zoom-level">{clipFontSize}px</span>
                  <button onClick={onFontSizeIncrease} className="zoom-btn" title="Increase font size">
                    A+
                  </button>
                  <button onClick={onFontSizeReset} className="zoom-reset-btn" title="Reset font size">
                    Reset
                  </button>
                </div>
                <div className="keyboard-shortcuts">
                  <span className="shortcut-hint">Shortcuts:</span>
                  <span className="key">-</span> <span className="key">+</span>
                </div>
              </div>
              
              <div className="menu-section">
                <h4>Settings</h4>
                <p className="menu-placeholder">Settings coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HamburgerMenu;
