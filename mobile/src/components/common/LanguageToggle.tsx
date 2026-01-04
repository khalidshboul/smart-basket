/**
 * LanguageToggle Component - EN/AR toggle button
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';
import { useLanguage } from '../../context';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}
    >
      <Text style={[styles.text, language === 'ar' && styles.activeText]}>
        عربي
      </Text>
      <Text style={styles.divider}>|</Text>
      <Text style={[styles.text, language === 'en' && styles.activeText]}>
        EN
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: typography.fontSize.unitPrice,
    color: colors.textMuted,
  },
  activeText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  divider: {
    fontSize: typography.fontSize.unitPrice,
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
});

export default LanguageToggle;
