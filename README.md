# Ableton Live Timeline Reader

A powerful React application for reading, analyzing, and visualizing Ableton Live project files (.als). This application provides real-time synchronization with Ableton Live, advanced timeline visualization, and comprehensive effort analysis for fitness tracking.

## 🎵 Features

### 📁 File Management
- **Drag & Drop Upload**: Easy .als file upload with drag and drop support
- **Auto-Load**: Automatically loads the last used file on startup
- **File Persistence**: Saves file path in browser storage
- **Gzip Decompression**: Automatically decompresses Ableton's gzipped XML content
- **XML Parsing**: Extracts audio clips, tracks, and timing information

### 🎛️ Timeline Visualization
- **Multi-Track Display**: Shows all audio tracks with color-coded clips
- **Clip Merging**: Automatically merges consecutive clips with same name and track
- **Energy Line**: Visual energy indicator based on track positions
- **Time Format**: Professional hh:mm:ss time display
- **Clip Names**: Always visible clip names with improved contrast
- **Zoom Controls**: Independent horizontal and vertical zoom
- **Font Size Control**: Adjustable clip text size (8px - 48px)

### 📊 Effort Analysis Chart
- **Color Classification**: Analyzes clip colors to determine physical effort levels
- **4 Effort Zones**: 
  - 🟢 Green: Low effort (0-40%)
  - 🟡 Yellow: Medium effort (40-70%)
  - 🔴 Red: High effort (70-90%)
  - ⚫ Black: Maximum effort (95-100%)
- **Configurable Granularity**: Adjustable histogram resolution (0.5s - 10s per bar)
- **Real-time Cursor**: Synchronized cursor with Ableton Live playback
- **Auto-scroll**: Intelligent horizontal scrolling to keep cursor visible
- **Effort Zones Background**: Visual zones for easy effort level identification

### 🔗 Real-time Synchronization
- **WebSocket Connection**: Live sync with Ableton Live via WebSocket
- **SMPTE Time**: Accurate time synchronization
- **Beat Tracking**: Support for beat-based timing
- **Connection Status**: Visual indicator of connection state
- **Automatic Reconnection**: Handles connection drops gracefully

### ⚙️ Advanced Controls
- **Hamburger Menu**: Centralized control panel
- **Keyboard Shortcuts**: Full keyboard control for all functions
- **Persistent Settings**: All settings saved to browser storage
- **Performance Optimized**: Efficient rendering with React optimizations

## 🎮 Keyboard Shortcuts

### Timeline Controls
- **G**: Timeline horizontal zoom out
- **H**: Timeline horizontal zoom in
- **D**: Timeline vertical zoom out
- **F**: Timeline vertical zoom in

### Effort Chart Controls
- **V**: Effort chart vertical zoom out
- **B**: Effort chart vertical zoom in
- **N**: Effort chart horizontal zoom out
- **M**: Effort chart horizontal zoom in

### Granularity Controls
- **J**: Decrease histogram granularity (more detail)
- **K**: Increase histogram granularity (less detail)

### Font Controls
- **-**: Decrease clip font size
- **+**: Increase clip font size

## 🚀 Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd AbletonClipReader
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── App.jsx                    # Main application component
├── App.css                    # Global styles and animations
├── index.js                   # Application entry point
├── components/
│   ├── FileUploader.jsx       # File upload and processing
│   ├── HamburgerMenu.jsx      # Centralized control panel
│   ├── Timeline.jsx           # Timeline visualization
│   ├── EffortAnalysis.jsx     # Effort analysis chart
│   └── TimelineCursor.jsx     # Timeline cursor component
├── hooks/
│   └── useWebSocket.js        # WebSocket connection hook
├── utils/
│   ├── xmlParser.js           # XML parsing and clip extraction
│   ├── colorConverter.js      # Ableton Live 11 color palette
│   ├── timeConverter.js       # Time format conversions
│   ├── storage.js             # Local storage utilities
│   ├── fileLoader.js          # File loading utilities
│   └── mockData.js            # Mock data for testing
└── config/
    └── websocket.js           # WebSocket configuration
```

## 🎨 Color System

The application uses the official **Ableton Live 11 color palette** for accurate color representation:

- **Color Classification**: RGB values are analyzed to determine effort levels
- **Visual Consistency**: Colors match exactly with Ableton Live
- **Effort Mapping**: 
  - Green dominance → Low effort
  - Yellow dominance → Medium effort  
  - Red dominance → High effort
  - Dark colors → Maximum effort

## ⚡ Performance Features

- **Optimized Rendering**: React useMemo and useCallback for performance
- **Efficient Charts**: Recharts with disabled animations for smooth performance
- **Smart Limits**: Maximum 2000 histogram bars for optimal performance
- **Throttled Updates**: Cursor updates rounded to 0.1s for smooth movement
- **Memory Management**: Proper cleanup and optimization

## 🔧 Configuration

### WebSocket Settings
Configure WebSocket connection in `src/config/websocket.js`:
```javascript
export const WEBSOCKET_CONFIG = {
  URL: 'ws://localhost:9000', // Ableton Live WebSocket port
  CONNECTION_OPTIONS: {
    reconnectInterval: 3000,
    maxReconnectAttempts: 10
  }
};
```

### Storage Keys
All settings are automatically saved to browser localStorage:
- `zoomLevel`: Timeline horizontal zoom
- `timelineVerticalZoom`: Timeline vertical zoom  
- `effortZoomLevel`: Effort chart vertical zoom
- `effortHorizontalZoom`: Effort chart horizontal zoom
- `clipFontSize`: Clip text font size
- `histogramGranularity`: Histogram granularity in seconds

## 🎯 Use Cases

### Fitness Tracking
- **Workout Analysis**: Track effort levels throughout your workout
- **Zone Training**: Visualize time spent in different effort zones
- **Progress Monitoring**: Compare effort patterns across sessions

### Music Production
- **Project Analysis**: Understand the structure of your Ableton projects
- **Timeline Visualization**: See all tracks and clips at a glance
- **Real-time Monitoring**: Sync with live playback for analysis

### Educational
- **Music Structure**: Learn about song arrangement and structure
- **Timing Analysis**: Understand timing and rhythm patterns
- **Color Coding**: Learn about Ableton's color system

## 🛠️ Dependencies

### Core Dependencies
- **React 18**: Modern React with hooks
- **Recharts**: Advanced charting library
- **Tailwind CSS**: Utility-first CSS framework
- **Pako**: Gzip decompression library

### Development Dependencies
- **react-scripts**: Create React App build tools
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🌐 Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support

**Requirements**:
- FileReader API support
- WebSocket support
- ES6+ features
- Canvas/SVG support for charts

## 🔮 Future Enhancements

- **Export Functionality**: Export analysis data to CSV/JSON
- **Advanced Filtering**: Filter clips by track, color, or effort level
- **Batch Processing**: Analyze multiple projects at once
- **Custom Color Palettes**: Support for different Ableton versions
- **Audio Preview**: Play audio clips directly in the browser
- **Collaborative Features**: Share analysis with others
- **Mobile App**: React Native version for mobile devices

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues, questions, or contributions, please:
- Open an issue on GitHub
- Check the documentation
- Review existing issues

---

**Made with ❤️ for the Ableton Live community**