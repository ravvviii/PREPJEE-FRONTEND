'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#EEC75E', '#0B0B0B', '#22C55E', '#6366F1', '#F97316'];

function buildPieces(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    color: COLORS[index % COLORS.length],
    delay: Math.random() * 0.3,
    duration: 1.4 + Math.random() * 0.8,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 120,
    size: 6 + Math.random() * 6,
  }));
}

export function ConfettiBurst({ count = 32 }) {
  const pieces = useMemo(() => buildPieces(count), [count]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-visible">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ opacity: 1, y: -20, x: 0, rotate: 0 }}
          animate={{ opacity: 0, y: 260, x: piece.drift, rotate: piece.rotate }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.4,
            backgroundColor: piece.color,
          }}
          className="absolute top-0 rounded-sm"
        />
      ))}
    </div>
  );
}
