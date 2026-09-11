import React from 'react';
import { GridIAIcon } from './brand/GridIAIcon';
import { GridIALogoFull } from './brand/GridIALogoFull';

export interface MotorGridLogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'horizontal' | 'badge' | 'os';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

/**
 * MotorGridIcon — Símbolo Oficial GRID IA (compatibilidade retroativa)
 * Renderiza o símbolo oficial com a grade tecnológica completa e proporções 1:1.
 */
export function MotorGridIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return <GridIAIcon className={className} />;
}

/**
 * MotorGridLogo — Logo Oficial GRID IA (compatibilidade retroativa)
 * Renderiza o símbolo oficial e tipografia GRID IA oficial.
 */
export function MotorGridLogo({
  className = '',
  variant = 'horizontal',
  size = 'md',
  showSubtitle = false,
}: MotorGridLogoProps) {
  if (variant === 'icon-only') {
    return <GridIAIcon size={size === 'sm' ? 32 : size === 'lg' ? 48 : 40} className={className} />;
  }

  const mappedSize = size === 'xl' ? 'lg' : size;

  return (
    <GridIALogoFull
      theme="dark"
      size={mappedSize}
      showSubtitle={showSubtitle}
      className={className}
    />
  );
}

export default MotorGridLogo;
