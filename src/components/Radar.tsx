import React from 'react';
import Svg, { Line, Polygon, Text as SvgText } from 'react-native-svg';
import { Reveal } from './Motion';
import { useLayout } from '../hooks/useLayout';
import { metrics } from '../types';
export const chartColors = ['#ff8a35', '#4eae8a', '#e2cc91'];
export function Radar({ series }: { series: number[][] }) {
  const layout = useLayout();
  const point = (i: number, r: number) => {
    const angle = (i * Math.PI * 2) / 9 - Math.PI / 2;
    return [150 + Math.cos(angle) * r, 150 + Math.sin(angle) * r];
  };
  const polygon = (r: number) =>
    metrics.map((_, i) => point(i, r).join(',')).join(' ');
  return (
    <Reveal revision={JSON.stringify(series)}>
      <Svg
        width="100%"
        height={layout.compact ? 230 : 290}
        viewBox="0 0 300 300"
      >
        {[0.25, 0.5, 0.75, 1].map(v => (
          <Polygon
            key={v}
            points={polygon(105 * v)}
            fill="none"
            stroke="#ffffff10"
          />
        ))}
        {metrics.map((m, i) => {
          const [x, y] = point(i, 105);
          const [tx, ty] = point(i, 127);
          return (
            <React.Fragment key={m}>
              <Line x1={150} y1={150} x2={x} y2={y} stroke="#ffffff10" />
              <SvgText
                x={tx}
                y={ty}
                textAnchor="middle"
                fill="#9aa99c"
                fontSize={10}
              >
                {m.slice(0, 4)}
              </SvgText>
            </React.Fragment>
          );
        })}
        {series.map((values, index) => (
          <Polygon
            key={index}
            points={values
              .map((v, i) => point(i, v * 1.05).join(','))
              .join(' ')}
            fill={chartColors[index]}
            fillOpacity={0.14}
            stroke={chartColors[index]}
            strokeWidth={2}
          />
        ))}
      </Svg>
    </Reveal>
  );
}
