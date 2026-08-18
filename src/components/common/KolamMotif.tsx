import React from 'react';

interface KolamMotifProps {
  className?: string;
  size?: number;
  color?: string;
}

export const KolamMotif: React.FC<KolamMotifProps> = ({
  className = '',
  size = 24,
  color = '#D4AF37'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="1.2" opacity="0.8" />
      
      {/* 8-petal traditional lotus motif */}
      <path
        d="M50 18 C56 32, 68 44, 82 50 C68 56, 56 68, 50 82 C44 68, 32 56, 18 50 C32 44, 44 32, 50 18 Z"
        stroke={color}
        strokeWidth="1.5"
        fill={`${color}15`}
      />
      
      {/* Diagonal petals */}
      <path
        d="M27 27 C42 38, 48 42, 73 27 C62 42, 58 48, 73 73 C58 62, 52 58, 27 73 C38 58, 42 52, 27 27 Z"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Central Bindu */}
      <circle cx="50" cy="50" r="5" fill={color} />
      <circle cx="50" cy="20" r="2.5" fill={color} />
      <circle cx="80" cy="50" r="2.5" fill={color} />
      <circle cx="50" cy="80" r="2.5" fill={color} />
      <circle cx="20" cy="50" r="2.5" fill={color} />
    </svg>
  );
};
