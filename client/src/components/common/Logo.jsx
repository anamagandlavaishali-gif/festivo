import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({
  size = 'md',
  hideTagline = false,
  clickable = true,
  className = '',
}) => {
  // Size mapping
  const sizeConfig = {
    sm: {
      wordmark: 'text-2xl',
      sparkle: 'w-3.5 h-3.5 -top-2 left-16',
      tagline: 'text-[9px] tracking-[0.2em]',
      container: 'gap-0.5',
    },
    md: {
      wordmark: 'text-3xl sm:text-4xl',
      sparkle: 'w-4 h-4 -top-2.5 left-20 sm:left-24',
      tagline: 'text-[10px] sm:text-[11px] tracking-[0.22em]',
      container: 'gap-0.5',
    },
    lg: {
      wordmark: 'text-5xl sm:text-6xl',
      sparkle: 'w-6 h-6 -top-3.5 left-32 sm:left-40',
      tagline: 'text-xs sm:text-sm tracking-[0.25em]',
      container: 'gap-1',
    },
    xl: {
      wordmark: 'text-6xl sm:text-7xl',
      sparkle: 'w-8 h-8 -top-4 left-40 sm:left-48',
      tagline: 'text-sm sm:text-base tracking-[0.28em]',
      container: 'gap-1.5',
    },
  };

  const current = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div className={`inline-flex flex-col items-center select-none ${current.container} ${className}`}>
      {/* Wordmark with celebratory sparkle above */}
      <div className="relative inline-block leading-none">
        {/* Celebratory Sparkle Accent above the wordmark */}
        <div className={`absolute ${current.sparkle} pointer-events-none transform -translate-x-1/2`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full drop-shadow-[0_2px_6px_rgba(99,102,241,0.5)] animate-pulse"
          >
            <defs>
              <linearGradient id="logoSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            {/* 4-point celebratory celestial star */}
            <path
              d="M12 0 C12 7, 17 12, 24 12 C17 12, 12 17, 12 24 C12 17, 7 12, 0 12 C7 12, 12 7, 12 0 Z"
              fill="url(#logoSparkleGrad)"
            />
            <circle cx="12" cy="12" r="2" fill="#ffffff" />
          </svg>
        </div>

        {/* Elegant Handwritten Festivo Typography with Navy Lettering & Blue-Purple Accent */}
        <span
          className={`font-festivo font-bold tracking-tight text-[#0f172a] drop-shadow-sm ${current.wordmark} transition-all duration-200`}
          style={{ letterSpacing: '0.02em' }}
        >
          <span className="relative">
            F
            <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full opacity-70"></span>
          </span>
          <span>estiv</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-700 via-purple-700 to-blue-600">
            o
          </span>
        </span>
      </div>

      {/* Tagline */}
      {!hideTagline && (
        <span
          className={`font-semibold text-[#1e293b] uppercase font-display opacity-90 ${current.tagline}`}
        >
          EVENTS • CONNECT • CELEBRATE
        </span>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-block group focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
