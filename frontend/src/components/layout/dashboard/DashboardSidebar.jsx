import React from 'react';
import { Button } from '../../ui/Button';
import Logo from '../../../docs/img/la-resistencia-logo-2.jpg';
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

const DashboardSidebar = ({ tabs, activeTab, setActiveTab, onLogout, user }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-gray-800 sticky top-0 h-screen overflow-y-auto">
      {/* HEADER - Logo/Branding */}
      <div className="p-6 border-b border-gray-700">
        <img src={Logo} alt="La-Resistencia-logo-2" className="rounded-full" />
        <p className="text-xs text-gray-500 mt-1 pt-2 text-center">
          Home de entrenamiento
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-4 pb-3 border-b border-gray-700">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
            Navegación
          </p>
        </div>

        {tabs.map((tab) => {
          const IconComponent = ICON_MAP[tab.id];
          const isActive = activeTab === tab.id;
          const tabLabel = tab.id === 'overview' ? 'Home' : tab.label;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-none font-medium transition-all duration-200 flex items-center gap-3 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-foreground hover:bg-surface-light'
              }`}
            >
              {IconComponent && (
                <IconComponent
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-current'
                  }`}
                />
              )}
              <span className="font-semibold text-sm truncate">{tabLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-gray-700 p-6 space-y-4">
        <ActiveSessionCard user={user} />

        <Button
          variant="secondary"
          className="w-full text-sm uppercase font-heading py-2 justify-center text-black hover:text-white hover:bg-primary border border-black"
          onClick={onLogout}
        >
          Cerrar sesión
        </Button>

        <p className="text-xs text-gray-600 text-center pt-2">
          © 2026 La Resistencia
        </p>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
