import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGymData } from '../context/GymDataContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import DashboardSidebar from '../components/layout/dashboard/DashboardSidebar';
import DashboardHeader from '../components/layout/dashboard/DashboardHeader';

const DashboardOverview = lazy(() => import('../components/layout/dashboard/DashboardOverview'));
const MyRoutines = lazy(() => import('../components/layout/dashboard/MyRoutines'));
const MyClasses = lazy(() => import('../components/layout/dashboard/MyClasses'));
const UserProfile = lazy(() => import('../components/layout/dashboard/UserProfile'));
const Nutrition = lazy(() => import('../components/layout/nutrition/Nutrition'));

function TabFallback() {
  return (
    <div className="rounded-3xl border border-gray-800 bg-surface p-8 text-sm uppercase tracking-[0.18em] text-gray-400">
      Cargando módulo
    </div>
  );
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const {
    getAssignedNutritionForUser,
    membershipStatus,
    membershipCheckoutLoading,
    refreshMembershipStatus,
    startMembershipCheckout,
  } = useGymData();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const contentStartRef = useRef(null);
  const validTabs = ['overview', 'routines', 'nutrition', 'classes', 'profile'];
  const requestedTab = searchParams.get('tab');
  const normalizedTab = validTabs.includes(requestedTab) ? requestedTab : 'overview';
  const [activeTab, setActiveTab] = useState(normalizedTab);

  useEffect(() => {
    if (normalizedTab !== activeTab) {
      setActiveTab(normalizedTab);
    }
  }, [activeTab, normalizedTab]);

  useEffect(() => {
    if (!contentStartRef.current) {
      return;
    }

    const mobileOffset = 152;
    const desktopOffset = 112;
    const offset = window.innerWidth < 1024 ? mobileOffset : desktopOffset;
    const targetY =
      contentStartRef.current.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth',
    });
  }, [activeTab]);

  useEffect(() => {
    const checkoutReturnKeys = [
      'status',
      'collection_status',
      'payment_id',
      'preapproval_id',
      'subscription_id',
      'merchant_order_id',
    ];
    const hasCheckoutReturn = checkoutReturnKeys.some((key) => searchParams.has(key));

    if (!hasCheckoutReturn) {
      return;
    }

    let isActive = true;

    async function reconcileCheckoutReturn() {
      const nextStatus = await refreshMembershipStatus();

      if (!isActive) {
        return;
      }

      if (nextStatus?.active) {
        toast.success('La membresía quedó activa y sincronizada.', 'Mercado Pago');
      } else if (nextStatus?.status === 'PENDING') {
        toast.info('Volviste del checkout. La activación todavía está pendiente.', 'Mercado Pago');
      } else {
        toast.info('Actualizamos el estado de tu membresía desde Mercado Pago.', 'Mercado Pago');
      }

      const nextParams = new URLSearchParams(searchParams);
      checkoutReturnKeys.forEach((key) => nextParams.delete(key));
      setSearchParams(nextParams, { replace: true });
    }

    reconcileCheckoutReturn();

    return () => {
      isActive = false;
    };
  }, [refreshMembershipStatus, searchParams, setSearchParams, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (nextTab) => {
    setActiveTab(nextTab);

    if (nextTab === 'overview') {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ tab: nextTab }, { replace: true });
  };

  const handleMembershipCheckout = async () => {
    try {
      const checkoutUrl = await startMembershipCheckout('monthly-standard');

      if (!checkoutUrl) {
        toast.error('No pudimos generar el checkout de Mercado Pago.', 'Membresía');
        return;
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      const message = error.response?.data?.message || 'No se pudo iniciar la membresía.';
      toast.error(message, 'Membresía');
    }
  };

  const canStartMembershipCheckout =
    !membershipStatus?.active && membershipStatus?.status !== 'PENDING';

  /**
   * ✅ CORRECTO: Los iconos son STRINGS (emojis)
   * NO componentes de React
   */
  const tabs = [
    {
      id: 'overview',
      label: 'Home',
      icon: '',  // ← String emoji, NO componente
      description: 'Tu resumen personal',
    },
    {
      id: 'routines',
      label: 'Mis Rutinas',
      icon: '',  // ← String emoji, NO componente
      description: 'Tus entrenamientos',
    },
    {
      id: 'nutrition',
      label: 'Mi Nutrición',
      icon: '',  // ← String emoji, NO componente
      description: 'Tus planes de alimentación',
    },
    {
      id: 'classes',
      label: 'Clases',
      icon: '',  // ← String emoji, NO componente
      description: 'Clases disponibles',
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: '',  // ← String emoji, NO componente
      description: 'Tus datos',
    },
  ];

  /**
   * Renderiza el contenido según el tab activo
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            user={user}
            dashboardData={{ membershipStatus }}
            onMembershipAction={canStartMembershipCheckout ? handleMembershipCheckout : undefined}
            membershipActionLabel={canStartMembershipCheckout ? 'Activar membresía' : undefined}
            membershipActionLoading={membershipCheckoutLoading}
          />
        );
      case 'routines':
        return <MyRoutines user={user} />;
      case 'classes':
        return <MyClasses user={user} />;
      case 'nutrition':
        return <Nutrition user={user} nutritionData={getAssignedNutritionForUser(user?.email)?.nutritionData} />
      case 'profile':
        return <UserProfile user={user} onLogout={handleLogout} />;
      default:
        return (
          <DashboardOverview
            user={user}
            dashboardData={{ membershipStatus }}
            onMembershipAction={canStartMembershipCheckout ? handleMembershipCheckout : undefined}
            membershipActionLabel={canStartMembershipCheckout ? 'Activar membresía' : undefined}
            membershipActionLoading={membershipCheckoutLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* HEADER MOBILE - only mobile (lg:hidden) */}
        <DashboardHeader
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onLogout={handleLogout}
          user={user}
        />

      {/* FLEX CONTAINER - Sidebar + Content */}
      <div className="flex min-w-0">
        
        {/* SIDEBAR DESKTOP - Only desktop (hidden lg:flex) */}
        <DashboardSidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onLogout={handleLogout}
          user={user}
        />

        {/* MAIN CONTENT AREA */}
        <main className="min-w-0 flex-1 min-h-screen">
          {/* Animation content */}
          <div
            key={activeTab}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 animate-fadeIn"
          >
            <div ref={contentStartRef} />
            <Suspense fallback={<TabFallback />}>
              {renderContent()}
            </Suspense>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-400">
            <p>&copy; 2026 La Resistencia. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                Soporte
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Términos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
