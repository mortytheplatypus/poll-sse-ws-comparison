const { randomUUID } = require('node:crypto');

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
    random: randomUUID().slice(0, 8),
    serverTime: now.toISOString()
  };
}

const PUSH_INTERVAL_MS = Number(process.env.PUSH_INTERVAL_MS) || 3000;
const PORT = Number(process.env.SERVER_PORT) || 8080;

module.exports = {
  generateResponse,
  PUSH_INTERVAL_MS,
  PORT
};
