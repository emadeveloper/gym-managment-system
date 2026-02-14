import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
// Importamos los iconos idóneos
import { Shield, Sword, Crown, Calendar, Zap, CheckCircle2 } from 'lucide-react';

const MembershipProgressCard = ({ membershipStatus }) => {
  const calculateUserLevel = (daysLeft) => {
    // Simulamos meses activos basado en el progreso (esto luego vendrá de tu DB)
    const daysActive = 30 - daysLeft;
    const monthsActive = 1; // Aquí deberías pasar la data real de antigüedad

    if (monthsActive < 3) {
      return {
        level: 'Recluta',
        title: 'Recluta de la Resistencia',
        icon: <Shield className="w-8 h-8 text-white-400" />,
        color: 'from-gray-600/20 to-transparent',
        borderColor: 'border-red-600/30',
        description: 'Estás forjando los cimientos de tu fuerza.',
      };
    } else if (monthsActive < 12) {
      return {
        level: 'Guerrero',
        title: 'Guerrero de la Resistencia',
        icon: <Sword className="w-8 h-8 text-orange-400" />,
        color: 'from-orange-600/20 to-transparent',
        borderColor: 'border-orange-600/30',
        description: 'El hierro ya es parte de tu rutina diaria.',
      };
    } else {
      return {
        level: 'Veterano',
        title: 'Veterano del Bastión',
        icon: <Crown className="w-8 h-8 text-primary" />,
        color: 'from-primary/20 to-transparent',
        borderColor: 'border-primary/40',
        description: 'Tu disciplina es el ejemplo de la comunidad.',
      };
    }
  };

  const userLevel = calculateUserLevel(membershipStatus.daysLeft);
  // Barra de progreso: Si faltan 10 días, llevas el 66% del mes cumplido
  const progressPercentage = Math.max(0, Math.min(100, ((30 - (membershipStatus.daysLeft % 30)) / 30) * 100));

  return (
    <Card className={`bg-gradient-to-linear ${userLevel.color} border ${userLevel.borderColor} relative overflow-hidden`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-surface rounded-xl border border-white/5 shadow-xl">
          {userLevel.icon}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Rango Actual</p>
          <h3 className="text-xl font-heading font-bold text-white italic">{userLevel.title}</h3>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6 itali pb-2">"{userLevel.description}"</p>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase">Esfuerzo Mensual</span>
          <span className="text-sm font-bold text-foreground">{membershipStatus.daysLeft} para tu próxima medalla</span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2 border border-white/5 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-black/20 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <p className="text-[10px] text-gray-500 uppercase font-bold">Estado</p>
          </div>
          <p className="text-sm font-bold text-green-400">{membershipStatus.active ? 'ACTIVO' : 'EXPIRADO'}</p>
        </div>
        <div className="p-3 bg-black/20 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-primary" />
            <p className="text-[10px] text-gray-500 uppercase font-bold">Plan</p>
          </div>
          <p className="text-sm font-bold text-white truncate">{membershipStatus.plan.split(' ')[0]}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-heading italic tracking-wider">
          GESTIONAR MEMBRESÍA
        </Button>
      </div>
    </Card>
  );
};

export default MembershipProgressCard;