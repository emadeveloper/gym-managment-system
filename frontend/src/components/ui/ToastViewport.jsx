import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';

const toneClasses = {
  success: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100',
  error: 'border-red-500/45 bg-red-500/15 text-red-100',
  info: 'border-primary/45 bg-primary/15 text-foreground',
};

const iconByType = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

export function ToastViewport({ toasts, onDismiss }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[100] flex flex-col gap-3 px-4 sm:inset-x-auto sm:right-6 sm:w-[360px] sm:px-0">
      {toasts.map((toast) => {
        const Icon = iconByType[toast.type] || Info;

        return (
          <article
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-sm ${toneClasses[toast.type] || toneClasses.info}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />

              <div className="min-w-0 flex-1">
                {toast.title ? (
                  <p className="text-sm font-heading font-bold uppercase tracking-[0.08em]">{toast.title}</p>
                ) : null}
                <p className="text-sm text-current/90">{toast.message}</p>
              </div>

              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-full p-1 text-current/70 transition-colors hover:bg-white/10 hover:text-current"
                aria-label="Cerrar notificación"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
