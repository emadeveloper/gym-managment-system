import React, { forwardRef } from 'react';
import { describe, expect, it } from 'vitest';
import { normalizeEmptyStateIcon } from '../../components/layout/dashboard/emptyStateIcon.js';

describe('normalizeEmptyStateIcon', () => {
  it('returns emoji text as-is', () => {
    expect(normalizeEmptyStateIcon('🥗')).toBe('🥗');
  });

  it('wraps function component icons as React elements', () => {
    const Icon = () => React.createElement('svg', { 'aria-label': 'icon' });
    const result = normalizeEmptyStateIcon(Icon);

    expect(React.isValidElement(result)).toBe(true);
    expect(result.type).toBe(Icon);
  });

  it('wraps forwardRef icon objects as React elements', () => {
    const Icon = forwardRef(function Icon() {
      return React.createElement('svg', { 'aria-label': 'forward-ref-icon' });
    });

    const result = normalizeEmptyStateIcon(Icon);

    expect(React.isValidElement(result)).toBe(true);
    expect(result.type).toBe(Icon);
  });
});
