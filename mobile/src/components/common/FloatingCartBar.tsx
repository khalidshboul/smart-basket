/**
 * FloatingCartBar Component - Bottom floating navigation bar
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, borderRadius, spacing, typography, sizing, shadows } from '../../theme';
import { useCart, useLanguage } from '../../context';

export function FloatingCartBar() {
  const { itemCount } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  if (itemCount === 0) return null;

  const handlePress = () => {
    router.push('/cart');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{itemCount}</Text>
      </View>
      <Text style={styles.label}>
        {t('Review Shopping List', 'مراجعة قائمة التسوق')}
      </Text>
      <Ionicons name="arrow-forward" size={20} color={colors.textInverse} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.screenHorizontal,
    right: spacing.screenHorizontal,
    height: sizing.bottomNavHeight,
    backgroundColor: colors.navy,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    ...shadows.cardLarge,
  },
  countBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  countText: {
    fontSize: typography.fontSize.buttonText,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
  label: {
    flex: 1,
    fontSize: typography.fontSize.buttonText,
    fontWeight: typography.fontWeight.medium,
    color: colors.textInverse,
  },
});

export default FloatingCartBar;
