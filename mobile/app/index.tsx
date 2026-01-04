/**
 * Home Screen - Main product browsing screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Category, ReferenceItem } from '../src/types';
import { categoryApi, referenceItemApi } from '../src/api';
import { colors, spacing, typography } from '../src/theme';
import { useCart, useLanguage } from '../src/context';
import { SearchBar, FloatingCartBar, LanguageToggle } from '../src/components/common';
import { CategoryPills, ProductCard } from '../src/components/home';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<ReferenceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [cats, prods] = await Promise.all([
        categoryApi.getActive(),
        referenceItemApi.getActive(),
      ]);
      setCategories(cats);
      setItems(prods);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.categoryId === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameAr && item.nameAr.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('Smart Basket', 'سلة ذكية')}</Text>
          <View style={styles.syncBadge}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>
              {t('LIVE MARKET SYNC', 'مزامنة مباشرة')}
            </Text>
          </View>
        </View>
        <LanguageToggle />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('What do you need?', 'ماذا تحتاج؟')}
        />
      </View>

      {/* Category Pills */}
      <CategoryPills
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Product List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {t('No products found', 'لا توجد منتجات')}
            </Text>
          </View>
        }
      />

      {/* Floating Cart Bar */}
      <FloatingCartBar />
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.appTitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  syncText: {
    fontSize: typography.fontSize.badge,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  searchContainer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 100, // Space for floating cart bar
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: typography.fontSize.productName,
    color: colors.textMuted,
  },
});
