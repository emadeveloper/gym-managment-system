import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar simple */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🏋️ Gym Management
              </h1>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your gym today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Your Profile</h3>
                <p className="text-sm text-gray-500">Account details</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="font-medium text-gray-900">{user?.role || 'USER'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">User ID</p>
                <p className="font-mono text-xs text-gray-600">
                  {user?.id?.substring(0, 8)}...
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="mb-4">
              <p className="text-blue-100 text-sm">Total Members</p>
              <p className="text-4xl font-bold mt-2">24</p>
            </div>
            <p className="text-blue-100 text-sm">
              +3 new this month
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="mb-4">
              <p className="text-purple-100 text-sm">Active Memberships</p>
              <p className="text-4xl font-bold mt-2">18</p>
            </div>
            <p className="text-purple-100 text-sm">
              75% of total members
            </p>
          </Card>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8">
          <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                More Features Coming Soon
              </h3>
              <p className="text-gray-600">
                Memberships, routines, trainers, and more!
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}