import React from 'react';
import { Image } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

const BRAND_LOGO_IMAGE = require('../../assets/brand-logo.png');

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const BrandArchitecturalLogo: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
}) => (
  <Image
    source={BRAND_LOGO_IMAGE}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const LucideWaves: React.FC<IconProps> = ({
  size = 20,
  color = '#111827',
  strokeWidth = 1.8,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <Path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <Path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </Svg>
);

export const LucideLayoutGrid: React.FC<IconProps> = ({
  size = 20,
  color = '#111827',
  strokeWidth = 1.8,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Rect width={7} height={7} x={3} y={3} rx={1.5} />
    <Rect width={7} height={7} x={14} y={3} rx={1.5} />
    <Rect width={7} height={7} x={14} y={14} rx={1.5} />
    <Rect width={7} height={7} x={3} y={14} rx={1.5} />
  </Svg>
);

export const LucideMapPin: React.FC<IconProps> = ({
  size = 20,
  color = '#111827',
  strokeWidth = 1.8,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

export const LucideReceipt: React.FC<IconProps> = ({
  size = 20,
  color = '#111827',
  strokeWidth = 1.8,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <Path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <Path d="M12 17.5v-11" />
  </Svg>
);

export const LucideAward: React.FC<IconProps> = ({
  size = 20,
  color = '#111827',
  strokeWidth = 1.8,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx={12} cy={8} r={6} />
    <Path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </Svg>
);

export const LucideArrowLeft: React.FC<IconProps> = ({
  size = 20,
  color = '#111827',
  strokeWidth = 2,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="m12 19-7-7 7-7" />
    <Line x1={19} y1={12} x2={5} y2={12} />
  </Svg>
);

export const LucidePencil: React.FC<IconProps> = ({
  size = 18,
  color = '#111827',
  strokeWidth = 1.8,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <Path d="m15 5 4 4" />
  </Svg>
);

export const LucideHeart: React.FC<IconProps & { filled?: boolean }> = ({
  size = 20,
  color = '#111827',
  strokeWidth = 1.8,
  filled = false,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </Svg>
);

export const LucideCompass: React.FC<IconProps> = ({
  size = 18,
  color = '#111827',
  strokeWidth = 1.8,
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx={12} cy={12} r={10} />
    <Polyline points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </Svg>
);
