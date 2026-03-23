import { useState, useRef, useCallback, useEffect } from 'react';
import { WS_URL } from '../config';

export function useWebSocket() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const wsRef = useRef(null);

  const reset = useCallback(() => {
    stop();
    setCount(0);
    setData(null);
  })

  const stop = useCallback(() => {
    setActive(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setActive(true);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setData(payload);
      setCount((c) => c + 1);
    };

    ws.onerror = (err) => {
      console.error('WS error:', err);
    };

    ws.onclose = () => {
      setActive(false);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return { data, active, count, start, stop, reset };
}
