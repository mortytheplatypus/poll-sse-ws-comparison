import { DataChannelCard } from './components/DataChannelCard';
import { usePolling } from './hooks/usePolling';
import { useSSE } from './hooks/useSSE';
import { useWebSocket } from './hooks/useWebSocket';
import { POLL_INTERVAL_MS } from './config';
import './App.css';

const data = {
  polling: {
    title: "📊 Polling",
    description: `Data request every ${POLL_INTERVAL_MS / 1000}s`,
    definition: "The client sends a new HTTP request on a schedule. Each response is a normal request/response cycle. Simple to reason about, but you pay connection and header overhead on every poll, and the server cannot notify you until the next interval."
  },
  sse: {
    title: "📡 SSE",
    description: "Server pushes data (constant interval)",
    definition: "Server-Sent Events keep one long-lived HTTP connection open. The server streams events to the browser (mostly one-way: server → client). The browser uses the EventSource API. Works well through many HTTP proxies and is lighter than polling when updates are frequent."
  },
  ws: {
    title: "🔌 WebSocket",
    description: "Bi-directional (constant interval)",
    definition: "After an HTTP handshake, the connection becomes a persistent WebSocket. Both client and server can send messages anytime with very low framing overhead. Best when you need true two-way, high-frequency communication (e.g. chat, collaboration, games)."
  }
}

export default function App() {
  const poll = usePolling();
  const sse = useSSE();
  const ws = useWebSocket();

  return (
    <div className="App">
      <h1>Polling vs SSE vs WebSocket</h1>
      <p className="subtitle">Compare real-time communication methods</p>

      <div className="cards">
        <DataChannelCard
          title={data.polling.title}
          description={data.polling.description}
          definition={data.polling.definition}
          active={poll.active}
          onStart={poll.start}
          onStop={poll.stop}
          statusWhenActive="Active"
          statusWhenInactive="Inactive"
          countLabel="Requests"
          count={poll.count}
          data={poll.data}
        />
        <DataChannelCard
          title={data.sse.title}
          description={data.sse.description}
          definition={data.sse.definition}
          active={sse.active}
          onStart={sse.start}
          onStop={sse.stop}
          statusWhenActive="Connected"
          statusWhenInactive="Disconnected"
          countLabel="Messages"
          count={sse.count}
          data={sse.data}
        />
        <DataChannelCard
          title={data.ws.title}
          description={data.ws.description}
          definition={data.ws.definition}
          active={ws.active}
          onStart={ws.start}
          onStop={ws.stop}
          statusWhenActive="Connected"
          statusWhenInactive="Disconnected"
          countLabel="Messages"
          count={ws.count}
          data={ws.data}
        />
      </div>
    </div>
  );
}
