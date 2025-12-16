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
    <div className="min-h-svh w-full bg-black flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-4">
      {/* Logo */}
      <div className="mb-4 sm:mb-6 lg:mb-8 flex justify-center">
        <img 
          src={Logo} 
          alt="La Resistencia Logo" 
          className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-"
        />
      </div>

      {/* Card */}
      <Card className="w-full max-w-md sm:max-w-lg lg:max-w-md bg-surface shadow-2xl border border-mid-gray/20">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-foreground uppercase tracking-tight">
            Create Account
          </h1>
          <p className="text-secondary-text mt-2 text-sm sm:text-base text-foreground">
            Sign up to get started
          </p>
        </div>

        {serverError && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gym-red/10 border border-gym-red rounded-lg">
            <p className="text-xs sm:text-sm text-gym-red font-medium">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
            className="text-sm sm:text-base"
          />

          {/* Password fields - stacked on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="new-password"
              className="text-sm sm:text-base"
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
              className="text-sm sm:text-base"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-4 sm:mt-6 py-3 sm:py-3.5 lg:py-4 text-base sm:text-lg lg:text-xl uppercase font-heading bg-gym-red hover:bg-gym-red-light transition-colors"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-text-muted text-foreground">
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