'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Calendar,
  CheckSquare,
  Orbit,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type View = 'home' | 'tasks' | 'calendar' | 'orbit';

interface NavItem {
  view: View;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onSelect: (view: View) => void;
  currentView: View;
}

const navItems: NavItem[] = [
  { view: 'home', label: 'Home', icon: <Home size={20} /> },
  { view: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  { view: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  { view: 'orbit', label: 'Priority Orbit', icon: <Orbit size={20} /> },
];

export default function Sidebar({ onSelect, currentView }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 64 : 240,
      }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Logo/App Name */}
      <div className="p-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-semibold text-gray-800"
            >
              Second Brain
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onSelect(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 group relative
                ${isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.icon}
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-2 m-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight size={20} className="text-gray-500" />
        ) : (
          <ChevronLeft size={20} className="text-gray-500" />
        )}
      </button>
    </motion.div>
  );
} 