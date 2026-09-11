import React, { useId } from 'react';

export interface GridIAIconProps extends React.SVGProps<SVGSVGElement> {
  /** 'dark' for dark/black backgrounds, 'light' for light/white backgrounds. Default: 'dark' */
  theme?: 'dark' | 'light';
  /** Size in pixels or CSS units (e.g. 40, '40px'). Default: 40 */
  size?: number | string;
  /** Extra CSS classes */
  className?: string;
  /** Accessible title for screen readers / hover */
  title?: string;
}

/**
 * GridIAIcon — Símbolo Oficial GRID IA
 * 
 * Geometria oficial fiel à identidade visual da marca:
 * - Corpo principal do "G" com curvatura harmônica e barra horizontal interna voltada ao centro
 * - Matriz/grade tecnológica digital à esquerda (3 colunas, linhas horizontais, nós circulares e pixels flutuantes)
 * - Faceta tridimensional em dobra origami na base inferior esquerda
 * - Suporte nativo e perfeito para DARK MODE e LIGHT/WHITE MODE com contraste e saturação calibrados
 * - Proporção de aspecto 1:1 rigorosa sem distorção ou corte
 */
export const GridIAIcon: React.FC<GridIAIconProps> = ({
  theme = 'dark',
  size = 40,
  className = '',
  title = 'GRID IA - Símbolo Oficial',
  style,
  ...props
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const isDark = theme === 'dark';

  const gradId = `grid-ia-grad-${uniqueId}`;
  const facetId = `grid-ia-facet-${uniqueId}`;

  const dimension = typeof size === 'number' ? `${size}px` : size;

  // Calibração de cores e gradientes para garantir máxima visibilidade e contraste
  // em fundo preto/escuro e fundo branco/claro
  const stop0 = isDark ? '#00D2FF' : '#0096E6';
  const stop28 = isDark ? '#007DFE' : '#0062FE';
  const stop68 = isDark ? '#6025F5' : '#6722EA';
  const stop100 = isDark ? '#A855F7' : '#9333EA';

  const facet0 = isDark ? '#7C3AED' : '#6D28D9';
  const facet45 = isDark ? '#581C87' : '#4C1D95';
  const facet100 = isDark ? '#2E1065' : '#3B0764';

  const dotCore = '#FFFFFF';
  const dot1 = isDark ? '#00D2FF' : '#0096E6';
  const dot2 = isDark ? '#00A3FF' : '#007DFE';
  const dot3 = isDark ? '#007DFE' : '#0055FE';
  const dot4 = isDark ? '#7C3AED' : '#6D28D9';
  const dot5 = isDark ? '#A855F7' : '#9333EA';

  const pixel1 = isDark ? '#00D2FF' : '#0096E6';
  const pixel2 = isDark ? '#007DFE' : '#0062FE';
  const pixel3 = isDark ? '#8B5CF6' : '#7C3AED';

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={dimension}
      height={dimension}
      className={`inline-block shrink-0 select-none ${className}`}
      style={{
        objectFit: 'contain',
        objectPosition: 'center',
        ...style,
      }}
      aria-label={title}
      role="img"
      {...props}
    >
      {title && <title>{title}</title>}
      <defs>
        {/* Gradiente Vertical Oficial: Ciano Elétrico -> Azul Cobalto -> Índigo Real -> Roxo Neon */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stop0} />
          <stop offset="28%" stopColor={stop28} />
          <stop offset="68%" stopColor={stop68} />
          <stop offset="100%" stopColor={stop100} />
        </linearGradient>

        {/* Faceta 3D em Dobra Origami na Base Inferior Esquerda */}
        <linearGradient id={facetId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={facet0} />
          <stop offset="45%" stopColor={facet45} />
          <stop offset="100%" stopColor={facet100} />
        </linearGradient>
      </defs>

      {/* ==================== GRADE TECNOLÓGICA DIGITAL (LADO ESQUERDO) ==================== */}
      <g stroke={`url(#${gradId})`} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Coluna 1 (Externa, x=28): Conecta Linhas 1 a 5 (y=54 a 146) */}
        <line x1="28" y1="54" x2="28" y2="146" />

        {/* Coluna 2 (Média, x=52): Conecta Linhas 0 a 6 (y=32 a 168) */}
        <line x1="52" y1="32" x2="52" y2="168" />

        {/* Coluna 3 (Tangente ao G, x=78): Conecta Linhas 0 a 6 (y=32 a 168) */}
        <line x1="78" y1="32" x2="78" y2="168" />

        {/* Linha 0 (Topo, y=32): da coluna média (52) até o G (78) */}
        <line x1="52" y1="32" x2="78" y2="32" />

        {/* Linha 1 (y=54): da coluna externa (28) até o corpo do G (78) */}
        <line x1="28" y1="54" x2="78" y2="54" />

        {/* Linha 2 (y=76): da coluna externa (28) até o corpo do G (78) */}
        <line x1="28" y1="76" x2="78" y2="76" />

        {/* Linha 3 (Eixo Central, y=100): do ponto terminal esquerdo (12) até o vão central (68) */}
        <line x1="12" y1="100" x2="68" y2="100" />

        {/* Linha 4 (y=124): da coluna externa (28) até o corpo do G (78) */}
        <line x1="28" y1="124" x2="78" y2="124" />

        {/* Linha 5 (y=146): da coluna externa (28) até a coluna interna (78) */}
        <line x1="28" y1="146" x2="78" y2="146" />

        {/* Linha 6 (Base, y=168): da coluna média (52) até a faceta do G (78) */}
        <line x1="52" y1="168" x2="78" y2="168" />
      </g>

      {/* Arco Circular Interno Esquerdo do vão central do G */}
      <path
        d="M 78 68 A 42 42 0 0 0 68 100 A 42 42 0 0 0 78 132"
        stroke={`url(#${gradId})`}
        strokeWidth="4.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Pontos/Nós Conectores Luminosos com Núcleo Refletivo */}
      {/* Nó Superior (Linha 0, Coluna 2) */}
      <circle cx="52" cy="32" r="5.5" fill={dot1} />
      <circle cx="52" cy="32" r="2.2" fill={dotCore} />

      {/* Nó Superior Esquerdo (Linha 1, Coluna 1) */}
      <circle cx="28" cy="54" r="5.5" fill={dot2} />
      <circle cx="28" cy="54" r="2.2" fill={dotCore} />

      {/* Nó Central Terminal (Linha 3, Terminal Esquerdo) */}
      <circle cx="12" cy="100" r="5.8" fill={dot3} />
      <circle cx="12" cy="100" r="2.2" fill={dotCore} />

      {/* Nó Inferior Esquerdo (Linha 5, Coluna 1) */}
      <circle cx="28" cy="146" r="5.5" fill={dot4} />
      <circle cx="28" cy="146" r="2.2" fill={dotCore} />

      {/* Nó Inferior (Linha 6, Coluna 2) */}
      <circle cx="52" cy="168" r="5.5" fill={dot5} />
      <circle cx="52" cy="168" r="2.2" fill={dotCore} />

      {/* Pixels de Dados Digitais Flutuantes (Extrema Esquerda) */}
      <rect x="6" y="74" width="6.5" height="6.5" rx="1.5" fill={pixel1} />
      <rect x="0" y="97" width="7" height="7" rx="1.5" fill={pixel2} />
      <rect x="8" y="122" width="6.5" height="6.5" rx="1.5" fill={pixel3} />

      {/* ==================== CORPO SÓLIDO DO "G" OFICIAL ==================== */}
      {/* 1. Ramo Superior do G: Curvatura fluida contínua com terminal aberto à direita */}
      <path
        d="M 166 54
           A 68 68 0 0 0 116 32
           L 78 32
           L 78 68
           A 42 42 0 0 1 116 58
           A 42 42 0 0 1 147 72
           L 166 54
           Z"
        fill={`url(#${gradId})`}
      />

      {/* 2. Ramo Inferior do G, Esporão Direito e Barra Horizontal Interna */}
      <path
        d="M 78 132
           L 78 168
           L 116 168
           A 68 68 0 0 0 184 100
           L 184 90
           L 112 90
           L 112 114
           L 156 114
           A 42 42 0 0 1 116 142
           A 42 42 0 0 1 78 132
           Z"
        fill={`url(#${gradId})`}
      />

      {/* 3. Faceta Triangular Tridimensional Origami na Base Inferior Esquerda */}
      <polygon
        points="78,132 108,152 78,168"
        fill={`url(#${facetId})`}
      />
    </svg>
  );
};

export default GridIAIcon;
