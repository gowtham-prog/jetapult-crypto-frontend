"use client";
import { useEffect, useState } from "react";
import { Link, useLocation , useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { authenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              CryptoDash
            </span>
            <div className="hidden sm:flex items-center gap-4">
              {location.pathname === "/dashboard" && (
                <Link
                  to="/chat"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Assistant
                </Link>
              )}

              {location.pathname === "/chat" && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              {authenticated ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-gray-200 dark:bg-gray-800 dark:border-gray-700 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-gray-200 dark:bg-gray-800 dark:border-gray-700 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-gray-200 dark:bg-gray-800 dark:border-gray-700 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" className="sm:hidden pb-3">
            <div className="flex flex-col gap-2">
              {location.pathname === "/dashboard" && (
                <Link
                  to="/chat"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Assistant
                </Link>
              )}

              {location.pathname === "/chat" && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={toggleDark}
                aria-label="Toggle dark mode"
                className="px-2 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {dark ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
