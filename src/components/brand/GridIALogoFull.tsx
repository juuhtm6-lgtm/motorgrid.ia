import React, { useId, useState, useEffect } from 'react';
import { GridIAIcon } from './GridIAIcon';

/**
 * Hook para resolução dinâmica do tema atual ('dark' ou 'light')
 * Se uma prop de tema explícita for passada ('light' ou 'dark'), ela é respeitada imediatamente.
 * Caso contrário, detecta a classe .light ou .dark em document.documentElement
 * e escuta alterações em tempo real via MutationObserver e storage.
 */
export function useResolvedTheme(themeProp?: 'dark' | 'light'): 'dark' | 'light' {
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
    if (themeProp === 'light' || themeProp === 'dark') return themeProp;
    if (typeof document !== 'undefined') {
      if (document.documentElement.classList.contains('light')) return 'light';
      if (document.documentElement.classList.contains('dark')) return 'dark';
      try {
        const saved = localStorage.getItem('theme') || localStorage.getItem('motorgrid_theme');
        if (saved === 'light' || saved === 'dark') return saved;
      } catch {
        // fallback
      }
    }
    return 'dark';
  });

  useEffect(() => {
    if (themeProp === 'light' || themeProp === 'dark') {
      setResolvedTheme(themeProp);
      return;
    }

    if (typeof document === 'undefined') return;

    const updateFromDOM = () => {
      const isLight =
        document.documentElement.classList.contains('light') ||
        document.body.classList.contains('light');
      setResolvedTheme(isLight ? 'light' : 'dark');
    };

    updateFromDOM();

    const observer = new MutationObserver(() => {
      updateFromDOM();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'motorgrid_theme') {
        if (e.newValue === 'light' || e.newValue === 'dark') {
          setResolvedTheme(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorage);
    };
  }, [themeProp]);

  // Se themeProp for passado diretamente, tem prioridade absoluta sobre o estado
  return themeProp ?? resolvedTheme;
}

export interface GridIAWordmarkProps {
  /** 'dark' for dark backgrounds (white GRID text), 'light' for light backgrounds (dark slate GRID text) */
  theme?: 'dark' | 'light';
  /** Height in pixels of the wordmark (default: 22) */
  height?: number;
  /** Extra CSS classes */
  className?: string;
}

/**
 * GridIAWordmark — Tipografia Vetorial Oficial GRID IA
 * Renderiza as letras oficiais ("GRID" em alto contraste e "IA" com o 'A' em chevron futurista)
 * com fidelidade vetorial absoluta, sem depender de fontes instaladas no sistema.
 * 
 * No Light Mode: "GRID" em cor escura (#0F172A), "IA" em gradiente azul -> roxo original.
 * No Dark Mode: "GRID" em branco (#FFFFFF), "IA" em gradiente azul -> roxo original.
 * Sem filtros, opacidade ou desbotamento.
 */
export const GridIAWordmark: React.FC<GridIAWordmarkProps> = ({
  theme,
  height = 22,
  className = '',
}) => {
  const activeTheme = useResolvedTheme(theme);
  const isDark = activeTheme === 'dark';
  const width = Math.round(height * (172 / 32));
  // Alto contraste: #FFFFFF em Dark Mode e #0F172A em Light Mode
  const gridColor = isDark ? '#FFFFFF' : '#0F172A';
  const uniqueId = useId().replace(/:/g, '');
  const gradId = `wordmark-ia-grad-${uniqueId}`;

  // Gradiente oficial azul -> roxo original preservado em ambos os temas
  const stop0 = isDark ? '#00D2FF' : '#007DFE';
  const stop35 = isDark ? '#007DFE' : '#0062FE';
  const stop70 = isDark ? '#6025F5' : '#6722EA';
  const stop100 = isDark ? '#A855F7' : '#9333EA';

  return (
    <svg
      viewBox="0 0 172 32"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none shrink-0 ${className}`}
      data-logo-theme={isDark ? 'dark' : 'light'}
      aria-label="GRID IA"
      role="img"
    >
      <title>GRID IA</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={stop0} />
          <stop offset="35%" stopColor={stop35} />
          <stop offset="70%" stopColor={stop70} />
          <stop offset="100%" stopColor={stop100} />
        </linearGradient>
      </defs>

      {/* GRID: Escuro #0F172A no Light Mode e Branco #FFFFFF no Dark Mode */}
      <g
        fill={gridColor}
        className={`grid-ia-wordmark-grid transition-colors duration-200 ${
          isDark
            ? 'grid-ia-wordmark-theme-dark fill-white text-white'
            : 'grid-ia-wordmark-theme-light fill-[#0F172A] text-[#0F172A]'
        }`}
        style={{ fill: gridColor, opacity: 1 }}
      >
        {/* G */}
        <path
          d="M 28 8.5 L 23 8.5 C 21.5 5.5 17.5 4.5 13.5 4.5 C 6.5 4.5 2 9.5 2 16 C 2 22.5 6.5 27.5 13.5 27.5 C 19.5 27.5 24 24 24.5 18 L 14 18 L 14 14 L 28.5 14 L 28.5 20 C 27.5 26.5 21.5 31.5 13.5 31.5 C 4.5 31.5 -2 25 -2 16 C -2 7 4.5 0.5 13.5 0.5 C 19.5 0.5 25 3.5 28 8.5 Z"
          transform="translate(2, 0)"
          fill={gridColor}
          style={{ fill: gridColor, opacity: 1 }}
        />
        {/* R */}
        <path
          d="M 38 1 L 52 1 C 58 1 62 4.5 62 9.5 C 62 13.5 59.5 16.5 55 17.5 L 63 31 L 56.5 31 L 49 18 L 44 18 L 44 31 L 38 31 Z M 44 5.5 L 44 13.5 L 51.5 13.5 C 54.5 13.5 56.5 12 56.5 9.5 C 56.5 7 54.5 5.5 51.5 5.5 Z"
          fill={gridColor}
          style={{ fill: gridColor, opacity: 1 }}
        />
        {/* I */}
        <rect
          x="70"
          y="1"
          width="5.5"
          height="30"
          rx="1.5"
          fill={gridColor}
          style={{ fill: gridColor, opacity: 1 }}
        />
        {/* D */}
        <path
          d="M 82 1 L 96 1 C 105 1 111 7 111 16 C 111 25 105 31 96 31 L 82 31 Z M 88 5.5 L 88 26.5 L 95.5 26.5 C 101.5 26.5 105 22.5 105 16 C 105 9.5 101.5 5.5 95.5 5.5 Z"
          fill={gridColor}
          style={{ fill: gridColor, opacity: 1 }}
        />
      </g>

      {/* IA: Gradiente original azul -> roxo */}
      <g fill={`url(#${gradId})`} className="grid-ia-wordmark-ia" style={{ opacity: 1 }}>
        {/* I */}
        <rect x="126" y="1" width="5.5" height="30" rx="1.5" />
        {/* A (Futuristic Chevron) */}
        <path d="M 151 1 L 156 1 L 168 31 L 162 31 L 153.5 9.5 L 145 31 L 139 31 Z" />
      </g>
    </svg>
  );
};

export interface GridIALogoFullProps {
  /** 'dark' for dark backgrounds (white GRID text), 'light' for light backgrounds (dark slate GRID text) */
  theme?: 'dark' | 'light';
  /** 'horizontal' (symbol on left, text on right) or 'stacked' (symbol on top, text centered below, as in brand reference) */
  layout?: 'horizontal' | 'stacked';
  /** Preset size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom icon size in pixels */
  iconSize?: number;
  /** Optional subtitle below the brand name */
  showSubtitle?: boolean;
  /** Subtitle text (default: 'SISTEMA OPERACIONAL AUTOMOTIVO') */
  subtitle?: string;
  /** Additional CSS classes for outer container */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * GridIALogoFull — Logotipo Oficial Completo GRID IA
 * 
 * Fiel à referência visual oficial:
 * - Símbolo Oficial GRID IA com grade tecnológica, nós luminosos e dobra 3D
 * - Tipografia oficial: "GRID" com alto contraste + "IA" com 'A' futurista e gradiente oficial
 * - Suporte nativo tanto para DARK MODE quanto para LIGHT / WHITE MODE
 * - Suporte a layout horizontal (sidebar/navbars) e empilhado (login/landing/hero)
 */
export const GridIALogoFull: React.FC<GridIALogoFullProps> = ({
  theme,
  layout = 'horizontal',
  size = 'md',
  iconSize,
  showSubtitle = false,
  subtitle = 'SISTEMA OPERACIONAL AUTOMOTIVO',
  className = '',
  onClick,
}) => {
  const activeTheme = useResolvedTheme(theme);
  const isDark = activeTheme === 'dark';
  const isStacked = layout === 'stacked';

  // Configurações dimensionais por preset e layout
  const horizontalConfig = {
    sm: { icon: 30, textHeight: 18, gap: 'gap-2.5', subtitleText: 'text-[8px]' },
    md: { icon: 36, textHeight: 22, gap: 'gap-3', subtitleText: 'text-[9px]' },
    lg: { icon: 44, textHeight: 26, gap: 'gap-3.5', subtitleText: 'text-[10px]' },
    xl: { icon: 54, textHeight: 32, gap: 'gap-4', subtitleText: 'text-xs' },
  }[size];

  const stackedConfig = {
    sm: { icon: 72, textHeight: 22, gap: 'gap-2', subtitleText: 'text-[9px]' },
    md: { icon: 96, textHeight: 26, gap: 'gap-3', subtitleText: 'text-[10px]' },
    lg: { icon: 130, textHeight: 32, gap: 'gap-3.5', subtitleText: 'text-xs' },
    xl: { icon: 170, textHeight: 40, gap: 'gap-4.5', subtitleText: 'text-sm' },
  }[size];

  const cfg = isStacked ? stackedConfig : horizontalConfig;
  const actualIconSize = iconSize ?? cfg.icon;

  return (
    <div
      onClick={onClick}
      className={`inline-flex ${isStacked ? 'flex-col items-center text-center' : 'items-center'} ${cfg.gap} select-none shrink-0 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      role="banner"
    >
      {/* SÍMBOLO OFICIAL GRID IA */}
      <GridIAIcon
        size={actualIconSize}
        theme={activeTheme}
        className="shrink-0 transition-transform duration-200"
        title="GRID IA"
      />

      {/* TIPOGRAFIA OFICIAL GRID IA (VETORIAL) */}
      <div className={`flex flex-col justify-center ${isStacked ? 'items-center mt-1' : ''}`}>
        <GridIAWordmark
          theme={activeTheme}
          height={cfg.textHeight}
          className="transition-colors duration-200"
        />

        {/* Subtítulo Institucional Opcional */}
        {showSubtitle && (
          <span
            className={`font-bold tracking-widest uppercase mt-1.5 ${cfg.subtitleText} transition-colors ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
            style={{ letterSpacing: '0.2em' }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default GridIALogoFull;
