import React from 'react';

export function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-surface p-6 text-center shadow-2xl">
        <h3 className="text-xl font-heading font-semibold uppercase text-white">{title}</h3>
        <p className="mt-3 text-sm text-gray-400">{description}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-gray-800 bg-black/30 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
