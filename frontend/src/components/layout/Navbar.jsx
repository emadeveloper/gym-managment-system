import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import Logo from "../../docs/img/la-resistencia-logo-1.jpg";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { scrollTo } = useScrollToSection();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
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
    { label: "Programas", scrollTo: "programs" },
    { label: "Comunidad", scrollTo: "community" },
    { label: "Planes", scrollTo: "plans" },
  ];

  // ========== MENU FOR AUTH USERS ==========
  const menuItemsAuthenticated = [
    { label: "Mi Dashboard", route: "/dashboard" },
    { label: "Mis Rutinas", route: "/routines" },
    { label: "Clases", route: "/classes" },
    { label: "Perfil", route: "/profile" },
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
          <div className="flex items-center space-x-6">
            {user
              ? menuItemsAuthenticated.map((item) => (
                  <Link
                    key={item.label}
                    to={item.route}
                    className="text-white hover:text-secondary py-2 px-2.5 rounded-4xl font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))
              : menuItemsPublic.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollTo(item.scrollTo)}
                    className="text-white hover:text-secondary py-2 px-2.5 rounded-4xl font-medium transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
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
            <div className="flex flex-col space-y-2">
              {/* Items según autenticación */}
              {user
                ? menuItemsAuthenticated.map((item, index) => (
                    <Link
                      key={item.label}
                      to={item.route}
                      onClick={closeMenu}
                      className="text-white hover:text-primary font-bold transition-all duration-200 py-1"
                      style={{
                        transitionDelay: isMenuOpen
                          ? `${index * 50}ms`
                          : "0ms",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))
                : menuItemsPublic.map((item, index) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        scrollTo(item.scrollTo);
                        closeMenu();
                      }}
                      className="cursor-pointer text-white hover:text-primary font-bold transition-all duration-200 py-1 text-left"
                      style={{
                        transitionDelay: isMenuOpen
                          ? `${index * 50}ms`
                          : "0ms",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}

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