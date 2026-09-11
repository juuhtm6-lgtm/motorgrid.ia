import React from 'react';
import { GridIAIcon } from './brand/GridIAIcon';
import { GridIALogoFull } from './brand/GridIALogoFull';

export interface GridIALogoProps {
  /** 'full' / 'horizontal' (symbol on left, text on right); 'stacked' (symbol on top, text below as in reference); 'symbol' (symbol only) */
  variant?: 'full' | 'horizontal' | 'stacked' | 'symbol';
  /** 'dark' for dark backgrounds, 'light' for light/white backgrounds */
  theme?: 'dark' | 'light';
  /** Preset size: 'sm' | 'md' | 'lg' | 'xl' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Explicit width/size if desired */
  width?: number | string;
  /** Explicit height if desired */
  height?: number | string;
  /** Extra CSS classes */
  className?: string;
  /** Show subtitle text */
  showSubtitle?: boolean;
  /** Subtitle text override */
  subtitle?: string;
  /** Accessible label */
  alt?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * GridIALogo — Componente Principal e de Integração da Marca GRID IA
 * Delega perfeitamente para GridIAIcon ou GridIALogoFull preservando rigorosamente
 * a identidade visual em Dark Mode e Light/White Mode.
 */
export const GridIALogo: React.FC<GridIALogoProps> = ({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  width,
  height,
  className = '',
  showSubtitle = false,
  subtitle,
  alt = 'GRID IA',
  onClick,
}) => {
  if (variant === 'symbol') {
    const iconDimension = width ?? height ?? (size === 'sm' ? 36 : size === 'lg' ? 48 : size === 'xl' ? 56 : 40);
    return (
      <GridIAIcon
        size={iconDimension}
        theme={theme}
        className={className}
        title={alt}
        onClick={onClick}
      />
    );
  }

  const iconSize = typeof width === 'number' && width < 60 ? width : undefined;
  const layout = variant === 'stacked' ? 'stacked' : 'horizontal';

  return (
    <GridIALogoFull
      theme={theme}
      layout={layout}
      size={size}
      iconSize={iconSize}
      showSubtitle={showSubtitle}
      subtitle={subtitle}
      className={className}
      onClick={onClick}
    />
  );
};

export { GridIAIcon } from './brand/GridIAIcon';
export { GridIALogoFull } from './brand/GridIALogoFull';
export default GridIALogo;
