/**
 * Parse Ableton Live XML and extract AudioClip data
 * @param {string} xmlString - The XML content as string
 * @returns {Array} Array of Clip objects with trackIndex
 */

import { abletonLive11ColorToRGB } from './colorConverter';

export const parseAbletonXML = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing failed: ' + parserError.textContent);
    }

    const clips = [];
    
    // Navigate to Ableton -> LiveSet -> Tracks -> AudioTrack
    const ableton = xmlDoc.querySelector('Ableton');
    if (!ableton) {
      throw new Error('Ableton root element not found');
    }

    const liveSet = ableton.querySelector('LiveSet');
    if (!liveSet) {
      throw new Error('LiveSet element not found');
    }

    const tracks = liveSet.querySelector('Tracks');
    if (!tracks) {
      throw new Error('Tracks element not found');
    }

    const audioTracks = tracks.querySelectorAll('AudioTrack');
    
    // Process tracks in order to maintain their position in the timeline
    // trackIndex represents the original order of tracks in the XML:
    // - First AudioTrack = trackIndex 0 (top row)
    // - Second AudioTrack = trackIndex 1 (second row)
    // - And so on...
    audioTracks.forEach((audioTrack, trackIndex) => {
      // Get track name
      const trackNameElement = audioTrack.querySelector('Name[Value]');
      const trackName = trackNameElement ? 
        trackNameElement.getAttribute('Value') : 
        `Track ${trackIndex + 1}`;

      // Navigate to DeviceChain -> MainSequencer -> Sample -> ArrangerAutomation -> Events -> AudioClip
      const deviceChain = audioTrack.querySelector('DeviceChain');
      if (!deviceChain) return;

      const mainSequencer = deviceChain.querySelector('MainSequencer');
      if (!mainSequencer) return;

      const sample = mainSequencer.querySelector('Sample');
      if (!sample) return;

      const arrangerAutomation = sample.querySelector('ArrangerAutomation');
      if (!arrangerAutomation) return;

      const events = arrangerAutomation.querySelector('Events');
      if (!events) return;

      const audioClips = events.querySelectorAll('AudioClip');
      
      audioClips.forEach((audioClip) => {
        try {
          // Extract clip data from Value attributes
          const nameElement = audioClip.querySelector('Name[Value]');
          const colorElement = audioClip.querySelector('Color[Value]');
          const currentStartElement = audioClip.querySelector('CurrentStart[Value]');
          const currentEndElement = audioClip.querySelector('CurrentEnd[Value]');

          const name = nameElement ? nameElement.getAttribute('Value') : 'Unnamed Clip';
          const colorIndex = colorElement ? parseInt(colorElement.getAttribute('Value')) : 0;
          const color = abletonLive11ColorToRGB(colorIndex);
          const start = currentStartElement ? parseFloat(currentStartElement.getAttribute('Value')) : 0;
          const end = currentEndElement ? parseFloat(currentEndElement.getAttribute('Value')) : 0;
          

          // Only add clip if it has valid start and end values
          if (start >= 0 && end > start) {
            clips.push({
              track: trackName,
              trackIndex: trackIndex, // Add trackIndex to maintain order
              name: name,
              color: color,
              start: start,
              end: end
            });
          }
        } catch (clipError) {
          console.warn('Error parsing individual clip:', clipError);
        }
      });
    });

    // Log clip model structure for debugging
    if (clips.length > 0) {
      console.log('📋 Clip Model Structure:');
      console.log('Total clips:', clips.length);
      console.log('Sample clip model:', {
        track: clips[0].track,
        trackIndex: clips[0].trackIndex,
        name: clips[0].name,
        color: clips[0].color,
        start: clips[0].start,
        end: clips[0].end
      });
      console.log('All clips:', clips);
    }
    
    return clips;

  } catch (error) {
    console.error('Error parsing Ableton XML:', error);
    throw error;
  }
};

/**
 * Get unique tracks from clips array, maintaining their original order
 * @param {Array} clips - Array of Clip objects with trackIndex
 * @returns {Array} Array of unique track objects with name and index
 */
export const getUniqueTracks = (clips) => {
  // Create a map to store unique tracks with their original index
  const trackMap = new Map();
  
  clips.forEach(clip => {
    if (!trackMap.has(clip.track)) {
      trackMap.set(clip.track, {
        name: clip.track,
        index: clip.trackIndex
      });
    }
  });
  
  // Convert to array and sort by original trackIndex to maintain order
  return Array.from(trackMap.values()).sort((a, b) => a.index - b.index);
};

/**
 * Get time range from clips array
 * @param {Array} clips - Array of Clip objects
 * @returns {Object} Object with min and max time values
 */
export const getTimeRange = (clips) => {
  if (clips.length === 0) {
    return { min: 0, max: 100 };
  }
  
  const allTimes = clips.flatMap(clip => [clip.start, clip.end]);
  const min = Math.min(...allTimes);
  const max = Math.max(...allTimes);
  
  // Use the end of the last clip as the timeline end
  // Find the maximum end time among all clips
  const maxEnd = Math.max(...clips.map(clip => clip.end));
  
  // Add some padding at the beginning, but use the actual end of the last clip
  const padding = (max - min) * 0.1;
  
  const result = {
    min: Math.max(0, min - padding),
    max: maxEnd // Use the actual end of the last clip
  };
  
  
  return result;
};
