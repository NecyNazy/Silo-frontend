import { useEffect, useRef, useState } from 'react';

export type SseStatus = 'connecting' | 'open' | 'error';

const BACKOFF_STEPS_MS = [1000, 2000, 5000, 10000];

export function useSse<T>(url: string | null, onMessage: (data: T) => void) {
  const [status, setStatus] = useState<SseStatus>('connecting');
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (!url) return;

    let cancelled = false;
    let source: EventSource | null = null;

    function connect() {
      setStatus('connecting');
      source = new EventSource(url as string);

      source.onopen = () => {
        if (cancelled) return;
        attemptRef.current = 0;
        setStatus('open');
      };

      source.onmessage = (event) => {
        if (cancelled) return;
        try {
          onMessageRef.current(JSON.parse(event.data) as T);
        } catch {
          return;
        }
      };

      source.onerror = () => {
        if (cancelled) return;
        setStatus('error');
        source?.close();
        const delay = BACKOFF_STEPS_MS[Math.min(attemptRef.current, BACKOFF_STEPS_MS.length - 1)];
        attemptRef.current += 1;
        timerRef.current = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      cancelled = true;
      source?.close();
      clearTimeout(timerRef.current);
    };
  }, [url]);

  return { status };
}
