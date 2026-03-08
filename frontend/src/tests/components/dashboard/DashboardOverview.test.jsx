import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardOverview from '../../../components/layout/dashboard/DashboardOverview';

describe('DashboardOverview', () => {
  it('renders welcome with backend user name', () => {
    render(<DashboardOverview user={{ name: 'Lucia Perez' }} />);

    expect(screen.getByRole('heading', { name: /Bienvenido Lucia Perez/i })).toBeInTheDocument();
  });

  it('renders fallback welcome name when user is missing', () => {
    render(<DashboardOverview />);

    expect(screen.getByRole('heading', { name: /Bienvenido Emanuel Martinez/i })).toBeInTheDocument();
  });

  it('renders today workout message from assigned routine data', () => {
    render(<DashboardOverview user={{ name: 'Lucia Perez' }} />);

    expect(screen.getAllByText('Hoy toca Pecho y tríceps.').length).toBeGreaterThan(0);
  });

  it('renders alternative message when there is no assigned routine', () => {
    render(
      <DashboardOverview
        user={{ name: 'Lucia Perez' }}
        dashboardData={{
          currentRoutine: null,
        }}
      />,
    );

    expect(
      screen.getByText('Hoy no tenés una rutina asignada. Hablá con tu entrenador para activarla.'),
    ).toBeInTheDocument();
  });

  it('renders top cards from dashboard data overrides', () => {
    render(
      <DashboardOverview
        user={{ name: 'Lucia Perez' }}
        dashboardData={{
          currentRoutine: {
            name: 'Hipertrofia Torso/Pierna',
            daysPerWeek: 5,
            focus: 'Hipertrofia',
            todayWorkout: 'Piernas',
          },
          nutrition: {
            status: 'Plan alto en proteína',
            calories: '2400 kcal/día',
            protein: '170g proteína',
          },
          goals: ['Aumentar masa muscular en 8 semanas'],
        }}
      />,
    );

    expect(screen.getAllByText('Hipertrofia Torso/Pierna').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Plan alto en proteína').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Aumentar masa muscular en 8 semanas').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hoy toca Piernas.').length).toBeGreaterThan(0);
  });
});
