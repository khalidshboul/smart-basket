/**
 * CategoryPills Component - Horizontal scrolling category selector
 */

import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useLanguage } from '../../context';
import { borderRadius, colors, sizing, spacing, typography } from '../../theme';
import { Category } from '../../types';

interface CategoryPillsProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
}

// Helper to detect if icon is an image (Base64/URL) vs emoji
const isImageIcon = (icon: string): boolean => {
  return icon.startsWith('data:') ||
    icon.startsWith('http') ||
    icon.startsWith('/') ||
    icon.includes('base64') ||
    icon.length > 20;
};

export function CategoryPills({
  categories,
  selectedId,
  onSelect,
}: CategoryPillsProps) {
  const { language } = useLanguage();

  const getName = (cat: Category): string => {
    if (language === 'ar' && cat.nameAr) return cat.nameAr;
    return cat.name;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* All category */}
      <TouchableOpacity
        style={[styles.pill, selectedId === null && styles.pillActive]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.text, selectedId === null && styles.textActive]}>
          {language === 'ar' ? 'الكل' : 'All'}
        </Text>
      </TouchableOpacity>

      {/* Category pills */}
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.pill,
            selectedId === category.id && styles.pillActive,
          ]}
          onPress={() => onSelect(category.id)}
        >
          {category.icon && (
            isImageIcon(category.icon) ? (
              <Image
                source={{ uri: category.icon }}
                style={styles.iconImage}
              />
            ) : (
              <Text style={styles.icon}>{category.icon}</Text>
            )
          )}
          <Text
            style={[
              styles.text,
              selectedId === category.id && styles.textActive,
            ]}
          >
            {getName(category)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: sizing.categoryPillHeight,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xlarge,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 16,
  },
  iconImage: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  text: {
    fontSize: typography.fontSize.unitPrice,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.textInverse,
  },
});

export default CategoryPills;
