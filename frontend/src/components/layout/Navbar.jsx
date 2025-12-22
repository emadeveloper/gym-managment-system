import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import Logo from "../../docs/img/la-resistencia-logo-1.jpg";

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

  // Background behavior:
  // - At the very top (over the hero image): fully transparent
  // - After scrolling: black with slight transparency
  const scrolled = scrollY > 10;
  const opacity = Math.max(0.75, 1 - scrollY / 250);
  const backgroundColor = scrolled ? `rgba(0, 0, 0, ${opacity})` : 'transparent';

  const menuItemsLeft = [
    { label: "Programas", href: "#training" },
    { label: "Testimonios", href: "#testimonials" },
  ];

  const menuItemsRight = [
    { label: "Planes", href: "#plans" },
    
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-sm transition-all duration-300"
      style={{ backgroundColor }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center justify-around h-20">
          {/* Left links */}
          <div className="flex items-center space-x-6">
            {menuItemsLeft.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-white hover:text-secondary py-2 px-2.5 rounded-4xl font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center">
            <Link to="/">
              <img
                className="h-20 w-auto rounded-full object-contain"
                src={Logo}
                alt="La Resistencia Logo"
              />
            </Link>
          </div>

          {/* Right links + CTA */}
          <div className="flex items-center space-x-4">
            {menuItemsRight.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-white hover:text-secondary py-2 px-2.5 rounded-4xl font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/register">
              <Button className="uppercase font-heading px-5 py-2">
                Asociate
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden justify-between items-center h-16">
          {/* Logo (centered visually with flex grow) */}
          <div className="flex-1 flex justify-center">
            <Link to="/">
              <img
                className="h-15 w-auto rounded-full object-contain"
                src={Logo}
                alt="La Resistencia Logo"
              />
            </Link>
          </div>

          {/* Hamburger Button - Mobile */}
          <button
            onClick={toggleMenu}
            className="absolute left-4 p-2 rounded-lg text-white hover:text-primary transition-all duration-300"
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
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-1">
              {[...menuItemsLeft, ...menuItemsRight].map((item, index) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeMenu}
                  className={`text-white hover:text-primary font-bold transition-all duration-200 py-1 transform ${
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
                className={`pt-4 border-t border-gray-700 flex flex-col space-y-3 transform transition-all duration-200 ${
                  isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen
                    ? `${(menuItemsLeft.length + menuItemsRight.length) * 50}ms`
                    : "0ms",
                }}
              >
                <Link to="/register" onClick={closeMenu}>
                  <Button className="w-full">Asociate</Button>
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
