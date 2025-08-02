"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiMenu,
  FiHome,
  FiTruck,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define links with required roles
const links = [
  {
    href: "/",
    label: "New Entry",
    icon: <FiHome />,
    roles: ["client", "manager", "admin"],
  },
  {
    href: "/vehicle",
    label: "Register",
    icon: <FiTruck />,
    roles: ["manager", "admin"],
  },
  {
    href: "/dashboard",
    label: "Search",
    icon: <FiBarChart2 />,
    roles: ["manager", "admin"],
  },
  { href: "/user", label: "User", icon: <FiSettings />, roles: ["admin"] },
];

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Get user role from auth context, fallback to "client" if not available
  const userRole = user?.role || "client";

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutDialog(false);
    await handleLogout();
  };

  return (
    <aside
      className={`
        h-screen flex flex-col transition-all duration-300
        ${collapsed ? "w-16" : "w-56"}
        bg-[#1F2937] border-r border-gray-700 shadow-sm
      `}
    >
      {/* Logo/Title and Toggle */}
      <div className="flex items-center justify-between mb-2 px-4 py-4">
        {!collapsed && (
          <span className="text-xl font-bold tracking-wide text-white">
            ANPR
          </span>
        )}
        <button
          className="text-2xl p-2 rounded hover:bg-gray-800 transition text-white"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <FiMenu />
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {links
          .filter((link) => link.roles.includes(userRole))
          .map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                flex items-center gap-3 px-4 py-2 rounded transition-colors group relative
                ${
                  isActive
                    ? "bg-gray-800 text-blue-400 font-semibold"
                    : "hover:bg-gray-700 text-gray-200"
                }
              `}
              >
                <span className="text-xl">{link.icon}</span>
                {!collapsed && <span>{link.label}</span>}
                {collapsed && (
                  <span className="absolute left-full ml-2 w-max opacity-0 group-hover:opacity-100 bg-gray-800 text-xs rounded px-2 py-1 pointer-events-none transition-opacity text-white shadow">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
      </nav>
      {/* Divider */}
      <div className="border-t border-gray-700 my-4 mx-4" />
      {/* Logout */}
      <div className="mb-4 px-4">
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-700 text-gray-200 transition-colors group relative w-full text-left">
              <span className="text-xl">
                <FiLogOut />
              </span>
              {!collapsed && <span>Logout</span>}
              {collapsed && (
                <span className="absolute left-full ml-2 w-max opacity-0 group-hover:opacity-100 bg-gray-800 text-xs rounded px-2 py-1 pointer-events-none transition-opacity text-white shadow">
                  Logout
                </span>
              )}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-800 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Confirm Logout
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to logout? You will be redirected to the
                login page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogoutConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};

export default Sidebar;
