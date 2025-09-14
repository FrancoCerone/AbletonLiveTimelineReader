import React, { useState } from 'react';
import FileUploader from './FileUploader';
import './HamburgerMenu.css';

const HamburgerMenu = ({ onFileProcessed, zoomLevel, onZoomIn, onZoomOut, onZoomReset }) => {
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
              
              <div className="menu-section">
                <h4>Zoom</h4>
                <div className="zoom-controls">
                  <button onClick={onZoomOut} className="zoom-btn" disabled={zoomLevel <= 0.1} title="Zoom Out (G)">
                    −
                  </button>
                  <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                  <button onClick={onZoomIn} className="zoom-btn" disabled={zoomLevel >= 5} title="Zoom In (H)">
                    +
                  </button>
                  <button onClick={onZoomReset} className="zoom-reset-btn" title="Reset Zoom">
                    Reset
                  </button>
                </div>
                <div className="keyboard-shortcuts">
                  <p className="shortcut-hint">
                    <span className="key">G</span> Zoom Out • <span className="key">H</span> Zoom In
                  </p>
                </div>
              </div>
              
              {/* Future menu items will go here */}
              <div className="menu-section">
                <h4>Tools</h4>
                <p className="menu-placeholder">More tools coming soon...</p>
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
