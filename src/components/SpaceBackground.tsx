import React from 'react';

export const SpaceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Nebula background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b1e] via-[#1a1b3e] to-[#0a0b1e] opacity-50" />
      
      {/* Stars */}
      {[...Array(100)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}

      {/* Shooting stars */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`shooting-star-${i}`}
          className="absolute animate-shooting-star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: '100px',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: '3s',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Galaxy swirls */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}; 