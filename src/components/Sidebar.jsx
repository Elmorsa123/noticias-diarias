import React from 'react';
import { motion } from 'framer-motion';

const Sidebar = ({ navigationItems, activeView, setActiveView }) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:w-64 space-y-2"
    >
      <nav className="bg-slate-800/70 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => item.action ? item.action() : setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out group ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors group-hover:text-purple-400 ${activeView === item.id ? 'text-white' : 'text-slate-500'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;