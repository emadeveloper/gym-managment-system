import React from 'react';
import { Button } from '../../../ui/Button';
import Logo from '../../../../docs/img/la-resistencia-logo-1.jpg';

/**
 * AdminSidebar
 * Navegación lateral - Solo visible en desktop (lg:)
 * Mismo diseño que User Dashboard
 */
const AdminSidebar = ({ tabs, activeTab, setActiveTab, onLogout, user }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-gray-800 sticky top-0 h-screen overflow-y-auto">

      {/* HEADER - Logo/Branding */}
      <div className="p-6 border-b border-gray-700">
        <img src={Logo} alt="La-Resistencia-logo" className='rounded-full' />
        <p className="text-xs text-gray-500 mt-3 pt-2 text-center font-semibold">
          Panel de Administrador
        </p>
        <p className="text-xs text-gray-600 mt-1 text-center">
          v1.0
        </p>
      </div>

      {/* NAVIGATION - Flexible en el medio */}
      <nav className="flex-1 p-6 space-y-2">
        {/* Section Title */}
        <div className="mb-6 pb-4 border-b border-gray-700">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
            Módulos
          </p>
        </div>

        {/* Tab Items */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
              activeTab === tab.id
                ? 'bg-gradient-to-linear from-primary/20 to-primary/10 text-primary border border-primary/30'
                : 'text-gray-400 hover:text-foreground hover:bg-surface-light border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              
              {/* Icon */}
              {tab.icon && (
                <span
                  className={`text-xl transition-all duration-200 ${
                    activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  {tab.icon}
                </span>
              )}

              {/* Text */}
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">
                  {tab.label}
                </p>
                <p
                  className={`text-xs transition-colors ${
                    activeTab === tab.id ? 'text-primary/70' : 'text-gray-500'
                  }`}
                >
                  {tab.description}
                </p>
              </div>

              {/* Indicator */}
              {activeTab === tab.id && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          </button>
        ))}
      </nav>

      {/* FOOTER - User info y Logout (Sticky) */}
      <div className="border-t border-gray-700 p-6 space-y-4">

        {/* Info del usuario */}
        <div className="p-3 bg-surface-light rounded-lg border border-gray-700">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
            Sesión Administrativa
          </p>
          <p className="text-sm font-semibold text-foreground truncate">
            {user?.name || 'Administrador'}
          </p>
          <p className="text-xs text-gray-400 truncate mt-1">
            {user?.email}
          </p>
          <p className="text-xs text-primary mt-2 font-semibold">
            👑 Rol: ADMIN
          </p>
        </div>

        {/* Logout Button */}
        <Button
          variant="secondary"
          className="w-full text-sm uppercase font-heading py-2 justify-center text-black hover:text-white hover:bg-primary border border-black"
          onClick={onLogout}
        >
          🚪 Cerrar sesión
        </Button>

        {/* Copyright */}
        <p className="text-xs text-gray-600 text-center pt-2">
          © 2026 La Resistencia
        </p>
      </div>
    </aside>
  );
};

export default AdminSidebar;