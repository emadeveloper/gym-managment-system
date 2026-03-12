import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContext } from './toast-context';
import { ToastViewport } from '../components/ui/ToastViewport';

const DEFAULT_DURATION = 3200;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    ({
      title,
      message,
      type = 'info',
      duration = DEFAULT_DURATION,
    }) => {
      if (!message) {
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast = { id, title, message, type };

      setToasts((current) => [...current, toast]);

      const timeoutId = window.setTimeout(() => {
        dismissToast(id);
      }, duration);

      timeoutRefs.current.set(id, timeoutId);
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timeoutRefs.current;

    return () => {
      timers.forEach((timeoutId) => clearTimeout(timeoutId));
      timers.clear();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      dismissToast,
      success: (message, title = 'Listo') => showToast({ title, message, type: 'success' }),
      error: (message, title = 'Atención') => showToast({ title, message, type: 'error' }),
      info: (message, title = 'Info') => showToast({ title, message, type: 'info' }),
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
