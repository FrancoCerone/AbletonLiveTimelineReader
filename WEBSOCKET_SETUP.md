# WebSocket Setup per Ableton Live Integration

## Panoramica

L'applicazione ora include un cursore in tempo reale che si muove sulla timeline sincronizzato con Ableton Live tramite WebSocket.

## Configurazione

### 1. Server WebSocket

Il server WebSocket deve essere in ascolto su `ws://localhost:8080` e inviare messaggi nel formato:

```javascript
{
  "currentTime": "00:01:23.456",
  "smpteTime": {
    "hours": 0,
    "minutes": 1,
    "seconds": 23,
    "frames": 456
  }
}
```

### 2. Configurazione URL

L'URL del WebSocket può essere configurato tramite variabile d'ambiente:

```bash
# Nel file .env
REACT_APP_WEBSOCKET_URL=ws://localhost:8080
```

Oppure modificare direttamente in `src/config/websocket.js`.

## Funzionalità

### Cursore Timeline
- **Linea verticale rossa** che si muove in tempo reale
- **Etichetta temporale** in alto che mostra il tempo corrente
- **Triangolo playhead** in basso
- **Animazione pulse** per maggiore visibilità

### Indicatori di Stato
- **Indicatore di connessione** nell'header della timeline
- **Messaggi di errore** se la connessione fallisce
- **Riconnessione automatica** con retry limitato

### Formato Tempo
- **SMPTE**: `HH:MM:SS.FFF` (ore:minuti:secondi.frame)
- **Conversione automatica** in posizione timeline
- **Sincronizzazione** con il range temporale dei clip

## Struttura Codice

```
src/
├── hooks/
│   └── useWebSocket.js          # Hook per gestione WebSocket
├── utils/
│   └── timeConverter.js         # Conversioni tempo SMPTE
├── components/
│   ├── TimelineCursor.jsx       # Componente cursore
│   └── Timeline.jsx             # Timeline con cursore integrato
└── config/
    └── websocket.js             # Configurazione WebSocket
```

## Test

1. **Avvia il server Ableton Live** con WebSocket su porta 8080
2. **Carica un file .als** o usa i dati demo
3. **Verifica la connessione** nell'indicatore di stato
4. **Osserva il cursore** muoversi in tempo reale

## Troubleshooting

### Cursore non si muove
- Verifica che il server WebSocket sia attivo
- Controlla la console per errori di connessione
- Assicurati che il formato dei messaggi sia corretto

### Connessione fallisce
- Verifica l'URL del WebSocket
- Controlla che la porta 8080 sia libera
- Verifica i firewall e le impostazioni di rete

### Tempo non sincronizzato
- Verifica il formato SMPTE nei messaggi
- Controlla che il range temporale sia corretto
- Assicurati che i frame rate siano consistenti (30fps)
