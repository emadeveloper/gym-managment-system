import React, { useEffect, useMemo, useState } from 'react';
import { Dumbbell } from 'lucide-react';

export function ExerciseThumbnail({ path, alt, className = '', imageClassName = '' }) {
  const [hasError, setHasError] = useState(false);
  const shouldRenderImage = Boolean(path) && !hasError;
  const placeholderTitle = useMemo(() => {
    if (!alt) {
      return 'Ejercicio';
    }

    return alt
      .split(' ')
      .filter(Boolean)
      .slice(0, 3)
      .join(' ');
  }, [alt]);

  useEffect(() => {
    setHasError(false);
  }, [path]);

  return (
    <div className={`overflow-hidden rounded-xl border border-gray-800 bg-black/30 ${className}`}>
      {shouldRenderImage ? (
        <img
          src={path}
          alt={alt || 'Imagen de ejercicio'}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.22),_transparent_55%),linear-gradient(180deg,_rgba(23,23,23,0.96),_rgba(10,10,10,0.98))] px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
            <Dumbbell className="h-5 w-5" />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-200">
            {placeholderTitle}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">
            Imagen pendiente
          </p>
        </div>
      )}
    </div>
  );
}
