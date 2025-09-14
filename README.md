# Ableton Live File Reader

A React application for reading and analyzing Ableton Live files (.als). This application allows you to upload .als files, decompress their gzipped XML content, and preview the XML structure.

## Features

- **File Upload**: Drag and drop or click to select .als files
- **Gzip Decompression**: Automatically decompresses the gzipped XML content using the pako library
- **XML Preview**: Shows the first 1000 characters of the XML content in a scrollable box
- **Console Logging**: Logs the complete XML content to the browser console
- **Responsive Design**: Works on desktop and mobile devices
- **Modular Architecture**: Easy to extend for future features like parsing, visualization, etc.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── App.jsx              # Main application component
├── App.css              # Application styles
├── index.js             # Application entry point
└── components/
    └── FileUploader.jsx # File upload and processing component
```

## How It Works

1. **File Selection**: The user selects a .als file through the file input
2. **File Reading**: The file is read as an ArrayBuffer using FileReader
3. **Decompression**: The gzipped content is decompressed using the pako library
4. **XML Conversion**: The decompressed data is converted to a UTF-8 string
5. **Display**: The first 1000 characters are shown in a preview box
6. **Console Output**: The complete XML is logged to the browser console

## Dependencies

- **React**: UI framework
- **pako**: Gzip decompression library
- **react-scripts**: Build tools and development server

## Future Extensions

The modular architecture makes it easy to add:
- XML parsing and structure analysis
- Data visualization (charts, graphs)
- Export functionality
- Batch file processing
- Advanced filtering and search

## Browser Compatibility

This application works in all modern browsers that support:
- FileReader API
- ArrayBuffer
- TextDecoder
- ES6+ features
