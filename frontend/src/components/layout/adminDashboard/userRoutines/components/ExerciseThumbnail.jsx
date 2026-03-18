import React, { useEffect, useState } from 'react';

export function ExerciseThumbnail({ path, alt, className = '', imageClassName = '' }) {
  const [hasError, setHasError] = useState(false);
  const shouldRenderImage = Boolean(path) && !hasError;

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
        <div className="flex h-full w-full items-center justify-center px-3 text-center text-[11px] uppercase tracking-[0.12em] text-gray-500">
          Sin imagen
        </div>
      )}
    </div>
  );
}
