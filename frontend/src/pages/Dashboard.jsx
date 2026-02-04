import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';

import DashboardOverview from '../components/layout/DashboardOverview';
import MyRoutines from '../components/layout/MyRoutines';
import MyClasses from '../components/layout/MyClasses';
import UserProfile from '../components/layout/UserProfile';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: '📊',
      description: 'Tu resumen personal',
    },
    {
      id: 'routines',
      label: 'Mis Rutinas',
      icon: '💪',
      description: 'Tus entrenamientos',
    },
    {
      id: 'classes',
      label: 'Clases',
      icon: '🎯',
      description: 'Clases disponibles',
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: '👤',
      description: 'Tus datos',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={user} />;
      case 'routines':
        return <MyRoutines user={user} />;
      case 'classes':
        return <MyClasses user={user} />;
      case 'profile':
        return <UserProfile user={user} onLogout={handleLogout} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  return (
    <div id='dashboard' className="min-h-screen bg-background text-foreground"> 
      {/* FLEX CONTAINER - Sidebar + Contenido */}
      <div className="flex flex-col lg:flex-row">
        
        {/* SIDEBAR - Solo visible en desktop (lg:) */}
        <DashboardSidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-h-screen">
          
          {/* TABS HORIZONTALES - Solo visible en mobile (hidden lg:) */}
          <div className="lg:hidden border-b border-gray-800 bg-surface sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 whitespace-nowrap font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-400 hover:text-foreground'
                    }`}
                  >
                    <span className="mr-1">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENIDO DE LA SECCIÓN ACTIVA */}
          <div
            key={activeTab}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 animate-fadeIn"
          >
            {renderContent()}
          </div>
        </main>
      </div>

      {/* FOOTER - Siempre visible abajo */}
      <footer className="border-t border-gray-800 bg-surface mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-400">
            <p>&copy; 2026 La Resistencia. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                Soporte
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Términos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
