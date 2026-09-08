import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-5 rounded-md',
    md: 'w-14 h-7 rounded-lg',
    lg: 'w-20 h-10 rounded-xl',
    xl: 'w-28 h-14 rounded-2xl',
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none shadow-xs ${
        className.includes('w-') ? '' : sizeClasses[size]
      } ${className}`}
    >
      <svg
        viewBox="0 0 84 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Dark Navy Background */}
        <rect width="84" height="42" rx="9" fill="#06152B" />

        {/* Slanted Bold Orange "p" */}
        <g transform="skewX(-10) translate(6, 0)">
          <text
            x="24"
            y="31"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontSize="34"
            fontWeight="900"
            fontStyle="italic"
            fill="#FF7A18"
            textAnchor="middle"
          >
            p
          </text>
        </g>

        {/* White Right Arrow */}
        <g stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Arrow Shaft */}
          <path d="M47 21H60" />
          {/* Arrow Head */}
          <path d="M55 15.5L60.5 21L55 26.5" />
        </g>
      </svg>
    </div>
  );
};

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSubtitle = false,
  subtitle,
  size = 'md',
  variant = 'light',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} />
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight ${
              size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg'
            } ${variant === 'dark' ? 'text-white' : 'text-[#0B1F3A]'}`}
          >
            PlastoShip
          </span>
        </div>
        {showSubtitle && subtitle && (
          <p
            className={`text-[11px] font-medium leading-tight ${
              variant === 'dark' ? 'text-slate-400' : 'text-[#5A6B82]'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
