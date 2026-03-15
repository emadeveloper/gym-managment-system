import { Mail, UserRound } from 'lucide-react';

const ActiveSessionCard = ({ user, className = '' }) => {
  const displayName = user?.name?.trim() || user?.email || 'Usuario';
  const displayEmail = user?.email || 'Sin email registrado';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

  return (
    <section className={`rounded-2xl border border-gray-700 bg-surface-light p-4 ${className}`}>
      <div className="mb-3 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-heading font-bold uppercase tracking-[0.14em] text-primary">
        Sesión activa
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-sm font-bold uppercase text-white">
          {initials || <UserRound className="h-4 w-4" aria-hidden="true" />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
          <div className="mt-1 inline-flex max-w-full items-center gap-1.5 text-xs text-gray-400">
            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{displayEmail}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActiveSessionCard;
