import React, { useMemo, useState, useEffect } from 'react';
import { getUniqueTracks, getTimeRange } from '../utils/xmlParser';
import { useWebSocket } from '../hooks/useWebSocket';
import { getWebSocketUrl, WEBSOCKET_CONFIG } from '../config/websocket';
import { abletonColorToCSS, lightenColor } from '../utils/colorConverter';
import TimelineCursor from './TimelineCursor';
import './Timeline.css';

const Timeline = ({ clips = [], zoomLevel = 1, verticalZoom = 1, clipFontSize = 24 }) => {
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
  
  // Optimize clips by merging consecutive clips with same name and track
  const optimizedClips = useMemo(() => {
    if (clips.length === 0) return [];
    
    // Group clips by track
    const clipsByTrack = clips.reduce((acc, clip) => {
      if (!acc[clip.track]) acc[clip.track] = [];
      acc[clip.track].push(clip);
      return acc;
    }, {});
    
    const mergedClips = [];
    
    // Process each track
    Object.entries(clipsByTrack).forEach(([trackName, trackClips]) => {
      // Sort clips by start time
      const sortedClips = trackClips.sort((a, b) => a.start - b.start);
      
      let currentClip = null;
      
      sortedClips.forEach(clip => {
        if (!currentClip) {
          // First clip in track
          currentClip = { ...clip };
        } else if (
          currentClip.name === clip.name && 
          currentClip.track === clip.track &&
          Math.abs(currentClip.end - clip.start) < 0.1 // Allow small gap (0.1 seconds)
        ) {
          // Merge with previous clip (same name, same track, consecutive)
          currentClip.end = clip.end;
        } else {
          // Different clip, save current and start new
          mergedClips.push(currentClip);
          currentClip = { ...clip };
        }
      });
      
      // Don't forget the last clip
      if (currentClip) {
        mergedClips.push(currentClip);
      }
    });
    
    // Debug log to show optimization results
    console.log('Timeline Optimization:', {
      originalClips: clips.length,
      optimizedClips: mergedClips.length,
      reduction: clips.length - mergedClips.length,
      reductionPercentage: ((clips.length - mergedClips.length) / clips.length * 100).toFixed(1) + '%'
    });
    
    return mergedClips;
  }, [clips]);
  
  // Memoize timeRange to prevent recalculation on every render
  const timeRange = useMemo(() => {
    const range = getTimeRange(optimizedClips);
    return range;
  }, [optimizedClips]);
  
  const timeSpan = timeRange.max - timeRange.min;
  
  
  // Timeline dimensions - calculate width based on content and zoom
  const minWidth = 1200;
  const baseWidth = Math.max(minWidth, timeSpan * 2); // 2 pixels per beat unit
  const timelineWidth = baseWidth * zoomLevel;
  const trackHeight = 35 * verticalZoom; // Apply vertical zoom to track height
  
  // Energy line area height = total height of all tracks combined
  const energyAreaHeight = tracks.length * trackHeight;
  const timelineHeight = energyAreaHeight + tracks.length * trackHeight + 50; // Energy area + tracks + padding
  
  
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

  // Format time for display (hh:mm:ss)
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate energy line data based on clip colors and positions
  const energyLineData = useMemo(() => {
    if (optimizedClips.length === 0) return [];
    
    const timeSpan = timeRange.max - timeRange.min;
    const numPoints = Math.min(200, Math.max(50, Math.floor(timeSpan / 2))); // Points every 2 seconds
    const energyPoints = [];
    
    for (let i = 0; i < numPoints; i++) {
      const timePosition = timeRange.min + (i / (numPoints - 1)) * timeSpan;
      
      // Find all clips active at this time position
      const activeClips = optimizedClips.filter(clip => 
        timePosition >= clip.start && timePosition <= clip.end
      );
      
      if (activeClips.length > 0) {
        // Calculate energy based on track positions (first track = high energy, last track = low energy)
        let totalEnergy = 0;
        let weightSum = 0;
        
        activeClips.forEach(clip => {
          // Energy based on track position (first track = high energy, last track = low energy)
          const trackIndex = tracks.findIndex(t => t.name === clip.track);
          
          if (trackIndex >= 0) {
            // Invert the track index: first track (index 0) = highest energy, last track = lowest energy
            const energyFromTrack = 100 - (trackIndex / (tracks.length - 1)) * 80; // Range from 100% to 20%
            
            totalEnergy += energyFromTrack;
            weightSum += 1;
          }
        });
        
        const averageEnergy = weightSum > 0 ? totalEnergy / weightSum : 0;
        energyPoints.push({
          time: timePosition,
          energy: averageEnergy,
          x: timeToPixel(timePosition)
        });
      } else {
        // No clips active, low energy
        energyPoints.push({
          time: timePosition,
          energy: 10,
          x: timeToPixel(timePosition)
        });
      }
    }
    
    // Debug log for energy calculation
    console.log('Energy Line Data (Track-based):', {
      totalPoints: energyPoints.length,
      timeRange: { min: timeRange.min, max: timeRange.max },
      tracks: tracks.map(t => t.name),
      samplePoints: energyPoints.slice(0, 5).map(p => ({ time: p.time.toFixed(1), energy: p.energy.toFixed(1) }))
    });
    
    return energyPoints;
  }, [optimizedClips, timeRange, tracks, timeToPixel]);

  return (
    <div className="timeline-container">
      {/* Timeline header with optimization info */}

      <div className="timeline-wrapper">

        <svg 
          width={timelineWidth + 200} 
          height={timelineHeight}
          className="timeline-svg"
        >
          {/* SVG filters for glow effect */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Dark background */}
          <rect width={timelineWidth} height={timelineHeight} fill="#1f2937" />
          
          {/* Energy line area background */}
          <rect 
            x="0" y="5" 
            width={timelineWidth} height={energyAreaHeight} 
            fill="#111827" 
            stroke="#374151" 
            strokeWidth="1"
            rx="2"
          />
          
          {/* Energy line */}
          {energyLineData.length > 1 && (
            <g>
              {/* Energy line path */}
              <path
                d={`M ${energyLineData.map(point => `${point.x},${5 + (100 - point.energy) * (energyAreaHeight - 10) / 100}`).join(' L ')}`}
                fill="none"
                stroke="#00ff88"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
              
              {/* Energy line glow effect */}
              <path
                d={`M ${energyLineData.map(point => `${point.x},${5 + (100 - point.energy) * (energyAreaHeight - 10) / 100}`).join(' L ')}`}
                fill="none"
                stroke="#00ff88"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
                filter="url(#glow)"
              />
              
              {/* Energy line dots */}
              {energyLineData.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={5 + (100 - point.energy) * (energyAreaHeight - 10) / 100}
                  r="2"
                  fill="#00ff88"
                  opacity="0.9"
                />
              ))}
            </g>
          )}
          
          {/* Energy scale labels */}
          {/* Time markers - removed for cleaner look */}
          
          {/* Track lanes */}
          {tracks.map((track) => {
            const y = energyAreaHeight + 10 + track.index * trackHeight; // Position tracks below energy area
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
                {optimizedClips
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
                        {width > Math.max(80, clipFontSize * 3) && (
                          <text
                            x={x + 12}
                            y={clipY + clipHeight/2}
                            fontSize={clipFontSize}
                            fill="#ffffff"
                            dominantBaseline="middle"
                            className="clip-text"
                            style={{ textShadow: '3px 3px 8px rgba(0,0,0,1)', fontWeight: 'bold', stroke: '#000000', strokeWidth: '0.5px' }}
                          >
                            {clip.name.length > Math.max(20, Math.floor(clipFontSize / 1.2)) ? clip.name.substring(0, Math.max(20, Math.floor(clipFontSize / 1.2))) + '...' : clip.name}
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
          
          {/* Current energy indicator */}
          {isConnected && smpteTime && energyLineData.length > 0 && (
            (() => {
              const currentTime = smpteTime.hours * 3600 + smpteTime.minutes * 60 + smpteTime.seconds;
              const currentEnergyPoint = energyLineData.find(point => 
                Math.abs(point.time - currentTime) < 1
              ) || energyLineData[Math.floor(energyLineData.length / 2)];
              
              if (currentEnergyPoint) {
                const energyY = 5 + (100 - currentEnergyPoint.energy) * (energyAreaHeight - 10) / 100;
                const cursorX = timeToPixel(currentTime);
                
                return (
                  <g>
                    {/* Current energy value only - no vertical line */}
                    <text
                      x={cursorX + 8}
                      y={energyY - 5}
                      fontSize="10"
                      fill="#00ff88"
                      fontWeight="bold"
                    >
                      {Math.round(currentEnergyPoint.energy)}%
                    </text>
                  </g>
                );
              }
              return null;
            })()
          )}
        </svg>
      </div>
    </div>
  );
};

export default Timeline;
