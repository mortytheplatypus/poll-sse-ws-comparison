import { useState, useRef, useCallback, useEffect } from 'react';
import { API_BASE } from '../config';

export function useSSE() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const sourceRef = useRef(null);

  const stop = useCallback(() => {
    setActive(false);
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setActive(true);
    setCount(0);
    const eventSource = new EventSource(`${API_BASE}/api/sse`);
    sourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setData(payload);
      setCount((c) => c + 1);
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
    };
  }, []);

  return { data, active, count, start, stop };
}
