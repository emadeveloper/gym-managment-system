import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute  from './context/ProtectedRoute';
import NotFound from './pages/NotFound';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './components/layout/adminDashboard/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User routes */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute component={Dashboard} />} 
          />

          {/* Protected Admin routes - */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute requiredRole="ADMIN" component={AdminDashboard} />} 
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
            
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;