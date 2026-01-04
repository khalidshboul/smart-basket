/**
 * ProductCard Component - Product item with quantity stepper
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReferenceItem } from '../../types';
import { colors, borderRadius, spacing, typography, shadows, sizing } from '../../theme';
import { useCart, useLanguage } from '../../context';
import Card from '../common/Card';

interface ProductCardProps {
  item: ReferenceItem;
  estimatedPrice?: number;
  currency?: string;
}

export function ProductCard({
  item,
  estimatedPrice,
  currency = 'AED',
}: ProductCardProps) {
  const { addItem, removeItem, getQuantity, updateQuantity } = useCart();
  const { language } = useLanguage();
  const quantity = getQuantity(item.id);
  const isInCart = quantity > 0;

  const getName = (): string => {
    if (language === 'ar' && item.nameAr) return item.nameAr;
    return item.name;
  };

  const handleAdd = () => {
    addItem(item);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 ? (
            <Image source={{ uri: item.images[0] }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="basket-outline" size={24} color={colors.textMuted} />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {getName()}
          </Text>
          <Text style={styles.details}>
            {item.category}
            {estimatedPrice && ` • ~${estimatedPrice.toFixed(2)} ${currency}`}
          </Text>
        </View>

        {/* Quantity Control */}
        {isInCart ? (
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={handleDecrement}
            >
              <Ionicons name="remove" size={18} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={handleIncrement}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: sizing.productImageMedium,
    height: sizing.productImageMedium,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.productName,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  details: {
    fontSize: typography.fontSize.unitPrice,
    color: colors.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.medium,
    padding: 4,
  },
  stepperButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: typography.fontSize.productName,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addButtonText: {
    fontSize: typography.fontSize.unitPrice,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});

export default ProductCard;
