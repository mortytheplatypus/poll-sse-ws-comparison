import { useState, useRef, useCallback, useEffect } from 'react';
import { API_BASE, POLL_INTERVAL_MS } from '../config';

export function usePolling() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    setActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setActive(true);
    setCount(0);
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/poll`);
        const json = await res.json();
        setData(json);
        setCount((c) => c + 1);
      } catch (err) {
        console.error('Poll error:', err);
      }
    };
    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { data, active, count, start, stop };
}
