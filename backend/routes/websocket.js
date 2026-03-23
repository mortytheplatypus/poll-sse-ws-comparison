const { WebSocketServer } = require('ws');
const { generateResponse, PUSH_INTERVAL_MS } = require('../util');

function attachWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('[WS] Client connected');

    const intervalId = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(generateResponse()));
      }
    }, PUSH_INTERVAL_MS);

    ws.send(JSON.stringify(generateResponse()));

    ws.on('message', (message) => {
      console.log('[WS] Received:', message.toString());
      ws.send(
        JSON.stringify({
          ...generateResponse(),
          echo: message.toString()
        })
      );
    });

    ws.on('close', () => {
      console.log('[WS] Client disconnected');
      clearInterval(intervalId);
    });
  });

  return wss;
}

module.exports = { attachWebSocket };
