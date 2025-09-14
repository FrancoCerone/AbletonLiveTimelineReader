import React from 'react';
import { smpteToTimelinePosition, getCurrentTimeInSeconds } from '../utils/timeConverter';
import './TimelineCursor.css';

const TimelineCursor = ({ 
  smpteTime, 
  currentBeats,
  timeRange, 
  timelineWidth, 
  timelineHeight,
  isVisible = true 
}) => {

  
  if (!smpteTime || !isVisible) {
    return null;
  }

  const cursorX = smpteToTimelinePosition(smpteTime, timeRange, timelineWidth, currentBeats);
  const currentTimeInSeconds = getCurrentTimeInSeconds(smpteTime);
  
  // Debug: Log the actual position being rendered
  


  return (
    <g className="timeline-cursor">
      {/* Vertical line */}
      <line
        x1={cursorX}
        y1="0"
        x2={cursorX}
        y2={timelineHeight}
        stroke="#ff4444"
        strokeWidth="2"
        strokeDasharray="5,5"
        className="cursor-line"
        data-debug-x={cursorX}
      />
      
      {/* Time label at top */}
      <g className="cursor-label">
        <rect
          x={cursorX - 30}
          y="0"
          width="60"
          height="20"
          fill="#ff4444"
          rx="3"
        />
        <text
          x={cursorX}
          y="13"
          textAnchor="middle"
          fontSize="10"
          fill="white"
          fontWeight="bold"
        >
          {cursorX}
        </text>
      </g>
      
      {/* Playhead triangle */}
      <polygon
        points={`${cursorX},${timelineHeight - 10} ${cursorX - 5},${timelineHeight} ${cursorX + 5},${timelineHeight}`}
        fill="#ff4444"
        className="cursor-triangle"
      />
    </g>
  );
};

export default TimelineCursor;
