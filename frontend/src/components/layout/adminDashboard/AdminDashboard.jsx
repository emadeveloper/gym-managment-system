import React, { Suspense, lazy, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const UsersManagement = lazy(() => import('./users/UsersManagement'));
const RoutinesManagement = lazy(() => import('./userRoutines/RoutinesManagement'));
const NutritionManagement = lazy(() => import('./userNutrition/NutritionManagement'));
const ClassesManagement = lazy(() => import('./userClasses/ClassesManagement'));
const Analytics = lazy(() => import('./analytics/Analytics'));

function AdminTabFallback() {
  return (
    <div className="rounded-3xl border border-gray-800 bg-surface p-8 text-sm uppercase tracking-[0.18em] text-gray-400">
      Cargando módulo
    </div>
  );
}

/**
 * ADMIN DASHBOARD - Componente Principal
 * 
 * Estructura:
 * - Sidebar (desktop) + Header (mobile)
 * - Tabs en switch/case
 * - Misma arquitectura que User Dashboard
 */
export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('users');

  // Verificar que sea ADMIN
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-red-500 mb-4 pb-2">
            ❌ Acceso Denegado
          </h1>
          <p className="text-gray-400 mb-6 pb-3">
            Solo administradores pueden acceder a esta sección.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-primary text-white rounded-lg font-heading uppercase hover:bg-red-700 transition-colors"
          >
            Volver al Home
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Configuración de tabs del admin
  const tabs = [
    {
      id: 'users',
      label: 'Usuarios',
      icon: '👥',
      description: 'Gestión de usuarios',
    },
    {
      id: 'routines',
      label: 'Rutinas',
      icon: '💪',
      description: 'Gestión de rutinas',
    },
    {
      id: 'nutrition',
      label: 'Nutrición',
      icon: '🥗',
      description: 'Gestión de planes nutricionales',
    },
    {
      id: 'classes',
      label: 'Clases',
      icon: '📅',
      description: 'Gestión de clases',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      description: 'Datos y análisis',
    },
  ];

  /**
   * Renderiza el contenido según el tab activo
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersManagement />;
      case 'routines':
        return <RoutinesManagement />;
      case 'nutrition':
        return <NutritionManagement />;
      case 'classes':
        return <ClassesManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <UsersManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* HEADER MOBILE - Solo mobile */}
      <AdminHeader
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        user={user}
      />

      {/* FLEX CONTAINER - Sidebar + Content */}
      <div className="flex min-w-0">
        
        {/* SIDEBAR DESKTOP - Solo desktop */}
        <AdminSidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          user={user}
        />

        {/* MAIN CONTENT AREA */}
        <main className="min-w-0 flex-1 min-h-screen">
          {/* Contenido con animación */}
          <div
            key={activeTab}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 animate-fadeIn"
          >
            <Suspense fallback={<AdminTabFallback />}>
              {renderContent()}
            </Suspense>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-400">
            <p>&copy; 2026 La Resistencia - Admin Panel. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                Documentación
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Soporte
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

export default AdminDashboard;
