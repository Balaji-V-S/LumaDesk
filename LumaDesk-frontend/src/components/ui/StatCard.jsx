// src/components/ui/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Define our vibrant color palettes from the project
const colorMap = {
  rose: {
    bg: 'bg-rose-50',
    icon: 'text-rose-500',
    ring: 'focus:ring-rose-500',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-500',
    ring: 'focus:ring-amber-500',
  },
  lime: {
    bg: 'bg-lime-50',
    icon: 'text-lime-500',
    ring: 'focus:ring-lime-500',
  },
  stone: {
    bg: 'bg-stone-100',
    icon: 'text-stone-600',
    ring: 'focus:ring-stone-500',
  },
};

const StatCard = ({ title, count, icon: Icon, colorName = 'stone' }) => {
  const colors = colorMap[colorName] || colorMap.stone;

  return (
    <motion.div
      className={`flex items-center rounded-lg bg-white p-5 shadow-sm transition-all duration-300 ${colors.ring} outline-none`}
      whileHover={{ scale: 1.02, shadow: 'md' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.icon}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <p className="text-3xl font-bold text-stone-800">{count}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;