// src/pages/AdminDashboard.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, UserCog, Home, Users, LucideIcon } from "lucide-react";
import React from "react";
import { PG_BASE } from "@packages/config/constants";
interface DashboardItem {
  label: string;
  path: string;
  icon: LucideIcon;
  color: string;
}

export const AdminDashboard: React.FC = () => {
  const dashboards: DashboardItem[] = [
    {
      label: "Owner Dashboard",
      path: `${PG_BASE}/owner/dashboard`,
      icon: Home,
      color: "text-yellow-400",
    },
    {
      label: "Manager Dashboard",
      path: `${PG_BASE}/manager/dashboard`,
      icon: UserCog,
      color: "text-green-400",
    },
    {
      label: "Guest Dashboard",
      path: `${PG_BASE}/guest/dashboard`,
      icon: Users,
      color: "text-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center py-16 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center items-center mb-4">
          <Shield className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-wide text-indigo-300">
          Admin Control Panel
        </h1>
        <p className="mt-3 text-gray-300 text-lg">
          Access and manage all dashboards with a single click.
        </p>
      </motion.div>

      {/* Dashboard Links */}
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl"
      >
        {dashboards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:border-indigo-400 transition-all duration-300"
            >
              <Link
                to={item.path}
                className="flex flex-col items-center justify-center p-6 text-center"
              >
                <Icon className={`w-10 h-10 mb-3 ${item.color}`} />
                <span className="text-lg font-semibold hover:text-indigo-400 transition">
                  {item.label}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
};

export default AdminDashboard;
