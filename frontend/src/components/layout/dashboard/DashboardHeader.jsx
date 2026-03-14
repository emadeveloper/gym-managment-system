import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import Logo from '../../../docs/img/la-resistencia-logo-1.jpg';
import ActiveSessionCard from './ActiveSessionCard';
import {
  Home,
  Dumbbell,
  Salad,
  Calendar,
  User,
} from 'lucide-react';

const ICON_MAP = {
  overview: Home,
  routines: Dumbbell,
  nutrition: Salad,
  classes: Calendar,
  profile: User,
};

const DashboardHeader = ({ tabs, activeTab, setActiveTab, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="lg:hidden sticky top-0 left-0 right-0 z-50 bg-background border-b border-gray-800">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-foreground transition-colors hover:text-primary"
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

          <div className="flex-1 flex justify-center">
            <img
              src={Logo}
              alt="La-Resistencia-Logo-1"
              className="h-16 w-auto rounded-full object-contain cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/30 text-sm font-bold text-primary uppercase">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
            style={{ top: '64px' }}
            aria-hidden
          />

          <div className="lg:hidden fixed left-0 top-16 w-80 max-w-[85vw] h-[calc(100vh-64px)] bg-surface border-r border-gray-800 z-40 overflow-y-auto">
            <nav className="p-4 space-y-1">
              <div className="p-4 border-b border-gray-700">
                <img
                  src={Logo}
                  alt="La-Resistencia-logo-2"
                  className="rounded-full"
                />
                <p className="text-xs text-gray-500 mt-1 pt-2 text-center">
                  Home de entrenamiento
                </p>
              </div>

              {tabs.map((tab, index) => {
                const IconComponent = ICON_MAP[tab.id];
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-none font-medium transition-all duration-200 flex items-center gap-3 ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:text-foreground hover:bg-surface-light'
                    }`}
                    style={{
                      transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                    }}
                  >
                    {IconComponent && (
                      <IconComponent
                        className={`w-5 h-5 shrink-0 ${
                          isActive ? 'text-white' : 'text-current'
                        }`}
                      />
                    )}
                    <span className="font-semibold text-sm">{tab.label}</span>
                  </button>
                );
              })}

              <div className="my-4 border-t border-gray-700" />

              <ActiveSessionCard user={user} />

              <Button
                variant="secondary"
                className="w-full text-sm uppercase font-heading py-2 mt-2 justify-center text-black hover:text-white hover:bg-primary border border-black"
                onClick={onLogout}
              >
                Cerrar sesión
              </Button>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-surface/50 backdrop-blur">
              <p className="text-xs text-gray-600 text-center">
                © 2026 La Resistencia
              </p>
            </div>
          </div>
        </>
      )}

      <div className="lg:hidden h-16" />
    </>
  );
};

export default DashboardHeader;
