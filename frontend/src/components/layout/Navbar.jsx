import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import Logo from "../../docs/img/la-resistencia-logo-1.jpg";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutGrid,
  Dumbbell,
  Calendar,
  User,
  BookOpen,
  Users,
  CreditCard,
} from "lucide-react";

const Navbar = () => {
  const { scrollTo } = useScrollToSection();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrolled = scrollY > 10;
  const opacity = Math.max(0.75, 1 - scrollY / 250);
  const backgroundColor = scrolled
    ? `rgba(0, 0, 0, ${opacity})`
    : "transparent";

  // ========== MENU FOR PUBLIC USERS ==========
  const menuItemsPublic = [
    { label: "Programas", scrollTo: "programs", icon: BookOpen },
    { label: "Comunidad", scrollTo: "community", icon: Users },
    { label: "Planes", scrollTo: "plans", icon: CreditCard },
  ];

  // ========== MENU FOR AUTH USERS ==========
  const menuItemsAuthenticated = [
    { label: "Mi Dashboard", route: "/dashboard", icon: LayoutGrid },
    { label: "Mis Rutinas", route: "/routines", icon: Dumbbell },
    { label: "Clases", route: "/classes", icon: Calendar },
    { label: "Perfil", route: "/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-sm transition-all duration-300"
      style={{ backgroundColor }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center justify-between h-20">
          {/* Left - Menu Items */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {user
              ? menuItemsAuthenticated.map((item) => {
                  const isActive = location.pathname === item.route;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.route}
                      className={`inline-flex items-center gap-2 py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-white hover:text-primary-light hover:bg-white/5"
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  );
                })
              : menuItemsPublic.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => scrollTo(item.scrollTo)}
                      className="inline-flex items-center gap-2 text-white hover:text-primary-light hover:bg-white/5 py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center">
            <button onClick={() => navigate(user ? "/dashboard" : "/")}>
              <img
                className="h-20 w-auto rounded-full object-contain cursor-pointer"
                src={Logo}
                alt="La Resistencia Logo"
              />
            </button>
          </div>

          {/* Right - Auth Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Show fullname and loogout */}
                <span className="text-white text-sm font-medium">
                  {user.name || user.email}
                </span>
                <Button
                  variant="secondary"
                  className=" font-heading px-5 py-2 bg-primary text-white hover:bg-secondary"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                {/* Show login y register */}
                <Link to="/login">
                  <Button
                    variant="secondary"
                    className="font-heading px-5 py-2"
                  >
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="font-heading px-5 py-2">
                    Asociate
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ================= MOBILE HEADER ================= */}
        <div className="flex md:hidden justify-between items-center h-16">
          <div className="flex-1 flex justify-center">
            <button onClick={() => navigate(user ? "/dashboard" : "/")}>
              <img
                className="h-15 w-auto rounded-full object-contain cursor-pointer"
                src={Logo}
                alt="La Resistencia Logo"
              />
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="cursor-pointer absolute left-4 p-2 rounded-lg text-white hover:text-primary transition-all duration-300"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              />
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-1">
              {user
                ? menuItemsAuthenticated.map((item, index) => {
                    const isActive = location.pathname === item.route;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.route}
                        onClick={closeMenu}
                        className={`inline-flex items-center gap-3 py-3 px-4 rounded-none font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-white hover:bg-white/5 hover:text-primary-light"
                        }`}
                        style={{
                          transitionDelay: isMenuOpen
                            ? `${index * 50}ms`
                            : "0ms",
                        }}
                      >
                        {Icon && (
                          <Icon
                            className={`w-5 h-5 shrink-0 ${
                              isActive ? "text-white" : "text-current"
                            }`}
                          />
                        )}
                        {item.label}
                      </Link>
                    );
                  })
                : menuItemsPublic.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          scrollTo(item.scrollTo);
                          closeMenu();
                        }}
                        className="inline-flex items-center gap-3 cursor-pointer text-white hover:bg-white/5 hover:text-primary-light font-semibold transition-all duration-200 py-3 px-4 rounded-none text-left w-full"
                        style={{
                          transitionDelay: isMenuOpen
                            ? `${index * 50}ms`
                            : "0ms",
                        }}
                      >
                        {Icon && <Icon className="w-5 h-5 shrink-0" />}
                        {item.label}
                      </button>
                    );
                  })}

              {/* Auth actions en mobile */}
              <div className="pt-4 border-t border-gray-700">
                {user ? (
                  <>
                    <p className="text-white text-sm font-medium mb-3">
                      {user.name || user.email}
                    </p>
                    <Button
                      variant="secondary"
                      className="w-full bg-primary text-white hover:bg-secondary"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMenu}>
                      <Button variant="secondary" className="w-full mb-2">
                        Iniciar sesión
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMenu}>
                      <Button className="w-full">Asociate</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;