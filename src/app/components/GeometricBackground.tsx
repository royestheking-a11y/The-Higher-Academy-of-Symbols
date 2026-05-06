import { useId, type CSSProperties } from 'react';

interface GeometricBackgroundProps {
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  tileSize?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Reusable Islamic 8-pointed star tessellation (Khatam pattern) background.
 * Generates a seamlessly tiling SVG overlay.
 *
 * On dark backgrounds  → use strokeColor='#C9A24A', strokeOpacity ≈ 0.18
 * On light backgrounds → use strokeColor='#C9A24A', strokeOpacity ≈ 0.08
 */
export function GeometricBackground({
  strokeColor = '#C9A24A',
  strokeOpacity = 0.18,
  strokeWidth = 0.75,
  tileSize = 80,
  className = '',
  style,
}: GeometricBackgroundProps) {
  const uid = useId();
  const id = `geo_${uid.replace(/[^a-z0-9]/gi, '')}`;

  // ── Pre-computed geometry (tile = 80×80, R=22, r=9, C=40) ────────────
  // Scale from 80 base to requested tileSize
  const S = tileSize / 80;
  const sc = (n: number) => +(n * S).toFixed(3);

  // Helper to build a path string from coordinate pairs
  const path = (pts: [number, number][], close = true) =>
    `M ${pts.map(([x, y]) => `${sc(x)},${sc(y)}`).join(' L ')}${close ? ' Z' : ''}`;

  // ── Central 8-pointed star (R=22, r=9 at center 40,40) ───────────────
  const centralStar = path([
    [40,18],[43.44,31.69],[55.56,24.44],[48.31,36.56],
    [62,40],[48.31,43.44],[55.56,55.56],[43.44,48.31],
    [40,62],[36.56,48.31],[24.44,55.56],[31.69,43.44],
    [18,40],[31.69,36.56],[24.44,24.44],[36.56,31.69],
  ]);

  // ── Cardinal connector squares (rotated 45°, s=9) ────────────────────
  const connectors = [
    path([[40,18],[49,9],[40,0],[31,9]]),       // top
    path([[62,40],[71,31],[80,40],[71,49]]),     // right
    path([[40,62],[31,71],[40,80],[49,71]]),     // bottom
    path([[18,40],[9,49],[0,40],[9,31]]),        // left
  ];

  // ── Corner star fragments (open paths, no close) ─────────────────────
  const corners = [
    path([[22,0],[8.31,3.44],[15.56,15.56],[3.44,8.31],[0,22]], false),       // TL
    path([[58,0],[71.69,3.44],[64.44,15.56],[76.56,8.31],[80,22]], false),     // TR
    path([[0,58],[3.44,71.69],[15.56,64.44],[8.31,76.56],[22,80]], false),     // BL
    path([[58,80],[71.69,76.56],[64.44,64.44],[76.56,71.69],[80,58]], false),  // BR
  ];

  // ── Diagonal elongated hexagons (connecting center tips ↔ corner tips) ─
  // Each hexagon = 3 pts from center-star tooth + 3 pts from corner-star tooth
  const hexagons = [
    // NW: center I7→P7→I6 ↔ corner(0,0) i675→tip45→i225
    path([[36.56,31.69],[24.44,24.44],[31.69,36.56],[3.44,8.31],[15.56,15.56],[8.31,3.44]]),
    // NE: center I0→P1→I1 ↔ corner(80,0) i112→tip135→i157
    path([[43.44,31.69],[55.56,24.44],[48.31,36.56],[71.69,3.44],[64.44,15.56],[76.56,8.31]]),
    // SW: center I4→P5→I5 ↔ corner(0,80) i292→tip315→i337
    path([[36.56,48.31],[24.44,55.56],[31.69,43.44],[3.44,71.69],[15.56,64.44],[8.31,76.56]]),
    // SE: center I2→P3→I3 ↔ corner(80,80) i247→tip225→i202
    path([[48.31,43.44],[55.56,55.56],[43.44,48.31],[76.56,71.69],[64.44,64.44],[71.69,76.56]]),
  ];

  const T = sc(80);

  return (
    <svg
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} x="0" y="0" width={T} height={T} patternUnits="userSpaceOnUse">
          <g
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={strokeOpacity}
          >
            <path d={centralStar} />
            {connectors.map((d, i) => <path key={`cn${i}`} d={d} />)}
            {corners.map((d, i) => <path key={`cr${i}`} d={d} />)}
            {hexagons.map((d, i) => <path key={`hx${i}`} d={d} />)}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}