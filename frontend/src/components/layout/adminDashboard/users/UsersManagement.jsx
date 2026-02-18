import React from 'react';
import { Card } from '../../../ui/Card';

export const UsersManagement = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
          Gestión de Usuarios 👥
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Administra y edita la información de los usuarios del gimnasio.
        </p>
      </div>

      {/* Placeholder */}
      <Card className="bg-surface border border-gray-800 p-8 text-center">
        <h2 className="text-xl font-heading font-bold text-gray-400 mb-2">
          Tabla de Usuarios
        </h2>
        <p className="text-gray-500">
          Aquí irá la tabla de usuarios con opciones de editar.
        </p>
      </Card>
    </div>
  );
};

export default UsersManagement;