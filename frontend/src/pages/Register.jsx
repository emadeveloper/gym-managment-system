import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import Logo from "../docs/img/la-resistencia-logo-1.jpg"

export function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setServerError('');
    
    const result = await register(formData.email, formData.password);
    
    if (result.success) {
      // Auto-login after successfull register
      navigate('/dashboard');
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-4 sm:px-6 py-2 sm:py-8 lg:py-2">
      {/* Logo */}
      <div className="mb-2 sm:mb-4 lg:mb-3 flex justify-center">
        <Link to="/home">
          <img 
            src={Logo} 
            alt="La Resistencia Logo" 
            className="h-30 sm:h-30 md:h-30 lg:h-40 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Card */}
      <Card className="w-full max-w-sm sm:max-w-lg lg:max-w-md bg-surface shadow-2xl border border-mid-gray/20">
        <div className="text-center mb-3 sm:mb-5 lg:mb-4">
          <h1 className="text-3xl sm:text-3xl lg:text-2xl font-heading text-foreground uppercase tracking-tight">
            Create Account
          </h1>
          <p className="text-secondary-text mt-1 lg:mt-0.5 text-base sm:text-base lg:text-sm text-foreground">
            Sign up to get started
          </p>
        </div>

        {serverError && (
          <div className="mb-2.5 sm:mb-4 lg:mb-3 p-2.5 sm:p-3 lg:p-2.5 bg-gym-red/10 border border-gym-red rounded-lg">
            <p className="text-sm sm:text-sm lg:text-xs text-gym-red font-medium">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4 lg:space-y-3">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
            className="text-base sm:text-base"
          />

          {/* Password fields - stacked on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-3">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="new-password"
              className="text-base sm:text-base"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
              className="text-base sm:text-base"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-3 sm:mt-4 lg:mt-3 py-3 sm:py-3 lg:py-2.5 text-base sm:text-base lg:text-sm uppercase font-heading bg-gym-red hover:bg-gym-red-light transition-colors"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-3 sm:mt-5 lg:mt-4 text-center">
          <p className="text-sm sm:text-sm text-text-muted text-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-gym-red font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}