/**
 * Smart Basket Design System - Typography
 * Based on the approved reference design (SF Pro)
 */

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Font Families
  fontFamily: {
    regular: fontFamily,
    medium: fontFamily,
    semibold: fontFamily,
    bold: fontFamily,
  },

  // Font Sizes (from design spec)
  fontSize: {
    heroPrice: 48,
    appTitle: 24,
    sectionTitle: 22,
    productName: 16,
    buttonText: 15,
    unitPrice: 13,
    label: 11,
    badge: 10,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// Pre-defined text styles
export const textStyles = {
  heroPrice: {
    fontSize: typography.fontSize.heroPrice,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize.heroPrice * typography.lineHeight.tight,
  },
  appTitle: {
    fontSize: typography.fontSize.appTitle,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize.appTitle * typography.lineHeight.tight,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sectionTitle,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize.sectionTitle * typography.lineHeight.tight,
  },
  productName: {
    fontSize: typography.fontSize.productName,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize.productName * typography.lineHeight.normal,
  },
  buttonText: {
    fontSize: typography.fontSize.buttonText,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize.buttonText * typography.lineHeight.normal,
  },
  unitPrice: {
    fontSize: typography.fontSize.unitPrice,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.unitPrice * typography.lineHeight.normal,
  },
  label: {
    fontSize: typography.fontSize.label,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.label * typography.lineHeight.normal,
  },
  badge: {
    fontSize: typography.fontSize.badge,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize.badge * typography.lineHeight.normal,
  },
} as const;
