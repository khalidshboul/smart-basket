/**
 * Smart Basket Design System - Spacing & Sizing
 * Based on the approved reference design
 */

export const spacing = {
  // Base spacing scale (4px)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Screen padding
  screenHorizontal: 16,
  screenVertical: 16,
  
  // Card padding
  cardPadding: 16,
  cardPaddingLarge: 20,
} as const;

export const borderRadius = {
  // From design spec
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
  xxlarge: 24,
  full: 28,
  pill: 9999,
} as const;

export const sizing = {
  // Button heights (from design spec)
  buttonHeight: {
    primary: 56,
    secondary: 48,
    small: 40,
    tiny: 36,
  },
  
  // Input heights
  inputHeight: 48,
  searchBarHeight: 48,
  
  // Category pill
  categoryPillHeight: 40,
  
  // Bottom nav
  bottomNavHeight: 64,
  
  // Icons
  iconSmall: 16,
  iconMedium: 20,
  iconLarge: 24,
  iconXLarge: 32,
  
  // Product image
  productImageSmall: 48,
  productImageMedium: 64,
  productImageLarge: 80,
  
  // Store logo
  storeLogo: 56,
  
  // Ranking badge
  rankingBadge: 32,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;
