import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Register } from '../../pages/Register';

const mockRegister = vi.fn();
const mockNavigate = vi.fn();
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
    loading: false,
  }),
}));

vi.mock('../../hooks/useToast', () => ({
  useToast: () => mockToast,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
}

function fillValidForm() {
  fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
    target: { value: 'newuser@example.com' },
  });

  const passwordInput = document.querySelector('input[name="password"]');
  const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');

  fireEvent.change(passwordInput, { target: { value: 'Password123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
}

describe('Register page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows warning toast and prevents submit when form is invalid', async () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(document.querySelector('input[name="password"]'), {
      target: { value: 'Password123' },
    });
    fireEvent.change(document.querySelector('input[name="confirmPassword"]'), {
      target: { value: 'Different123' },
    });

    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountButton);

    expect(mockRegister).not.toHaveBeenCalled();
    expect(mockToast.info).toHaveBeenCalledWith('Please review the highlighted fields.', 'Validation warning');
  });

  it('shows success toast and navigates to home when registration succeeds', async () => {
    mockRegister.mockResolvedValue({ success: true });

    renderRegister();
    fillValidForm();

    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('newuser@example.com', 'Password123');
      expect(mockToast.success).toHaveBeenCalledWith('Tu cuenta fue creada correctamente.', 'Cuenta creada');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error toast when backend registration fails', async () => {
    mockRegister.mockResolvedValue({ success: false, error: 'User already exists' });

    renderRegister();
    fillValidForm();

    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('User already exists', 'Atención');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('shows fallback error toast when response has no error message', async () => {
    mockRegister.mockResolvedValue({ success: false });

    renderRegister();
    fillValidForm();

    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Registration failed', 'Atención');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
