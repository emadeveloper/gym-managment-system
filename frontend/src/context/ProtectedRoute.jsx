import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ requiredRole, component: Component }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-red-500 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-400 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Tu rol actual: <span className="font-semibold text-gray-300">{user.role || 'SIN ROL'}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Rol requerido: <span className="font-semibold text-gray-300">{requiredRole}</span>
          </p>
          <a
            href="/home"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-heading uppercase hover:bg-red-700 transition-colors"
          >
            Volver al Home
          </a>
        </div>
      </div>
    );
  }

  return React.createElement(Component);
};

export default ProtectedRoute;
