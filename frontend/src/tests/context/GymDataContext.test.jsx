import React, { useState } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GymDataProvider, useGymData } from '../../context/GymDataContext';

const mockGetMineSubscription = vi.fn();
const mockStartCheckout = vi.fn();
const mockGetMineRoutines = vi.fn();
const mockGetMineNutritionPlans = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      email: 'member@example.com',
      role: 'USER',
      name: 'Member Example',
    },
  }),
}));

vi.mock('../../services/api', () => ({
  authAPI: {},
  userAPI: {},
  exercisesAPI: {
    getAll: vi.fn(),
  },
  nutritionTemplatesAPI: {
    getAll: vi.fn(),
    assign: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
  routineTemplatesAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    clone: vi.fn(),
    assign: vi.fn(),
  },
  routinesAPI: {
    getMine: mockGetMineRoutines,
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  nutritionPlansAPI: {
    getMine: mockGetMineNutritionPlans,
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  billingSubscriptionsAPI: {
    getMine: mockGetMineSubscription,
    startCheckout: mockStartCheckout,
  },
}));

function MembershipConsumer() {
  const { membershipStatus, membershipLoading, startMembershipCheckout } = useGymData();
  const [checkoutUrl, setCheckoutUrl] = useState('');

  return (
    <div>
      <p>{membershipLoading ? 'loading' : 'ready'}</p>
      <p>{membershipStatus?.plan || 'none'}</p>
      <p>{membershipStatus?.renewalDate || 'pending'}</p>
      <p>{String(membershipStatus?.active)}</p>
      <button
        type="button"
        onClick={async () => {
          const nextCheckoutUrl = await startMembershipCheckout('monthly-standard');
          setCheckoutUrl(nextCheckoutUrl || '');
        }}
      >
        checkout
      </button>
      <p>{checkoutUrl || 'no-checkout-url'}</p>
    </div>
  );
}

describe('GymDataContext membership integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockGetMineRoutines.mockResolvedValue({ data: [] });
    mockGetMineNutritionPlans.mockResolvedValue({ data: [] });
    mockGetMineSubscription.mockResolvedValue({
      data: {
        subscriptionId: 'sub-1',
        plan: 'Membresia mensual',
        active: true,
        status: 'ACTIVE',
        renewalDate: '2026-05-01T00:00:00Z',
        monthsActive: 3,
        paymentMethod: 'Mercado Pago',
      },
    });
    mockStartCheckout.mockResolvedValue({
      data: {
        checkoutUrl: 'https://mp.example/checkout',
      },
    });
  });

  it('loads membership status from the backend and exposes checkout starter', async () => {
    render(
      <GymDataProvider>
        <MembershipConsumer />
      </GymDataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Membresia mensual')).toBeInTheDocument();
    });

    expect(screen.getByText('01 de mayo de 2026')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'checkout' }));

    await waitFor(() => {
      expect(mockStartCheckout).toHaveBeenCalledWith({ planCode: 'monthly-standard' });
      expect(screen.getByText('https://mp.example/checkout')).toBeInTheDocument();
    });
  });
});
