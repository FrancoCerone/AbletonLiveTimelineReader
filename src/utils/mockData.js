/**
 * Mock data for testing the timeline component
 * This simulates the structure of parsed AudioClip data
 */

import { abletonLive11ColorToRGB } from './colorConverter';

export const mockClips = [
  {
    track: "Track 1",
    trackIndex: 0,
    name: "Starsailor - Four To The Floor",
    color: abletonLive11ColorToRGB(3), // #e2f0cb (Light Green)
    start: 411.74,
    end: 591.53
  },
  {
    track: "Track 1", 
    trackIndex: 0,
    name: "Starsailor - Four To The Floor",
    color: abletonLive11ColorToRGB(19), // #fcd9e5 (Light Pink)
    start: 591.53,
    end: 1105.67
  },
  {
    track: "Track 2",
    trackIndex: 1,
    name: "Drum Loop 1",
    color: abletonLive11ColorToRGB(0), // #ff9aa2 (Coral)
    start: 0,
    end: 128
  },
  {
    track: "Track 2",
    trackIndex: 1,
    name: "Drum Loop 2", 
    color: abletonLive11ColorToRGB(0), // #ff9aa2 (Coral)
    start: 128,
    end: 256
  },
  {
    track: "Track 3",
    trackIndex: 2,
    name: "Bass Line",
    color: abletonLive11ColorToRGB(6), // #c7ceea (Light Blue)
    start: 64,
    end: 320
  },
  {
    track: "Track 4",
    trackIndex: 3,
    name: "Lead Synth",
    color: abletonLive11ColorToRGB(9), // #fde2e4 (Light Pink)
    start: 200,
    end: 400
  },
  {
    track: "Track 4",
    trackIndex: 3,
    name: "Lead Synth Variation",
    color: abletonLive11ColorToRGB(9), // #fde2e4 (Light Pink)
    start: 500,
    end: 700
  },
  {
    track: "Track 5",
    trackIndex: 4,
    name: "Vocal Sample",
    color: abletonLive11ColorToRGB(12), // #bee6ff (Light Blue)
    start: 100,
    end: 150
  },
  {
    track: "Track 5",
    trackIndex: 4,
    name: "Vocal Sample 2",
    color: abletonLive11ColorToRGB(12), // #bee6ff (Light Blue)
    start: 300,
    end: 350
  }
];

/**
 * Mock XML string for testing
 */
export const mockXML = `<?xml version="1.0" encoding="UTF-8"?>
<Ableton MajorVersion="5" MinorVersion="10.0_377" SchemaChangeCount="10" Creator="Ableton Live 10.1.25" Revision="ef14e6289a4c8cb91e13e4c8d0a1d4fd0a1b2c3d">
  <LiveSet>
    <Tracks>
      <AudioTrack>
        <Name Value="Track 1" />
        <DeviceChain>
          <MainSequencer>
            <Sample>
              <ArrangerAutomation>
                <Events>
                  <AudioClip>
                    <Name Value="Starsailor - Four To The Floor" />
                    <Color Value="3" />
                    <CurrentStart Value="411.74" />
                    <CurrentEnd Value="591.53" />
                  </AudioClip>
                  <AudioClip>
                    <Name Value="Starsailor - Four To The Floor" />
                    <Color Value="19" />
                    <CurrentStart Value="591.53" />
                    <CurrentEnd Value="1105.67" />
                  </AudioClip>
                </Events>
              </ArrangerAutomation>
            </Sample>
          </MainSequencer>
        </DeviceChain>
      </AudioTrack>
    </Tracks>
  </LiveSet>
</Ableton>`;
