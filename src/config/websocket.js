/**
 * WebSocket configuration
 */
export const WEBSOCKET_CONFIG = {
  // Default WebSocket server URL
  DEFAULT_URL: 'ws://localhost:10000',
  
  // Connection options
  CONNECTION_OPTIONS: {
    maxReconnectAttempts: 5,
    reconnectInterval: 3000,
  },
  
  // Message types
  MESSAGE_TYPES: {
    TIME_UPDATE: 'timeUpdate',
    ERROR: 'error',
    CONNECTION_STATUS: 'connectionStatus'
  }
};

/**
 * Get WebSocket URL from environment or use default
 */
export const getWebSocketUrl = () => {
  return process.env.REACT_APP_WEBSOCKET_URL || WEBSOCKET_CONFIG.DEFAULT_URL;
};
