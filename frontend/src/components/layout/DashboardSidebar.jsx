import React from 'react';

/**
 * DashboardSidebar
 * Visible ONLY on desktop (lg:)
 **/
const DashboardSidebar = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <aside className="hidden lg:block w-64 bg-surface border-r border-gray-800 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <nav className="p-6 space-y-2">
        {/* Header del Sidebar */}
        {/* Items de navegación */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
              activeTab === tab.id
                ? 'bg-gradient-to-linear from-primary/20 to-primary/10 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                : 'text-gray-400 hover:text-foreground hover:bg-surface-light border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <span
                className={`text-xl transition-transform group-hover:scale-110 ${
                  activeTab === tab.id ? 'scale-110' : ''
                }`}
              >
                {tab.icon}
              </span>

              {/* Texto */}
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">
                  {tab.label}
                </p>
                <p
                  className={`text-xs transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary/70'
                      : 'text-gray-500'
                  }`}
                >
                  {tab.description}
                </p>
              </div>

              {/* Indicador de tab activo */}
              {activeTab === tab.id && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          </button>
        ))}
      </nav>

      {/* Footer info del sidebar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800 bg-surface/50 backdrop-blur">
        <p className="text-xs text-gray-500 text-center">
          La Resistencia © 2026
        </p>
      </div>
    </aside>
  );
};

export default DashboardSidebar;