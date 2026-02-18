
import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import Logo from '../../../../docs/img/la-resistencia-logo-1.jpg';

/**
 * AdminHeader
 * Header mobile con hamburger menu
 * Solo visible en mobile (lg:hidden)
 * Mismo diseño que User Dashboard
 */
const AdminHeader = ({ tabs, activeTab, setActiveTab, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* HEADER - Solo mobile */}
      <header className="lg:hidden sticky top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          
          {/* Hamburger Button - Left */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white transition-colors hover:text-primary"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                }`}
              />
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                }`}
              />
            </div>
          </button>

          {/* Logo - Center */}
          <div className="flex-1 flex justify-center">
            <img 
              src={Logo} 
              alt="La-Resistencia-Logo" 
              className='h-16 w-auto rounded-full object-contain cursor-pointer' 
            />
          </div>

          {/* Admin Badge - Right */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/30 text-sm font-bold text-primary uppercase" title="Administrador">
            👑
          </div>
        </div>
      </header>

      {/* MENU OVERLAY */}
      {isMenuOpen && (
        <>
          {/* Dark Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
            style={{ top: '64px' }}
          />

          {/* Menu Panel */}
          <div className="lg:hidden fixed left-0 top-16 w-80 max-w-[80vw] h-[calc(100vh-64px)] bg-surface border-r border-gray-800 z-40 overflow-y-auto">

            {/* Menu Items */}
            <nav className="p-4 space-y-2">
              
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <img 
                  src={Logo} 
                  alt="La-Resistencia-logo" 
                  className='rounded-full' 
                />
                <p className="text-xs text-gray-500 mt-1 pt-2 text-center">
                  Panel de Administrador
                </p>
              </div>

              {/* Navigation Items */}
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30'
                      : 'text-gray-400 hover:text-foreground hover:bg-surface-light border border-transparent'
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tab.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{tab.label}</p>
                      <p className="text-xs text-gray-500">{tab.description}</p>
                    </div>
                  </div>
                </button>
              ))}

              {/* Separator */}
              <div className="my-4 border-t border-gray-700" />

              {/* User Info */}
              <div className="p-6 bg-surface-light rounded-lg border border-gray-700">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-3">
                  Sesión Administrativa
                </p>
                <p className="text-sm font-semibold text-foreground truncate pt-2">
                  {user?.name || 'Administrador'}
                </p>
                <p className="text-xs text-gray-400 truncate mt-2 pt-1">
                  {user?.email}
                </p>
                <p className="text-xs text-primary mt-2 font-semibold">
                  👑 Rol: ADMIN
                </p>
              </div>

              {/* Logout Button */}
              <Button
                variant="secondary"
                className="w-full text-sm uppercase font-heading py-2 mt-4 justify-center text-black hover:text-white hover:bg-primary border border-black"
                onClick={onLogout}
              >
                🚪 Cerrar sesión
              </Button>
            </nav>

            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-surface/50 backdrop-blur">
              <p className="text-xs text-gray-600 text-center">
                © 2026 La Resistencia Admin
              </p>
            </div>
          </div>
        </>
      )}

      {/* Spacer - Prevenir que header oculte contenido */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default AdminHeader;