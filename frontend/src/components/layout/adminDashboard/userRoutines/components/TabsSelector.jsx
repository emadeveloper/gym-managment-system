import React from 'react';

export function TabsSelector({ tabs, activeTab, onChange }) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`rounded-2xl border p-4 text-center transition-colors ${
              active
                ? 'border-primary/40 bg-primary/10 text-white'
                : 'border-gray-800 bg-surface text-gray-300 hover:border-primary/30 hover:text-white'
            }`}
          >
            <Icon className="mx-auto h-5 w-5" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em]">{tab.label}</p>
          </button>
        );
      })}
    </section>
  );
}
