# Polling vs SSE vs WebSocket Comparison

A simple server to compare three different real-time communication approaches.

## Setup

```bash
npm install
npm start
# or for development with auto-reload:
npm run dev
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/poll` | Regular HTTP polling - returns single response |
| GET | `/api/sse` | Server-Sent Events - streams data every 2 seconds |
| WS  | `ws://localhost:3001/ws` | WebSocket - bi-directional, sends data every 2 seconds |
| GET | `/health` | Health check endpoint |

## Response Format

All endpoints return:
```json
{
  "timestamp": "Saturday, January 31, 2026 at 10:30:45 AM",
  "random": "abc123",
  "serverTime": "2026-01-31T10:30:45.000Z"
}
```

## Port

Default port is `3001`. Override with `PORT` environment variable.
