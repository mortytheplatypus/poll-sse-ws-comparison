# Polling vs SSE vs WebSocket Comparison

Demo basic application to compare three real-time communication approaches: Polling, SSE, and WebSocket.

## Structure

```
pole-sse-ws/
├── backend/          # Node.js + Express server
│   ├── server.js     # API endpoints for poll, SSE, and WebSocket
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── App.js    # Main component with all three methods
│   │   └── App.css   # Styling
│   └── package.json
└── README.md
```

## Quick Start

### 1. Install

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Start

```bash
# Terminal 1 - Backend (runs on port 3001)
cd backend && npm start

# Terminal 2 - Frontend (runs on port 3000)
cd frontend && npm start
```

### 3. Open

Visit `http://localhost:3000` and click "Start" on each card to compare the methods.

## Endpoints

| Type | URL | Description |
|------|-----|-------------|
| Polling | `GET http://localhost:3001/api/poll` | Returns single JSON response |
| SSE | `GET http://localhost:3001/api/sse` | Streams events at configured interval |
| WebSocket | `ws://localhost:3001/ws` | Bi-directional connection |
| Health | `GET http://localhost:3001/health` | Server health check |

## Configuration

### Backend (`backend/server.js`)
```javascript
const PUSH_INTERVAL_MS = 3000; // SSE and WebSocket push interval
```

### Frontend (`frontend/src/App.js`)
```javascript
const POLL_INTERVAL_MS = 3000; // Polling request interval
```

## Comparison

| Feature | Polling | SSE | WebSocket |
|---------|---------|-----|-----------|
| Direction | Client → Server | Server → Client | Bi-directional |
| Connection | New request each time | Persistent | Persistent |
| Overhead | High (HTTP headers each request) | Low | Lowest |
| Browser Support | Universal | Modern browsers | Modern browsers |
| Use Case | Simple updates, legacy support | Live feeds, notifications | Chat, gaming, real-time collaboration |
