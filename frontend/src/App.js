import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const API_BASE = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001/ws';

// ===========================================
// CONFIGURATION
// ===========================================
const POLL_INTERVAL_MS = 3000; // Interval for polling requests (in ms)

export default function App() {
  // Polling state
  const [pollData, setPollData] = useState(null);
  const [pollActive, setPollActive] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollIntervalRef = useRef(null);

  // SSE state
  const [sseData, setSseData] = useState(null);
  const [sseActive, setSseActive] = useState(false);
  const [sseCount, setSseCount] = useState(0);
  const sseRef = useRef(null);

  // WebSocket state
  const [wsData, setWsData] = useState(null);
  const [wsActive, setWsActive] = useState(false);
  const [wsCount, setWsCount] = useState(0);
  const wsRef = useRef(null);

  // Polling logic
  const startPolling = useCallback(() => {
    setPollActive(true);
    setPollCount(0);
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/poll`);
        const data = await res.json();
        setPollData(data);
        setPollCount(c => c + 1);
      } catch (err) {
        console.error('Poll error:', err);
      }
    };
    poll(); // Initial fetch
    pollIntervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
  }, []);

  const stopPolling = useCallback(() => {
    setPollActive(false);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // SSE logic
  const startSSE = useCallback(() => {
    setSseActive(true);
    setSseCount(0);
    const eventSource = new EventSource(`${API_BASE}/api/sse`);
    sseRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSseData(data);
      setSseCount(c => c + 1);
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
    };
  }, []);

  const stopSSE = useCallback(() => {
    setSseActive(false);
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
  }, []);

  // WebSocket logic
  const startWS = useCallback(() => {
    setWsActive(true);
    setWsCount(0);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setWsData(data);
      setWsCount(c => c + 1);
    };

    ws.onerror = (err) => {
      console.error('WS error:', err);
    };

    ws.onclose = () => {
      setWsActive(false);
    };
  }, []);

  const stopWS = useCallback(() => {
    setWsActive(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      stopSSE();
      stopWS();
    };
  }, [stopPolling, stopSSE, stopWS]);

  return (
    <div className="App">
      <h1>Polling vs SSE vs WebSocket</h1>
      <p className="subtitle">Compare real-time communication methods</p>

      <div className="cards">
        {/* Polling Card */}
        <div className={`card ${pollActive ? 'active' : ''}`}>
          <h2>📊 Polling</h2>
          <p className="description">Client requests data every {POLL_INTERVAL_MS / 1000}s</p>
          <div className="controls">
            <button onClick={pollActive ? stopPolling : startPolling}>
              {pollActive ? 'Stop' : 'Start'}
            </button>
          </div>
          <div className="stats">
            <span className={`status ${pollActive ? 'online' : 'offline'}`}>
              {pollActive ? 'Active' : 'Inactive'}
            </span>
            <span className="count">Requests: {pollCount}</span>
          </div>
          <div className="data">
            {pollData ? (
              <>
                <div className="timestamp">{pollData.timestamp}</div>
                <div className="random">ID: {pollData.random}</div>
              </>
            ) : (
              <div className="placeholder">No data yet</div>
            )}
          </div>
        </div>

        {/* SSE Card */}
        <div className={`card ${sseActive ? 'active' : ''}`}>
          <h2>📡 SSE</h2>
          <p className="description">Server pushes data (interval set on server)</p>
          <div className="controls">
            <button onClick={sseActive ? stopSSE : startSSE}>
              {sseActive ? 'Stop' : 'Start'}
            </button>
          </div>
          <div className="stats">
            <span className={`status ${sseActive ? 'online' : 'offline'}`}>
              {sseActive ? 'Connected' : 'Disconnected'}
            </span>
            <span className="count">Messages: {sseCount}</span>
          </div>
          <div className="data">
            {sseData ? (
              <>
                <div className="timestamp">{sseData.timestamp}</div>
                <div className="random">ID: {sseData.random}</div>
              </>
            ) : (
              <div className="placeholder">No data yet</div>
            )}
          </div>
        </div>

        {/* WebSocket Card */}
        <div className={`card ${wsActive ? 'active' : ''}`}>
          <h2>🔌 WebSocket</h2>
          <p className="description">Bi-directional (interval set on server)</p>
          <div className="controls">
            <button onClick={wsActive ? stopWS : startWS}>
              {wsActive ? 'Stop' : 'Start'}
            </button>
          </div>
          <div className="stats">
            <span className={`status ${wsActive ? 'online' : 'offline'}`}>
              {wsActive ? 'Connected' : 'Disconnected'}
            </span>
            <span className="count">Messages: {wsCount}</span>
          </div>
          <div className="data">
            {wsData ? (
              <>
                <div className="timestamp">{wsData.timestamp}</div>
                <div className="random">ID: {wsData.random}</div>
              </>
            ) : (
              <div className="placeholder">No data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
