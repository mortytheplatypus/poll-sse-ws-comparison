const { generateResponse, PUSH_INTERVAL_MS } = require('../util');

function registerSseRoute(app) {
  app.get('/api/sse', (req, res) => {
    console.log('[SSE] Client connected');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Response at regular intervals
    const intervalId = setInterval(() => {
      const data = generateResponse();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, PUSH_INTERVAL_MS);

    // Initial response
    res.write(`data: ${JSON.stringify(generateResponse())}\n\n`);

    req.on('close', () => {
      console.log('[SSE] Client disconnected');
      clearInterval(intervalId);
    });
  });
}

module.exports = { registerSseRoute };
