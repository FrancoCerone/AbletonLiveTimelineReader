import React, { useMemo } from 'react';
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

const EffortAnalysis = ({ clips = [] }) => {
  // WebSocket connection for real-time time updates
  const { isConnected, smpteTime, currentBeats } = useWebSocket(
    getWebSocketUrl(), 
    WEBSOCKET_CONFIG.CONNECTION_OPTIONS
  );

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
    const numDataPoints = Math.min(200, Math.max(50, Math.floor(timeSpan / 10))); // Adaptive number of points
    
    const dataPoints = [];
    
    for (let i = 0; i < numDataPoints; i++) {
      const timePosition = timeRange.min + (i / (numDataPoints - 1)) * timeSpan;
      
      // Find which clip is active at this time position
      const activeClip = clips.find(clip => timePosition >= clip.start && timePosition <= clip.end);
      
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
  }, [clips]);

  // Calculate cursor position based on time
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
    
    // Debug log
    console.log('EffortAnalysis Cursor:', {
      smpteTime,
      currentBeats,
      currentTime,
      timeRange,
      finalTime
    });
    
    return finalTime;
  }, [smpteTime, currentBeats, timeRange, clips]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{`${label}`}</p>
          <p className="text-gray-300 text-sm">{`Clip: ${data.clipName}`}</p>
          <p className="text-gray-300 text-sm">{`Track: ${data.track}`}</p>
          <p className="text-gray-300 text-sm">{`Sforzo: ${data.effort}% (${data.zone})`}</p>
          <p className="text-gray-300 text-sm">{`Durata: ${data.duration.toFixed(1)} beats`}</p>
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-4 h-4 rounded border border-gray-400"
              style={{ backgroundColor: data.originalColor }}
            ></div>
            <span className="text-gray-300 text-sm">{data.originalColor}</span>
          </div>
        </div>
      );
    }
    return null;
  };


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
          <h3 className="text-white text-lg font-semibold">
            📊 Analisi Sforzo Fisico
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            {cursorTime !== null && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-mono font-bold">
                  {cursorTime.toFixed(1)}s
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="h-5/6">
          <ResponsiveContainer width="100%" height={600}>
            <ComposedChart
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
              
              {/* Cursor line - Multiple approaches */}
              {cursorTime !== null && (
                <>
                  {/* Main cursor line */}
                  <ReferenceLine 
                    x={cursorTime} 
                    stroke="#00ff00" 
                    strokeWidth={10}
                    strokeDasharray="0"
                    strokeOpacity={1}
                  />
                  {/* Secondary cursor line */}
                  <ReferenceLine 
                    x={cursorTime} 
                    stroke="#ffffff" 
                    strokeWidth={6}
                    strokeDasharray="0"
                    strokeOpacity={0.8}
                  />
                  {/* Cursor time indicator */}
                  <ReferenceLine 
                    x={cursorTime} 
                    stroke="#00ff00" 
                    strokeWidth={4}
                    strokeDasharray="20 10"
                    strokeOpacity={1}
                    y={95}
                  />
                </>
              )}
              
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                fontSize={12}
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `${value.toFixed(0)}s`}
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={14}
                domain={[0, 100]}
                label={{ value: 'Sforzo (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 16 } }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Bar 
                dataKey="effort" 
                radius={[2, 2, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.originalColor} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        

      </div>
    </div>
  );
};

export default EffortAnalysis;
