// src/components/ui/StarRating.jsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const StarRating = ({ rating, setRating }) => {
  // We use a local state for the hover effect
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <motion.div
            key={starValue}
            className="cursor-pointer"
            onClick={() => setRating(parseFloat(starValue))}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                isFilled ? 'text-amber-500' : 'text-stone-300'
              }`}
              fill={isFilled ? 'currentColor' : 'none'}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarRating;