import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardOverview from '../../../components/layout/dashboard/DashboardOverview';

function renderOverview(props = {}) {
  return render(
    <MemoryRouter>
      <DashboardOverview {...props} />
    </MemoryRouter>,
  );
}

describe('DashboardOverview', () => {
  it('renders welcome with authenticated user name', () => {
    renderOverview({ user: { name: 'Lucia Perez' } });

    expect(
      screen.getByRole('heading', { name: /La Resistencia te saluda, Lucia Perez/i }),
    ).toBeInTheDocument();
  });

  it('renders fallback athlete name when user is missing', () => {
    renderOverview();

    expect(
      screen.getByRole('heading', { name: /La Resistencia te saluda, Atleta/i }),
    ).toBeInTheDocument();
  });

  it('renders fallback motivational phrase when there is no assigned routine', () => {
    renderOverview({
      user: { name: 'Lucia Perez' },
      dashboardData: {
        currentRoutine: null,
      },
    });

    expect(
      screen.getByText(
        'Cada progreso empieza con una decisión firme: volver a entrenar.',
      ),
    ).toBeInTheDocument();
  });

  it('uses checkout action copy when membership is inactive', () => {
    const onMembershipAction = vi.fn();

    renderOverview({
      user: { name: 'Lucia Perez' },
      dashboardData: {
        membershipStatus: {
          active: false,
          plan: 'Sin plan asignado',
          status: 'EXPIRED',
        },
      },
      onMembershipAction,
      membershipActionLabel: 'Activar membresía',
    });

    const actionButton = screen.getByRole('button', { name: 'Activar membresía' });
    fireEvent.click(actionButton);

    expect(onMembershipAction).toHaveBeenCalledTimes(1);
  });
});
