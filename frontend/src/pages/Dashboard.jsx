import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import DashboardSidebar from '../components/layout/Dashboard/DashboardSidebar';
import DashboardHeader from '../components/layout/Dashboard/DashboardHeader';

import DashboardOverview from '../components/layout/dashboard/DashboardOverview';
import MyRoutines from '../components/layout/dashboard/MyRoutines';
import MyClasses from '../components/layout/Dashboard/MyClasses';
import UserProfile from '../components/layout/dashboard/UserProfile';
import Nutrition from '../components/layout/nutrition/Nutrition';

import mockNutritionData from '../components/layout/nutrition/mockNutritionData';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /**
   * ✅ CORRECTO: Los iconos son STRINGS (emojis)
   * NO componentes de React
   */
  const tabs = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: '',  // ← String emoji, NO componente
      description: 'Tu resumen personal',
    },
    {
      id: 'routines',
      label: 'Mis Rutinas',
      icon: '',  // ← String emoji, NO componente
      description: 'Tus entrenamientos',
    },
    {
      id: 'nutrition',
      label: 'Mi Nutrición',
      icon: '',  // ← String emoji, NO componente
      description: 'Tus planes de alimentación',
    },
    {
      id: 'classes',
      label: 'Clases',
      icon: '',  // ← String emoji, NO componente
      description: 'Clases disponibles',
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: '',  // ← String emoji, NO componente
      description: 'Tus datos',
    },
  ];

  /**
   * Renderiza el contenido según el tab activo
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={user} />;
      case 'routines':
        return <MyRoutines user={user} />;
      case 'classes':
        return <MyClasses user={user} />;
      case 'nutrition':
        return <Nutrition user={user} nutritionData={mockNutritionData} />
      case 'profile':
        return <UserProfile user={user} onLogout={handleLogout} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* HEADER MOBILE - only mobile (lg:hidden) */}
      <DashboardHeader
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        user={user}
      />

      {/* FLEX CONTAINER - Sidebar + Content */}
      <div className="flex">
        
        {/* SIDEBAR DESKTOP - Only desktop (hidden lg:flex) */}
        <DashboardSidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          user={user}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-h-screen">
          {/* Animation content */}
          <div
            key={activeTab}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 animate-fadeIn"
          >
            {renderContent()}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-surface">
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