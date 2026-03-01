import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute  from './context/ProtectedRoute';

const Home = lazy(() =>
  import('./pages/Home').then((module) => ({ default: module.Home })),
);
const Login = lazy(() =>
  import('./pages/Login').then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import('./pages/Register').then((module) => ({ default: module.Register })),
);
const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })),
);
const AdminDashboard = lazy(() =>
  import('./components/layout/adminDashboard/AdminDashboard').then((module) => ({
    default: module.AdminDashboard,
  })),
);
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-sm uppercase tracking-[0.2em] text-gray-400">
      Cargando experiencia
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={<ProtectedRoute component={Dashboard} />}
            />

            <Route
              path="/admin"
              element={<ProtectedRoute requiredRole="ADMIN" component={AdminDashboard} />}
            />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
