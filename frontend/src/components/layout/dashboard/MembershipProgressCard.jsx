import React from 'react';
import { Card } from '../../ui/Card';
import {
  CalendarDays,
  CheckCircle2,
  Crown,
  Medal,
  Shield,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

const MEMBERSHIP_TIERS = [
  {
    key: 'beginner',
    minMonths: 0,
    maxMonths: 3,
    label: 'Beginner',
    badge: 'Insignia Inicial',
    icon: Shield,
    surface: 'bg-primary-dark/20',
    border: 'border-primary/40',
    accent: 'text-primary-light',
    phrase: 'Estás construyendo una base sólida. Cada sesión cuenta.',
  },
  {
    key: 'intermediate',
    minMonths: 3,
    maxMonths: 6,
    label: 'Intermediate',
    badge: 'Insignia Intermedia',
    icon: Medal,
    surface: 'bg-primary/20',
    border: 'border-primary-light/40',
    accent: 'text-primary-light',
    phrase: 'Tu constancia ya se nota. Seguimos elevando el nivel.',
  },
  {
    key: 'expert',
    minMonths: 6,
    maxMonths: 12,
    label: 'Expert',
    badge: 'Insignia Expert',
    icon: Crown,
    surface: 'bg-primary/25',
    border: 'border-primary-light/50',
    accent: 'text-primary-light',
    phrase: 'Tu disciplina es referencia. Estás compitiendo contra tu mejor versión.',
  },
  {
    key: 'master',
    minMonths: 12,
    maxMonths: Infinity,
    label: 'Master',
    badge: 'Insignia Legend',
    icon: Star,
    surface: 'bg-primary-light/20',
    border: 'border-primary-light/60',
    accent: 'text-primary-light',
    phrase: 'Entrenas con mentalidad elite. Tu progreso inspira a toda la comunidad.',
  },
];

const milestoneLabels = {
  3: 'Intermedio desbloqueado',
  6: 'Experto desbloqueado',
  12: 'Legend desbloqueado',
};

const sanitizeMonths = (membershipStatus) => {
  const rawMonths = Number(membershipStatus?.monthsActive);

  if (Number.isFinite(rawMonths) && rawMonths >= 0) {
    return Math.floor(rawMonths);
  }

  return 0;
};

const getTier = (monthsActive) =>
  MEMBERSHIP_TIERS.find(
    (tier) => monthsActive >= tier.minMonths && monthsActive < tier.maxMonths,
  ) || MEMBERSHIP_TIERS[0];

const MembershipProgressCard = ({ membershipStatus }) => {
  const monthsActive = sanitizeMonths(membershipStatus);
  const tier = getTier(monthsActive);
  const TierIcon = tier.icon;

  const milestoneReached = milestoneLabels[monthsActive];
  const planName = membershipStatus?.plan || 'Sin plan asignado';

  return (
    <Card
      className={`relative overflow-hidden border ${tier.border} ${tier.surface}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,0,0,0.2),transparent_55%)]" aria-hidden />

      <div className="relative space-y-5">
        {milestoneReached && (
          <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary-dark/35 px-3 py-2">
            <div className="flex items-center gap-2">
              <Sparkles className={`h-4 w-4 ${tier.accent}`} />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                Felicidades
              </p>
            </div>
            <p className="text-xs font-medium text-foreground">{milestoneReached}</p>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Membresia</p>
            <h3 className="text-xl font-heading font-bold text-foreground">Tu progreso de permanencia</h3>
            <p className="mt-2 text-sm text-gray-200 leading-relaxed">"{tier.phrase}"</p>
          </div>

          <div className={`rounded-xl border ${tier.border} bg-surface/90 px-3 py-2 text-right`}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Badge</p>
            <div className="mt-1 flex items-center justify-end gap-2">
              <TierIcon className={`h-4 w-4 ${tier.accent}`} />
              <span className={`text-xs font-bold uppercase ${tier.accent}`}>{tier.label}</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-300">{tier.badge}</p>
            <p className="text-[11px] text-gray-400">{monthsActive} meses activos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-primary-light/35 bg-primary-dark/35 p-3">
            <div className="mb-1 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary-light" />
              <p className="text-[10px] uppercase tracking-[0.14em] text-gray-300 font-bold">Estado de cuenta</p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {membershipStatus?.active ? 'Activa y al dia' : 'Vencida'}
            </p>
            <p className="mt-1 text-xs text-gray-300">
              {membershipStatus?.active
                ? 'Todos los beneficios habilitados.'
                : 'Renova para recuperar el acceso completo.'}
            </p>
          </div>

          <div className="rounded-xl border border-primary-light/35 bg-primary/15 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary-light" />
              <p className="text-[10px] uppercase tracking-[0.14em] text-gray-300 font-bold">Plan vigente</p>
            </div>
            <p className="text-sm font-bold text-foreground break-words">{planName}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-300">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Renovacion: {membershipStatus?.renewalDate || 'Pendiente'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MembershipProgressCard;
