import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import Logo from "../docs/img/la-resistencia-logo-1.jpg"

export function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clean errors fields when user writes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
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
            Welcome Back
          </h1>
          <p className="text-secondary-text mt-1 lg:mt-0.5 text-base sm:text-base lg:text-sm text-foreground">
            Sign in to your account
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

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
            className="text-base sm:text-base"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full mt-3 sm:mt-4 lg:mt-3 py-3 sm:py-3 lg:py-2.5 text-base sm:text-base lg:text-sm uppercase font-heading bg-gym-red hover:bg-gym-red-light transition-colors"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-3 sm:mt-5 lg:mt-4 text-center">
          <p className="text-sm sm:text-sm text-text-muted text-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-gym-red font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}