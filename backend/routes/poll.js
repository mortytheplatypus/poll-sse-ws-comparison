const { generateResponse } = require('../util');

function registerPollRoute(app) {
  app.get('/api/poll', (req, res) => {
    console.log('[POLL] Request received');
    res.json(generateResponse());
  });
}

module.exports = { registerPollRoute };
