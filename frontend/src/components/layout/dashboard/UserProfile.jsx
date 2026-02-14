import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

const UserProfile = ({ user, onLogout }) => {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
            Mi Perfil
          </h1>
          <p className="text-center text-sm sm:text-base text-gray-400">
            Administra tu información personal y cuenta.
          </p>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Información Personal */}
          <Card className="bg-surface border border-gray-800 lg:col-span-3">
            <h3 className="text-xl font-heading font-bold text-foreground mb-6 pb-4 border-b border-gray-700">
              Información Personal
            </h3>
  
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-surface-light rounded-lg border border-gray-700">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold block mb-2">
                  Nombre Completo
                </label>
                <p className="text-foreground font-medium">
                  {user?.name || 'No especificado'}
                </p>
              </div>
  
              <div className="p-4 bg-surface-light rounded-lg border border-gray-700">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold block mb-2">
                  Email
                </label>
                <p className="text-foreground font-medium">
                  {user?.email || 'No especificado'}
                </p>
              </div>
  
              <div className="p-4 bg-surface-light rounded-lg border border-gray-700">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold block mb-2">
                  Teléfono
                </label>
                <p className="text-foreground font-medium">
                  No especificado
                </p>
              </div>
            </div>
  
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-700">
              <Button className="w-full text-sm uppercase font-heading py-2">
                Editar información
              </Button>
              <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2">
                Cambiar contraseña
              </Button>
            </div>
          </Card>
  
          {/* Actions Card */}
          {/* <Card className="bg-surface border border-gray-800">
            <div className="space-y-3 flex flex-col h-full">
              <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2">
                Descargar mis datos
              </Button>
              <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2">
                Preferencias de notificaciones
              </Button>
              <div className="flex-1" />
              <Button
                variant="secondary"
                className="w-full text-sm uppercase font-heading py-2 text-red-400 hover:text-red-300"
                onClick={onLogout}
              >
                🚪 Cerrar sesión
              </Button>
            </div>
          </Card> */}
        </div>
  
        {/* Información de Suscripción */}
        <Card className="bg-gradient-linear from-primary/10 to-primary/5 border border-primary/30">
          <h3 className="text-xl font-heading font-bold text-foreground mb-4">
            Tu Suscripción
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
                Plan Actual
              </p>
              <p className="text-lg font-semibold text-foreground">Premium</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
                Renovación
              </p>
              <p className="text-lg font-semibold text-foreground">15 Mar 2026</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
                Estado
              </p>
              <p className="text-lg font-semibold text-green-400">✓ Activa</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button className="flex-1 text-sm uppercase font-heading py-2">
              Ver detalles
            </Button>
            <Button variant="secondary" className="flex-1 text-sm uppercase font-heading py-2">
              Cambiar plan
            </Button>
          </div>
        </Card>
      </div>
    );
  };
  
  export default UserProfile;