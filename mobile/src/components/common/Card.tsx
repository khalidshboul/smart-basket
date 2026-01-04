/**
 * Card Component - Matching design spec
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../theme';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  children,
  variant = 'default',
  style,
  padding = 'medium',
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[`${padding}Padding`],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
  },

  // Variants
  default: {
    ...shadows.card,
  },
  elevated: {
    ...shadows.cardLarge,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Padding
  nonePadding: {
    padding: 0,
  },
  smallPadding: {
    padding: spacing.sm,
  },
  mediumPadding: {
    padding: spacing.md,
  },
  largePadding: {
    padding: spacing.lg,
  },
});

export default Card;
