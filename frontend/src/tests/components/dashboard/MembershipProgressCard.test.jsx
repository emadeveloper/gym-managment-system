import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import MembershipProgressCard from '../../../components/layout/dashboard/MembershipProgressCard';

describe('MembershipProgressCard', () => {
  it('shows beginner badge when monthsActive is missing', () => {
    render(
      <MembershipProgressCard
        membershipStatus={{
          active: true,
          plan: 'Premium Mensual',
          renewalDate: '15 de Marzo, 2026',
        }}
      />,
    );

    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('0 meses activos')).toBeInTheDocument();
  });

  it('shows milestone congratulations for exact milestone month', () => {
    render(
      <MembershipProgressCard
        membershipStatus={{
          active: true,
          plan: 'Premium Mensual',
          renewalDate: '15 de Marzo, 2026',
          monthsActive: 6,
        }}
      />,
    );

    expect(screen.getByText('Felicidades')).toBeInTheDocument();
    expect(screen.getByText('Experto desbloqueado')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('shows expired state copy when membership is inactive', () => {
    render(
      <MembershipProgressCard
        membershipStatus={{
          active: false,
          plan: 'Premium Mensual',
          renewalDate: '15 de Marzo, 2026',
          monthsActive: 4,
        }}
      />,
    );

    expect(screen.getByText('Vencida')).toBeInTheDocument();
    expect(screen.getByText('Renova para recuperar el acceso completo.')).toBeInTheDocument();
  });

  it('falls back to no-plan text when plan is missing', () => {
    render(
      <MembershipProgressCard
        membershipStatus={{
          active: true,
          renewalDate: '15 de Marzo, 2026',
          monthsActive: 4,
        }}
      />,
    );

    expect(screen.getByText('Sin plan asignado')).toBeInTheDocument();
  });
});
