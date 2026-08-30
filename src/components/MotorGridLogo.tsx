import React from 'react';

interface MotorGridLogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'horizontal' | 'badge' | 'os';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export function MotorGridIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="mg-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="mg-white-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <filter id="mg-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Circuit Nodes & Speed Traces on Left */}
      <g stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round">
        {/* Line 1 - Top Node */}
        <line x1="50" y1="28" x2="62" y2="28" />
        <circle cx="48" cy="28" r="4.5" fill="#1C1C1E" stroke="#8B5CF6" strokeWidth="3" />

        {/* Line 2 */}
        <line x1="38" y1="46" x2="68" y2="46" />
        <circle cx="36" cy="46" r="4.5" fill="#1C1C1E" stroke="#8B5CF6" strokeWidth="3" />

        {/* Line 3 */}
        <line x1="16" y1="64" x2="65" y2="64" />
        <circle cx="14" cy="64" r="4.5" fill="#1C1C1E" stroke="#8B5CF6" strokeWidth="3" />

        {/* Line 4 */}
        <line x1="24" y1="82" x2="60" y2="82" />
        <circle cx="22" cy="82" r="4.5" fill="#1C1C1E" stroke="#8B5CF6" strokeWidth="3" />

        {/* Line 5 - Bottom Node */}
        <line x1="42" y1="100" x2="56" y2="100" />
        <circle cx="40" cy="100" r="4.5" fill="#1C1C1E" stroke="#8B5CF6" strokeWidth="3" />
      </g>

      {/* Main Outer M Structure Left Stem */}
      <path
        d="M 60 120 L 76 34 L 92 84 L 110 34 L 126 120"
        stroke="url(#mg-purple-grad)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Circuit Path with White/Lavender Node Pins */}
      <g>
        <path
          d="M 66 118 L 80 48 L 94 92 L 114 48"
          stroke="url(#mg-white-glow)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Circuit white junction dots */}
        <circle cx="80" cy="48" r="4" fill="#FFFFFF" />
        <circle cx="94" cy="92" r="4" fill="#FFFFFF" />
        <circle cx="114" cy="48" r="4" fill="#FFFFFF" />
      </g>

      {/* Right Stroke Digital Grid / Mesh (Automotive Grid) */}
      <g stroke="#8B5CF6" strokeWidth="2.5" fill="none" opacity="0.95">
        {/* Grid outline polygon over the right stem */}
        <polygon
          points="108,34 134,34 122,120 96,120"
          fill="#1C1C1E"
          stroke="#8B5CF6"
          strokeWidth="3.5"
        />
        {/* Horizontal grid lines */}
        <line x1="112" y1="52" x2="130" y2="52" stroke="#A78BFA" strokeWidth="2" />
        <line x1="107" y1="70" x2="126" y2="70" stroke="#A78BFA" strokeWidth="2" />
        <line x1="103" y1="88" x2="121" y2="88" stroke="#A78BFA" strokeWidth="2" />
        <line x1="98" y1="104" x2="116" y2="104" stroke="#A78BFA" strokeWidth="2" />
        
        {/* Vertical grid lines */}
        <line x1="117" y1="36" x2="105" y2="118" stroke="#A78BFA" strokeWidth="2" />
        <line x1="126" y1="36" x2="114" y2="118" stroke="#A78BFA" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function MotorGridLogo({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtitle = true,
}: MotorGridLogoProps) {
  const iconSizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizeMap = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subSizeMap = {
    sm: 'text-[9px] tracking-[0.2em]',
    md: 'text-[10px] tracking-[0.25em]',
    lg: 'text-xs tracking-[0.3em]',
    xl: 'text-sm tracking-[0.35em]',
  };

  if (variant === 'icon-only') {
    return <MotorGridIcon className={iconSizeMap[size]} />;
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1C1C1E] border border-[#8B5CF6]/30 shadow-lg shadow-[#8B5CF6]/10 ${className}`}>
        <MotorGridIcon className="w-6 h-6" />
        <div className="flex items-center">
          <span className="font-extrabold tracking-tight text-white text-sm">Motor</span>
          <span className="font-extrabold tracking-tight text-[#8B5CF6] text-sm">Grid</span>
        </div>
      </div>
    );
  }

  if (variant === 'os') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className="relative shrink-0 flex items-center justify-center p-2.5 rounded-xl bg-[#0F0D1A] border border-[#8B5CF6]/35 shadow-md shadow-[#8B5CF6]/20">
          <MotorGridIcon className={iconSizeMap[size]} />
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-bold text-white tracking-tight text-[19px] leading-tight flex items-center font-['Inter',sans-serif]">
            <span>MotorGrid</span>
          </div>
          {showSubtitle && (
            <span className="font-semibold uppercase text-[#A1A1AA] text-[10px] tracking-[0.16em] mt-0.5 font-['Inter',sans-serif]">
              AUTOMOTIVE COMMAND
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center p-2.5 rounded-xl bg-[#101012] border border-[rgba(139,92,246,0.35)] shadow-md shadow-[#8B5CF6]/20">
        <MotorGridIcon className={iconSizeMap[size]} />
      </div>
      <div className="flex flex-col justify-center">
        <div className="font-bold text-white tracking-tight text-[19px] leading-tight flex items-center font-['Inter',sans-serif]">
          <span>MotorGrid</span>
        </div>
        {showSubtitle && (
          <span className="font-semibold uppercase text-[#A1A1AA] text-[10px] tracking-[0.16em] mt-0.5 font-['Inter',sans-serif]">
            AUTOMOTIVE COMMAND
          </span>
        )}
      </div>
    </div>
  );
}
