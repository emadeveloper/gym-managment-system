import React from 'react';

export function normalizeEmptyStateIcon(icon) {
  if (icon == null) {
    return '📭';
  }

  if (typeof icon === 'string' || typeof icon === 'number') {
    return icon;
  }

  if (React.isValidElement(icon)) {
    return icon;
  }

  if (typeof icon === 'function' || typeof icon === 'object') {
    return React.createElement(icon, {
      className: 'h-16 w-16 text-primary',
      'aria-hidden': 'true',
    });
  }

  return '📭';
}
