const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);

// ===========================================
// CONFIGURATION
// ===========================================
const PUSH_INTERVAL_MS = 3000; // Interval for SSE and WebSocket pushes (in ms)

app.use(cors());
app.use(express.json());

// Helper to generate random timestamp response
function generateResponse() {
  const now = new Date();
  return {
    timestamp: now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    random: Math.random().toString(36).substring(7),
    serverTime: now.toISOString()
  };
}

// ============================================
// 1. POLLING ENDPOINT - Regular HTTP GET
// ============================================
app.get('/api/poll', (req, res) => {
  console.log('[POLL] Request received');
  res.json(generateResponse());
});

// ============================================
// 2. SSE ENDPOINT - Server-Sent Events
// ============================================
app.get('/api/sse', (req, res) => {
  console.log('[SSE] Client connected');
  
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send data at configured interval
  const intervalId = setInterval(() => {
    const data = generateResponse();
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, PUSH_INTERVAL_MS);

  // Send initial data immediately
  res.write(`data: ${JSON.stringify(generateResponse())}\n\n`);

  // Cleanup on client disconnect
  req.on('close', () => {
    console.log('[SSE] Client disconnected');
    clearInterval(intervalId);
  });
});

// ============================================
// 3. WEBSOCKET ENDPOINT
// ============================================
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('[WS] Client connected');
  
  // Send data at configured interval
  const intervalId = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(generateResponse()));
    }
  }, PUSH_INTERVAL_MS);

  // Send initial data immediately
  ws.send(JSON.stringify(generateResponse()));

  // Handle incoming messages (optional - for two-way communication demo)
  ws.on('message', (message) => {
    console.log('[WS] Received:', message.toString());
    // Echo back with timestamp
    ws.send(JSON.stringify({
      ...generateResponse(),
      echo: message.toString()
    }));
  });

  ws.on('close', () => {
    console.log('[WS] Client disconnected');
    clearInterval(intervalId);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
🚀 Server running on http://localhost:${PORT}

Endpoints:
  📊 Polling:    GET  http://localhost:${PORT}/api/poll
  📡 SSE:        GET  http://localhost:${PORT}/api/sse
  🔌 WebSocket:  WS   ws://localhost:${PORT}/ws
  ❤️ Health:     GET  http://localhost:${PORT}/health
`);
});
