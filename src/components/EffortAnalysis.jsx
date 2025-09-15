import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { useWebSocket } from '../hooks/useWebSocket';
import { getWebSocketUrl, WEBSOCKET_CONFIG } from '../config/websocket';
import { smpteToTimelinePosition } from '../utils/timeConverter';
import { getTimeRange } from '../utils/xmlParser';

const EffortAnalysis = ({ clips = [], zoomLevel = 1, horizontalZoom = 1, histogramGranularity = 2.0 }) => {
  // WebSocket connection for real-time time updates
  const { isConnected, smpteTime, currentBeats } = useWebSocket(
    getWebSocketUrl(), 
    WEBSOCKET_CONFIG.CONNECTION_OPTIONS
  );

  // Ref for scroll container
  const scrollContainerRef = useRef(null);

  // Stable callback for tooltip
  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-gray-300">
            <span className="text-blue-400">Effort:</span> {data.effort}% ({data.zone})
          </p>
          <p className="text-gray-300">
            <span className="text-green-400">Time:</span> {data.time.toFixed(1)}s
          </p>
          {data.duration > 0 && (
            <p className="text-gray-300">
              <span className="text-yellow-400">Duration:</span> {data.duration.toFixed(1)}s
            </p>
          )}
        </div>
      );
    }
    return null;
  }, []);

  // Function to classify color into effort zones
  const classifyEffort = (color) => {
    const { r, g, b } = color;
    
    // Black zone: very dark colors
    if (r < 50 && g < 50 && b < 50 ||  r === 64 && g  === 64 && b  === 64) {
      return { effort: 92, zone: 'Nero', zoneColor: '#000000' };
    }
    
    // Green zone: G is dominant
    if (g > r && g > b) {
      return { effort: 20, zone: 'Verde', zoneColor: '#00ff00' };
    }
    
    // Yellow zone: R and G are both high
    if (r > g && g > b && r > 150 && g > 150) {
      return { effort: 55, zone: 'Giallo', zoneColor: '#ffff00' };
    }
    
    // Red zone: R is dominant
    if (r > g && r > b) {
      return { effort: 80, zone: 'Rosso', zoneColor: '#ff0000' };
    }

    
    // Default fallback
    return { effort: 50, zone: 'Medio', zoneColor: '#808080' };
  };

  // Process clips data for the chart with useMemo to prevent re-calculations
  const chartData = useMemo(() => {
    if (clips.length === 0) return [];
    
    const timeRange = getTimeRange(clips);
    const timeSpan = timeRange.max - timeRange.min;
    const numDataPoints = Math.min(2000, Math.max(50, Math.floor(timeSpan / histogramGranularity))); // Configurable seconds per bar, max 2000 bars for performance
    
    // Debug log only when granularity changes significantly
    if (numDataPoints > 500) {
      console.log('High granularity detected:', {
        timeSpan: timeSpan.toFixed(1) + 's',
        configuredGranularity: histogramGranularity + 's',
        numDataPoints: numDataPoints,
        actualSecondsPerBar: (timeSpan / numDataPoints).toFixed(1) + 's'
      });
    }
    
    const dataPoints = [];
    
    for (let i = 0; i < numDataPoints; i++) {
      const timePosition = timeRange.min + (i / (numDataPoints - 1)) * timeSpan;
      
      // Find which clip is active at this time position
      const activeClip = clips
      .filter(clip => timePosition >= clip.start && timePosition <= clip.end)
      .sort((a, b) => b.end - a.end)[0];
      
      if (activeClip) {
        const effortData = classifyEffort(activeClip.color);
        dataPoints.push({
          time: timePosition,
          name: `${timePosition.toFixed(1)}s`,
          clipName: activeClip.name,
          track: activeClip.track,
          effort: effortData.effort,
          zone: effortData.zone,
          zoneColor: effortData.zoneColor,
          originalColor: activeClip.color.hex,
          start: activeClip.start,
          end: activeClip.end,
          duration: activeClip.end - activeClip.start
        });
      } else {
        // No clip active at this time
        dataPoints.push({
          time: timePosition,
          name: `${timePosition.toFixed(1)}s`,
          clipName: '',
          track: '',
          effort: 0,
          zone: 'Nessuno',
          zoneColor: '#333333',
          originalColor: '#333333',
          start: timePosition,
          end: timePosition,
          duration: 0
        });
      }
    }
    
    return dataPoints;
  }, [clips, histogramGranularity]);

  // Calculate cursor position based on time with throttling
  const timeRange = useMemo(() => getTimeRange(clips), [clips]);
  const cursorTime = useMemo(() => {
    if (!smpteTime || !timeRange || clips.length === 0) {
      return null;
    }
    
    let currentTime;
    
    if (currentBeats !== null) {
      currentTime = currentBeats;
    } else {
      // Fallback to seconds calculation
      const hoursToSeconds = smpteTime.hours * 3600;
      const minutesToSeconds = smpteTime.minutes * 60;
      currentTime = hoursToSeconds + minutesToSeconds + smpteTime.seconds;
    }
    
    // Clamp time within range
    const finalTime = Math.max(timeRange.min, Math.min(timeRange.max, currentTime));
    
    // Round to nearest 0.1 seconds to reduce jitter
    return Math.round(finalTime * 10) / 10;
  }, [smpteTime, currentBeats, timeRange, clips]);

  // Automatic scroll logic
  useEffect(() => {
    if (!cursorTime || !scrollContainerRef.current || !isConnected || horizontalZoom <= 1) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    const containerWidth = scrollContainer.clientWidth;
    const scrollWidth = scrollContainer.scrollWidth;
    
    // Only scroll if content is wider than container
    if (scrollWidth <= containerWidth) {
      return;
    }

    // Calculate cursor position relative to the chart
    const timeRange = getTimeRange(clips);
    const timeSpan = timeRange.max - timeRange.min;
    const cursorPosition = ((cursorTime - timeRange.min) / timeSpan) * scrollWidth;
    
    // Calculate cursor position relative to visible area
    const currentScrollLeft = scrollContainer.scrollLeft;
    const cursorRelativePosition = cursorPosition - currentScrollLeft;
    
    // Calculate thresholds (25% and 75% of container width)
    const leftThreshold = containerWidth * 0.25;
    const rightThreshold = containerWidth * 0.75;
    
    // Determine if we need to scroll
    let newScrollLeft = currentScrollLeft;
    
    if (cursorRelativePosition < leftThreshold) {
      // Cursor is too far left, scroll to put it at 25%
      newScrollLeft = cursorPosition - leftThreshold;
    } else if (cursorRelativePosition > rightThreshold) {
      // Cursor is too far right, scroll to put it at 25%
      newScrollLeft = cursorPosition - leftThreshold;
    }
    
    // Clamp scroll position
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, scrollWidth - containerWidth));
    
    // Smooth scroll to new position
    if (Math.abs(newScrollLeft - currentScrollLeft) > 5) {
      scrollContainer.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [cursorTime, isConnected, horizontalZoom, clips]);

  if (clips.length === 0) {
    return (
      <div className="effort-analysis-container flex items-center justify-center bg-gray-900 border-t border-gray-700">
        <p className="text-gray-400 text-lg">Nessuna clip disponibile per l'analisi dello sforzo</p>
      </div>
    );
  }

  return (
    <div className="effort-analysis-container bg-gray-900 border-t border-gray-700">
      <div className="h-full p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            {cursorTime !== null && (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-2xl font-mono font-bold">
        {(() => {
          const totalSeconds = Math.floor(cursorTime);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          const pad = (num) => String(num).padStart(2, "0");
          return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        })()}
      </span>
                  </div>
                </div>
            )}
          </div>
        </div>
        
        <div className="h-5/6">
          <div className="effort-chart-scroll-container" ref={scrollContainerRef}>
            <ResponsiveContainer 
              key={`chart-${clips.length}-${zoomLevel}-${horizontalZoom}`}
              width={`${100 * horizontalZoom}%`} 
              height={1200 * zoomLevel} 
              className="effort-chart-container"
            >
            <ComposedChart
              key={`composed-chart-${clips.length}`}
              data={chartData}
              margin={{
                top: 30,
                right: 40,
                left: 30,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              
              {/* Effort zones background */}
              <ReferenceLine y={40} stroke="#00ff00" strokeWidth={2} strokeDasharray="5 5" />
              <ReferenceLine y={70} stroke="#ffff00" strokeWidth={2} strokeDasharray="5 5" />
              <ReferenceLine y={90} stroke="#ff0000" strokeWidth={2} strokeDasharray="5 5" />
              <ReferenceLine y={95} stroke="#000000" strokeWidth={2} strokeDasharray="5 5" />
              
              
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                fontSize={12}
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `${value.toFixed(0)}s`}
                height={80}
                isAnimationActive={false}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={14}
                domain={[0, 100]}
                label={{ value: 'Sforzo (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 16 } }}
                isAnimationActive={false}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Bar 
                dataKey="effort" 
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.originalColor} />
                ))}
              </Bar>
              
              {/* Cursor line - Rendered AFTER bars to appear on top */}
              {cursorTime !== null && (
                <>
                  {/* Main cursor line */}
                  <ReferenceLine 
                    x={cursorTime} 
                    stroke="#00ff00" 
                    strokeWidth={10}
                    strokeDasharray="0"
                    strokeOpacity={1}
                    className="cursor-line"
                  />
                  {/* Secondary cursor line */}
                  <ReferenceLine 
                    x={cursorTime} 
                    stroke="#ffffff" 
                    strokeWidth={6}
                    strokeDasharray="0"
                    strokeOpacity={0.8}
                    className="cursor-line"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default EffortAnalysis;
