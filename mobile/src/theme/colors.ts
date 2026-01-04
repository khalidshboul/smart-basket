/**
 * Smart Basket Design System - Colors
 * Based on the approved reference design
 */

export const colors = {
  // Primary
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#34D399',
  
  // Secondary (Navy)
  navy: '#1E293B',
  navyLight: '#334155',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F1F5F9',
  card: '#FFFFFF',
  
  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  
  // Borders & Shadows
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  shadow: 'rgba(0, 0, 0, 0.08)',
  
  // Gradient
  gradientStart: '#10B981',
  gradientEnd: '#059669',
} as const;

export const gradients = {
  primary: ['#10B981', '#059669'] as const,
  hero: ['#10B981', '#047857'] as const,
} as const;

export type ColorKey = keyof typeof colors;
