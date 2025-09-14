import React, { useMemo, useState, useEffect } from 'react';
import { getUniqueTracks, getTimeRange } from '../utils/xmlParser';
import { useWebSocket } from '../hooks/useWebSocket';
import { getWebSocketUrl, WEBSOCKET_CONFIG } from '../config/websocket';
import { abletonColorToCSS, lightenColor } from '../utils/colorConverter';
import TimelineCursor from './TimelineCursor';
import './Timeline.css';

const Timeline = ({ clips = [], zoomLevel = 1, verticalZoom = 1 }) => {
  // WebSocket connection for real-time time updates
  const { isConnected, smpteTime, currentBeats, error: wsError } = useWebSocket(
    getWebSocketUrl(), 
    WEBSOCKET_CONFIG.CONNECTION_OPTIONS
  );
  
  // Local timer for testing - updates every second
  const [localTime, setLocalTime] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Use local time for testing if WebSocket is not connected
  const currentSmpteTime = isConnected && smpteTime ? smpteTime : {
    hours: 0,
    minutes: 0,
    seconds: localTime,
    frames: 0
  };
  
  

  if (clips.length === 0) {
    return (
      <div className="timeline-container">
        <div className="timeline-empty">
          <p>No audio clips found in the project</p>
        </div>
      </div>
    );
  }

  // Get tracks maintaining their original order from XML (trackIndex)
  const tracks = getUniqueTracks(clips);
  
  // Memoize timeRange to prevent recalculation on every render
  const timeRange = useMemo(() => {
    const range = getTimeRange(clips);
    return range;
  }, [clips]);
  
  const timeSpan = timeRange.max - timeRange.min;
  
  
  // Timeline dimensions - calculate width based on content and zoom
  const minWidth = 1200;
  const baseWidth = Math.max(minWidth, timeSpan * 2); // 2 pixels per beat unit
  const timelineWidth = baseWidth * zoomLevel;
  const trackHeight = 35 * verticalZoom; // Apply vertical zoom to track height
  const timelineHeight = tracks.length * trackHeight + 50; // Reduced header and padding
  
  
  // Convert time to pixel position
  const timeToPixel = (time) => {
    const position = ((time - timeRange.min) / timeSpan) * timelineWidth;
    return position;
  };

  // Convert time duration to pixel width
  const durationToPixel = (duration) => {
    return (duration / timeSpan) * timelineWidth;
  };

  // Get color for clip based on Ableton color data
  const getClipColor = (colorData) => {
    if (colorData && typeof colorData === 'object' && colorData.hex) {
      return colorData.hex; // Use hex directly from Ableton palette
    }
    if (colorData && typeof colorData === 'object' && colorData.r !== undefined) {
      return `rgb(${colorData.r}, ${colorData.g}, ${colorData.b})`;
    }
    // Fallback to gray if color is not valid
    return '#808080';
  };

  // Format time for display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(1);
    return `${minutes}:${seconds.padStart(4, '0')}`;
  };

  return (


      <div className="timeline-wrapper">

        <svg 
          width={timelineWidth + 200} 
          height={timelineHeight}
          className="timeline-svg"
        >
          {/* Dark background */}
          <rect width={timelineWidth} height={timelineHeight} fill="#1f2937" />
          
          {/* Time markers - removed for cleaner look */}
          
          {/* Track lanes */}
          {tracks.map((track) => {
            const y = 25 + track.index * trackHeight; // Reduced starting position
            return (
              <g key={track.name}>
                {/* Track background - dark theme */}
                <rect 
                  x="0" y={y} 
                  width={timelineWidth} height={trackHeight - 5} 
                  fill={track.index % 2 === 0 ? "#374151" : "#4b5563"}
                  stroke="#6b7280" strokeWidth="0.5"
                />
                
                {/* Track label */}
                <text 
                  x="-10" y={y + trackHeight/2} 
                  textAnchor="end" 
                  fontSize="11" 
                  fill="#d1d5db"
                  dominantBaseline="middle"
                >
                  {track.name}
                </text>
                
                {/* Clips for this track */}
                {clips
                  .filter(clip => clip.track === track.name)
                  .map((clip, clipIndex) => {
                    const x = timeToPixel(clip.start);
                    const width = durationToPixel(clip.end - clip.start);
                    const clipY = y + 3; // Reduced padding
                    const clipHeight = trackHeight - 8; // More compact clips
                    

                    
                    return (
                      <g key={`${track}-${clipIndex}`}>
                        {/* Clip rectangle */}
                        <rect
                          x={x}
                          y={clipY}
                          width={width}
                          height={clipHeight}
                          fill={getClipColor(clip.color)}
                          stroke="#333"
                          strokeWidth="1"
                          rx="2"
                          className="clip-rect"
                        />
                        
                        {/* Clip name (if there's enough space) */}
                        {width > 60 && (
                          <text
                            x={x + 5}
                            y={clipY + clipHeight/2}
                            fontSize="9"
                            fill="#ffffff"
                            dominantBaseline="middle"
                            className="clip-text"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                          >
                            {clip.name.length > 12 ? clip.name.substring(0, 12) + '...' : clip.name}
                          </text>
                        )}
                        
                        {/* Tooltip data */}
                        <title>
                          {clip.name}
                          {'\n'}Track: {clip.track}
                          {'\n'}Start: {formatTime(clip.start)}
                          {'\n'}End: {formatTime(clip.end)}
                          {'\n'}Duration: {formatTime(clip.end - clip.start)}
                        </title>
                      </g>
                    );
                  })}
              </g>
            );
          })}
          

          <TimelineCursor
            smpteTime={currentSmpteTime}
            currentBeats={currentBeats}
            timeRange={timeRange}
            timelineWidth={timelineWidth}
            timelineHeight={timelineHeight}
            isVisible={true}
          />
        </svg>
      </div>
      

  );
};

export default Timeline;
