import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutGrid,
  Dumbbell,
  Calendar,
  User,
  BookOpen,
  Users,
  Shield,
  CreditCard,
} from "lucide-react";

const Navbar = () => {
  const { scrollTo } = useScrollToSection();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeDashboardTab = new URLSearchParams(location.search).get("tab") || "overview";
  const userInitials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 10;
      if (isScrolledRef.current === nextIsScrolled) {
        return;
      }

      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const backgroundColor = isScrolled ? "rgba(0, 0, 0, 0.88)" : "rgba(0, 0, 0, 0.78)";

  // ========== MENU FOR PUBLIC USERS ==========
  const menuItemsPublic = [
    { label: "Programas", scrollTo: "programs", icon: BookOpen },
    { label: "Comunidad", scrollTo: "community", icon: Users },
    { label: "Planes", scrollTo: "plans", icon: CreditCard },
  ];

  // ========== MENU FOR AUTH USERS ==========
  const menuItemsAuthenticated = [
    {
      label: "Resumen",
      to: "/dashboard",
      icon: LayoutGrid,
      matches: location.pathname === "/dashboard" && activeDashboardTab === "overview",
    },
    {
      label: "Rutinas",
      to: { pathname: "/dashboard", search: "?tab=routines" },
      icon: Dumbbell,
      matches: location.pathname === "/dashboard" && activeDashboardTab === "routines",
    },
    {
      label: "Nutrición",
      to: { pathname: "/dashboard", search: "?tab=nutrition" },
      icon: Shield,
      matches: location.pathname === "/dashboard" && activeDashboardTab === "nutrition",
    },
    {
      label: "Clases",
      to: { pathname: "/dashboard", search: "?tab=classes" },
      icon: Calendar,
      matches: location.pathname === "/dashboard" && activeDashboardTab === "classes",
    },
    {
      label: "Perfil",
      to: { pathname: "/dashboard", search: "?tab=profile" },
      icon: User,
      matches: location.pathname === "/dashboard" && activeDashboardTab === "profile",
    },
  ];

  const desktopAuthLinkClass =
    "group relative inline-flex h-11 min-w-[7.25rem] items-center justify-center px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors duration-300 hover:text-white";
  const desktopPublicLinkClass =
    "group relative inline-flex h-11 items-center justify-center px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors duration-300 hover:text-white";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const goToProfile = () => {
    navigate({
      pathname: "/dashboard",
      search: "?tab=profile",
    });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/8 bg-black/78 transition-all duration-300 backdrop-blur-xl"
      style={{ backgroundColor }}
    >
      <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-10">
        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block">
          <div className="grid min-h-24 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/")}
              className="flex shrink-0 items-center"
            >
              <span className="font-heading text-2xl font-bold uppercase tracking-tight text-white lg:text-3xl">
                La <span className="text-primary">Resistencia</span> Gym
              </span>
            </button>

            <div className="flex min-w-0 flex-1 justify-center">
              <div className="flex items-center gap-1 rounded-full border border-white/8 bg-black/35 px-3 py-2">
                {user
                  ? menuItemsAuthenticated.map((item) => {
                      return (
                        <Link
                          key={item.label}
                          to={item.to}
                          className={`${desktopAuthLinkClass} ${
                            item.matches
                              ? "text-white"
                              : ""
                          }`}
                        >
                          <span>{item.label}</span>
                          <span
                            className={`absolute inset-x-3 bottom-1 h-px origin-center bg-primary transition-transform duration-300 ${
                              item.matches
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                            }`}
                          />
                        </Link>
                      );
                    })
                  : menuItemsPublic.map((item) => {
                      return (
                        <button
                          key={item.label}
                          onClick={() => scrollTo(item.scrollTo)}
                          className={`${desktopPublicLinkClass} cursor-pointer`}
                        >
                          <span>{item.label}</span>
                          <span className="absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                        </button>
                      );
                    })}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-black/35 text-sm font-semibold uppercase tracking-[0.08em] text-gray-200 transition-all duration-300 hover:border-primary/40 hover:bg-white/5 hover:text-white xl:inline-flex"
                    aria-label="Ir al perfil"
                    title={user.name || user.email || "Ir al perfil"}
                  >
                    {userInitials ? (
                      <span>{userInitials}</span>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </button>
                  <Button
                    variant="secondary"
                    className="h-11 rounded-full border-white/8 bg-black/35 px-4 py-0 font-heading text-xs uppercase tracking-[0.12em] hover:border-primary hover:bg-primary hover:text-white"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="secondary"
                      className="rounded-full border-white/8 bg-black/35 px-6 py-3 font-heading uppercase tracking-[0.08em] hover:border-primary/30 hover:bg-white/5"
                    >
                      Contacto
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="rounded-full px-6 py-3 font-heading uppercase tracking-[0.08em]">
                      Empezar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= MOBILE HEADER ================= */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/")}
              className="flex items-center"
            >
              <span className="font-heading text-lg font-bold uppercase tracking-tight text-white">
                La <span className="text-primary">Resistencia</span> Gym
              </span>
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="cursor-pointer absolute left-2 p-2 rounded-lg text-white hover:text-primary transition-all duration-300"
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
          <div className="border-t border-white/8 bg-black/92 py-4 backdrop-blur-xl">
            <div className="flex flex-col space-y-1">
              {user
                ? menuItemsAuthenticated.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={closeMenu}
                        className={`inline-flex items-center gap-3 py-3 px-4 rounded-none font-semibold transition-all duration-200 ${
                          item.matches
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
                              item.matches ? "text-white" : "text-current"
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
              <div className="pt-4 border-t border-white/8 px-4">
                {user ? (
                  <>
                    <div className="mb-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={goToProfile}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-sm font-semibold uppercase tracking-[0.08em] text-white"
                        aria-label="Ir al perfil"
                      >
                        {userInitials ? userInitials : <User className="h-4 w-4" />}
                      </button>
                      <p className="truncate text-sm font-medium text-white">
                        {user.name || user.email}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      className="h-11 w-full rounded-full border-white/8 bg-black/55 px-4 py-0 text-xs uppercase tracking-[0.12em] hover:border-primary hover:bg-primary hover:text-white"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMenu}>
                      <Button variant="secondary" className="mb-2 w-full rounded-full border-white/8 bg-black/55 hover:bg-black/75">
                        Contacto
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMenu}>
                      <Button className="w-full rounded-full">Empezar</Button>
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
