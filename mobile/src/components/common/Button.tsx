/**
 * Button Component - Matching design spec
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, borderRadius, sizing, shadows } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`${size}Size`],
    disabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textInverse : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadows.button,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  secondary: {
    backgroundColor: colors.navy,
    borderRadius: borderRadius.full,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
  },
  text: {
    backgroundColor: 'transparent',
  },

  // Sizes
  largeSize: {
    height: sizing.buttonHeight.primary,
    paddingHorizontal: 24,
  },
  mediumSize: {
    height: sizing.buttonHeight.secondary,
    paddingHorizontal: 20,
  },
  smallSize: {
    height: sizing.buttonHeight.small,
    paddingHorizontal: 16,
  },

  // Text styles
  text: {
    fontSize: typography.fontSize.buttonText,
    fontWeight: typography.fontWeight.semibold,
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondaryText: {
    color: colors.textInverse,
  },
  outlineText: {
    color: colors.textPrimary,
  },
  textText: {
    color: colors.primary,
  },

  // Text sizes
  largeText: {
    fontSize: typography.fontSize.buttonText,
  },
  mediumText: {
    fontSize: 14,
  },
  smallText: {
    fontSize: 13,
  },

  // Disabled
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default Button;
