import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';

export function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Manage Your Gym
            <span className="block text-primary mt-2">With Ease</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Complete gym management system with memberships, routines, 
            and trainer management. Built with modern technologies.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button className="px-8 py-3 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">
              Manage members, trainers, and administrators
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Memberships</h3>
            <p className="text-gray-600">
              Flexible membership plans and payments
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">
              Track performance and growth metrics
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-500 mb-4">Built with modern technologies</p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <span className="font-semibold">React</span>
            <span className="font-semibold">Spring Boot</span>
            <span className="font-semibold">PostgreSQL</span>
            <span className="font-semibold">JWT</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Gym Management System. Built by Emanuel Martinez.
          </p>
        </div>
      </footer>
    </div>
  );
}