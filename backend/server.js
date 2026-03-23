const express = require('express');
const cors = require('cors');
const http = require('node:http');

const { PORT } = require('./util');
const { registerPollRoute } = require('./routes/poll');
const { registerSseRoute } = require('./routes/sse');
const { attachWebSocket } = require('./routes/websocket');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

registerPollRoute(app);
registerSseRoute(app);
attachWebSocket(server);

server.listen(PORT, () => {
  console.log(`
🚀 Server running on http://localhost:${PORT}

Endpoints:
  📊 Polling:    GET  http://localhost:${PORT}/api/poll
  📡 SSE:        GET  http://localhost:${PORT}/api/sse
  🔌 WebSocket:  WS   ws://localhost:${PORT}/ws
`);
});
