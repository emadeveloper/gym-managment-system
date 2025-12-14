import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

const Navbar = () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate opacity based on scroll position
  // Starts at 1 (fully opaque) and decreases to 0.7 (70% opacity) as user scrolls
  const opacity = Math.max(0.7, 1 - scrollY / 200);
  const backgroundColor = `rgba(255, 255, 255, ${opacity})`;

  const menuItems = [
    { label: "Planes", href: "#planes" },
    { label: "Rutinas", href: "#rutinas" },
    { label: "Productos", href: "#productos" },
    { label: "Uníte a la Comunidad", href: "#comunidad" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className="sticky top-0 z-50 shadow-sm backdrop-blur-sm transition-all duration-300"
      style={{ backgroundColor }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-25">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="uppercase text-2xl font-extrabold text-gray-900 hover:text-primary transition-colors"
            >
              La Resistencia Gym
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-700 hover:bg-gray-100 py-2 px-2.5 mx-1 rounded-4xl font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* Join us Button - Desktop */}
            <div className="hidden md:flex items-center space-x-4 rounded-3xl">
              <Link to="/register">
                <Button className="">Asociate</Button>
              </Link>
            </div>
          </div>

          {/* Hamburger Button - Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100 transition-all duration-300"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen
                    ? "rotate-45 translate-y-2.5"
                    : "translate-y-0"
                }`}
              />
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen
                    ? "-rotate-45 -translate-y-2.5"
                    : "translate-y-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-1">
              {menuItems.map((item, index) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeMenu}
                  className={`text-gray-700 hover:text-primary font-bold transition-all duration-200 py-1 transform ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <div
                className={`pt-4 border-t border-gray-200 flex flex-col space-y-3 transform transition-all duration-200 ${
                  isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen
                    ? `${menuItems.length * 50}ms`
                    : "0ms",
                }}
              >
                <Link to="/register" onClick={closeMenu}>
                  <Button className="">Asociate</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
