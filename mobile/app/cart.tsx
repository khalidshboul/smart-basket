/**
 * Cart Screen - Shopping list review with compare button
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../src/theme';
import { useCart, useLanguage } from '../src/context';
import { Button, Card } from '../src/components/common';
import { CartItem } from '../src/types';

function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { language } = useLanguage();

  const getName = (): string => {
    if (language === 'ar' && item.referenceItem.nameAr) {
      return item.referenceItem.nameAr;
    }
    return item.referenceItem.name;
  };

  return (
    <Card style={styles.itemCard}>
      <View style={styles.itemContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {item.referenceItem.images && item.referenceItem.images.length > 0 ? (
            <Image 
              source={{ uri: item.referenceItem.images[0] }} 
              style={styles.itemImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="basket-outline" size={24} color={colors.textMuted} />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {getName()}
          </Text>
          <Text style={styles.quantityLabel}>
            QUANTITY: {item.quantity}
          </Text>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.referenceItem.id)}
        >
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const { items, itemCount, clearCart } = useCart();
  const { t } = useLanguage();

  const handleCompare = () => {
    if (itemCount > 0) {
      router.push('/comparison/results');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-down" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <View>
          <Text style={styles.title}>
            {t('Your Shopping List', 'قائمة التسوق')}
          </Text>
          <Text style={styles.subtitle}>
            {itemCount} {t('ITEMS SELECTED', 'عناصر محددة')}
          </Text>
        </View>
        {itemCount > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearAll}>
              {t('Clear All', 'مسح الكل')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Items List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.referenceItem.id}
        renderItem={({ item }) => <CartItemCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="basket-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {t('Your basket is empty', 'سلتك فارغة')}
            </Text>
            <Text style={styles.emptySubtext}>
              {t('Add items from the home screen', 'أضف عناصر من الشاشة الرئيسية')}
            </Text>
          </View>
        }
      />

      {/* Compare Button */}
      {itemCount > 0 && (
        <View style={styles.footer}>
          <Button
            title={`${t('COMPARE BEST PRICES', 'قارن أفضل الأسعار')} 🚀`}
            onPress={handleCompare}
            variant="primary"
            size="large"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.sectionTitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.unitPrice,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
    marginTop: 4,
  },
  clearAll: {
    fontSize: typography.fontSize.unitPrice,
    fontWeight: typography.fontWeight.medium,
    color: colors.danger,
  },
  listContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 120,
    flexGrow: 1,
  },
  itemCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: {
    fontSize: typography.fontSize.productName,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  quantityLabel: {
    fontSize: typography.fontSize.label,
    color: colors.textSecondary,
    marginTop: 4,
  },
  removeButton: {
    padding: spacing.sm,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyText: {
    fontSize: typography.fontSize.productName,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.fontSize.unitPrice,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.background,
    ...shadows.cardLarge,
  },
});
