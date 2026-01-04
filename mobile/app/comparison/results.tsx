/**
 * Comparison Results Screen - Enhanced Design (v6)
 * Features:
 * - Hero Card for Best Value (Large Font, Watermark, Yellow Pill)
 * - Horizontal Carousel for Competitors (White Cards, Large Font)
 * - Modal Detail View for all stores
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { basketApi } from '../../src/api';
import { Button } from '../../src/components/common';
import { StoreDetailModal } from '../../src/components/comparison/StoreDetailModal';
import { useCart, useLanguage } from '../../src/context';
import { borderRadius, colors, gradients, spacing, typography } from '../../src/theme';
import { BasketComparisonResponse, StoreComparisonResult } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Helper Components ---

function AvailabilityPill({ allAvailable, missingCount }: { allAvailable: boolean; missingCount: number }) {
  const { t } = useLanguage();

  if (allAvailable) {
    return (
      <View style={[styles.pill, styles.pillSuccess]}>
        <Ionicons name="checkmark" size={14} color="#15803d" />
        <Text style={[styles.pillText, styles.pillTextSuccess]}>
          {t('All Items Available', 'جميع العناصر متوفرة')}
        </Text>
      </View>
    );
  }

  // Amber/orange style for missing items
  return (
    <View style={[styles.pill, styles.pillMissing]}>
      <Ionicons name="warning" size={14} color="#b45309" />
      <Text style={[styles.pillText, styles.pillTextMissing]}>
        {t(`${missingCount} Item${missingCount > 1 ? 's' : ''} Missing`, `${missingCount} عناصر مفقودة`)}
      </Text>
    </View>
  );
}

function StoreLogo({ name, size = 48, light = false }: { name: string; size?: number, light?: boolean }) {
  return (
    <View style={[
      styles.storeLogo,
      { width: size, height: size, borderRadius: size / 2 },
      light ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: colors.backgroundSecondary }
    ]}>
      <Text style={[styles.logoText, { fontSize: size * 0.5 }, light && { color: '#FFF' }]}>
        {name.charAt(0)}
      </Text>
    </View>
  );
}

// --- Main Screen ---

export default function ResultsScreen() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BasketComparisonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [selectedStore, setSelectedStore] = useState<StoreComparisonResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (items.length > 0) {
      compareBasket();
    } else {
      setLoading(false);
      setError(t('No items in cart', 'لا توجد عناصر في السلة'));
    }
  }, []);

  const compareBasket = async () => {
    try {
      setLoading(true);
      setError(null);
      const itemIds = items.map((i) => i.referenceItem.id);
      const response = await basketApi.compare(itemIds);
      setResults(response);
    } catch (err: any) {
      console.error('Comparison failed:', err);
      setError(err.response?.data?.message || t('Failed to compare prices', 'فشل مقارنة الأسعار'));
    } finally {
      setLoading(false);
    }
  };

  const handleStorePress = (store: StoreComparisonResult) => {
    setSelectedStore(store);
    setModalVisible(true);
  };

  const handleSelectStore = () => {
    // Logic to proceed with this store? 
    // For now just close or navigate somewhere
    setModalVisible(false);
    alert(t('Store Selected!', 'تم اختيار المتجر!'));
  };

  const handleBack = () => router.back();
  const handleRestart = () => {
    clearCart();
    router.replace('/');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t('Comparing prices...', 'جارٍ مقارنة الأسعار...')}</Text>
      </SafeAreaView>
    );
  }

  if (error || !results) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color={colors.danger} />
        <Text style={styles.errorText}>{error}</Text>
        <Button title={t('Go Back', 'العودة')} onPress={handleBack} variant="primary" />
      </SafeAreaView>
    );
  }

  // Always use first store as hero (already sorted by missing items + price)
  const bestStore = results.storeComparisons.length > 0 ? results.storeComparisons[0] : null;
  const competitors = results.storeComparisons.slice(1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Comparison Results', 'نتائج المقارنة')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* BEST VALUE HERO CARD */}
        {bestStore && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleStorePress(bestStore)}
            style={styles.heroTouch}
          >
            <LinearGradient
              colors={gradients.hero}
              style={styles.heroCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* #1 Watermark */}
              <View style={styles.watermarkContainer}>
                <Text style={styles.watermarkText}>#1</Text>
              </View>

              {/* Card Header */}
              <View style={styles.heroHeader}>
                <View style={styles.heroBrandRow}>
                  <StoreLogo name={bestStore.storeName} size={40} light />
                  <Text style={styles.heroStoreName}>{bestStore.storeName}</Text>
                </View>
                {/* Yellow Trophy Badge - Dynamic text based on availability */}
                <View style={styles.trophyBadge}>
                  <Text style={styles.trophyIcon}>🏆</Text>
                  <Text style={styles.trophyText}>
                    {bestStore.allItemsAvailable
                      ? t('Best Value', 'أفضل قيمة')
                      : t('Best Available', 'الأفضل المتاح')}
                  </Text>
                </View>
              </View>

              {/* Price */}
              <View style={styles.heroPriceSection}>
                <Text style={styles.heroPrice}>
                  {bestStore.totalPrice.toFixed(2)}
                  <Text style={styles.heroCurrency}> {bestStore.currency}</Text>
                </Text>
              </View>

              {/* Footer Badge + View Details */}
              <View style={styles.heroFooter}>
                <AvailabilityPill
                  allAvailable={bestStore.allItemsAvailable}
                  missingCount={bestStore.totalItemCount - bestStore.availableItemCount}
                />
                <Text style={styles.heroViewDetails}>
                  {t('View Details', 'عرض التفاصيل')} {'>'}
                </Text>
              </View>

            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* COMPETITORS CAROUSEL */}
        {competitors.length > 0 && (
          <View style={styles.competitorsSection}>
            <Text style={styles.sectionTitle}>{t('Other Stores', 'متاجر أخرى')}</Text>

            <FlatList
              data={competitors}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              snapToInterval={SCREEN_WIDTH * 0.7 + spacing.md} // Card width + margin
              decelerationRate="fast"
              keyExtractor={(item) => item.storeId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.competitorCard}
                  activeOpacity={0.8}
                  onPress={() => handleStorePress(item)}
                >
                  <View style={styles.competitorHeader}>
                    <StoreLogo name={item.storeName} size={36} />
                    <Text style={styles.competitorName} numberOfLines={1}>
                      {item.storeName}
                    </Text>
                  </View>

                  <View style={styles.competitorBody}>
                    <AvailabilityPill
                      allAvailable={item.allItemsAvailable}
                      missingCount={item.totalItemCount - item.availableItemCount}
                    />

                    <Text style={styles.competitorPrice}>
                      {item.totalPrice.toFixed(2)}
                      <Text style={styles.competitorCurrency}> {item.currency}</Text>
                    </Text>
                  </View>

                  <View style={styles.competitorFooter}>
                    <Text style={styles.viewDetailsText}>
                      {t('View Details', 'عرض التفاصيل')} {'>'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.screenFooter}>
        <Button
          title={t('START NEW LIST', 'ابدأ قائمة جديدة')}
          onPress={handleRestart}
          variant="secondary"
        />
      </View>

      {/* Detail Modal */}
      {selectedStore && (
        <StoreDetailModal
          visible={modalVisible}
          store={selectedStore}
          onClose={() => setModalVisible(false)}
          onSelect={handleSelectStore}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.productName,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.fontSize.productName,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  headerTitle: {
    fontSize: typography.fontSize.sectionTitle,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },

  // HERO CARD STYLES
  heroTouch: {
    marginHorizontal: spacing.screenHorizontal,
    marginVertical: spacing.lg,
    // Shadow styles
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  heroCard: {
    borderRadius: borderRadius.xxlarge,
    padding: spacing.lg,
    minHeight: 220,
    justifyContent: 'space-between',
    overflow: 'hidden', // Contain watermark
    position: 'relative',
  },
  watermarkContainer: {
    position: 'absolute',
    right: -20,
    top: 40,
    opacity: 0.1,
    transform: [{ rotate: '-10deg' }],
  },
  watermarkText: {
    fontSize: 180,
    fontWeight: '900',
    color: '#FFF',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  heroStoreName: {
    // Increased font size per Request
    fontSize: 28,
    fontWeight: '800', // Extra bold
    color: '#FFF',
    letterSpacing: -0.5,
  },
  trophyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE047', // Yellow
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  trophyIcon: {
    fontSize: 14,
  },
  trophyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#854D0E', // Dark brown/gold
  },
  heroPriceSection: {
    marginVertical: spacing.lg,
  },
  heroPrice: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: -1,
  },
  heroCurrency: {
    fontSize: 20,
    fontWeight: '600',
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroViewDetails: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.9,
  },

  // COMPETITORS SECTION
  competitorsSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sectionTitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginLeft: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },
  carouselContent: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.md,
  },
  competitorCard: {
    width: SCREEN_WIDTH * 0.7, // 70% width
    backgroundColor: '#FFF',
    borderRadius: borderRadius.xlarge,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    // Minimal shadow for clean look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: spacing.lg, // Space for shadow
  },
  competitorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  competitorName: {
    // Increased font size per Request
    fontSize: 24,
    fontWeight: '800',
    color: colors.navy,
    flex: 1,
  },
  competitorBody: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  competitorPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  competitorCurrency: {
    fontSize: 16,
    fontWeight: '600',
  },
  competitorFooter: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewDetailsText: {
    fontSize: typography.fontSize.label,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },

  // PILL STYLES
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pillSuccess: {
    backgroundColor: '#DCFCE7', // Light green bg
  },
  pillWarning: {
    backgroundColor: '#FEE2E2', // Light red bg
  },
  pillMissing: {
    backgroundColor: '#FEF3C7', // Light amber bg
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextSuccess: {
    color: '#166534', // Dark green text
  },
  pillTextWarning: {
    color: '#991B1B', // Dark red text
  },
  pillTextMissing: {
    color: '#92400E', // Dark amber text
  },

  // COMMON
  storeLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  screenFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenHorizontal,
    paddingBottom: spacing.xxxl,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
