import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useLanguage } from '../../context';
import { borderRadius, colors, spacing, typography } from '../../theme';
import { StoreComparisonResult } from '../../types';
import { downloadBill } from '../../utils/billGenerator';

interface StoreDetailModalProps {
    visible: boolean;
    onClose: () => void;
    store: StoreComparisonResult;
    onSelect: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function StoreDetailModal({ visible, onClose, store, onSelect }: StoreDetailModalProps) {
    const { t } = useLanguage();

    const missingCount = useMemo(() => {
        return store.totalItemCount - store.availableItemCount;
    }, [store]);

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadBill = async () => {
        try {
            setIsDownloading(true);
            await downloadBill(store);
        } catch (error) {
            console.error('Failed to download bill:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerInfo}>
                        <View style={styles.storeLogo}>
                            <Text style={styles.logoText}>{store.storeName.charAt(0)}</Text>
                        </View>
                        <View style={styles.storeTextContainer}>
                            <Text style={styles.storeName}>{store.storeName}</Text>
                            <Text style={styles.totalPrice}>
                                {store.totalPrice.toFixed(2)} {store.currency}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Warning Banner */}
                {!store.allItemsAvailable && (
                    <View style={styles.warningBanner}>
                        <Ionicons name="warning" size={16} color={colors.warning} />
                        <Text style={styles.warningText}>
                            {t(
                                `${missingCount} of ${store.totalItemCount} items unavailable at this store`,
                                `${missingCount} من ${store.totalItemCount} عناصر غير متوفرة في هذا المتجر`
                            )}
                        </Text>
                    </View>
                )}

                {/* Items List */}
                <ScrollView style={styles.itemList} contentContainerStyle={styles.itemListContent}>
                    {store.itemPrices.map((item, index) => (
                        <View key={`${item.referenceItemId}-${index}`} style={styles.itemRow}>
                            {/* Status Icon */}
                            <View style={[
                                styles.statusIcon,
                                !item.available && styles.statusIconMissing
                            ]}>
                                <Ionicons
                                    name={item.available ? "checkmark" : "close"}
                                    size={14}
                                    color={item.available ? colors.primary : colors.danger}
                                />
                            </View>

                            {/* Item Details */}
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemName, !item.available && styles.textDisabled]}>
                                    {item.referenceItemName}
                                </Text>
                                {/* Brand would go here if available in API response */}
                                {!item.available && (
                                    <Text style={styles.unavailableText}>{t('Not available', 'غير متوفر')}</Text>
                                )}
                            </View>

                            {/* Price */}
                            <View style={styles.itemPriceContainer}>
                                {item.available ? (
                                    <>
                                        <Text style={styles.itemPrice}>
                                            {item.price?.toFixed(2)} {store.currency}
                                        </Text>
                                        {/* You could add promo logic here later */}
                                    </>
                                ) : (
                                    <Text style={styles.noPrice}>-</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={handleDownloadBill}
                        disabled={isDownloading}
                    >
                        <Ionicons
                            name={isDownloading ? "hourglass" : "download-outline"}
                            size={18}
                            color={colors.primary}
                        />
                        <Text style={styles.downloadButtonText}>
                            {isDownloading
                                ? t('Generating...', 'جاري الإنشاء...')
                                : t('Download Bill', 'تحميل الفاتورة')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={onSelect}
                    >
                        <Text style={styles.selectButtonText}>
                            {t('SELECT THIS STORE', 'اختر هذا المتجر')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xlarge,
        borderTopRightRadius: borderRadius.xlarge,
        height: SCREEN_HEIGHT * 0.75, // Take up 75% of screen
        marginTop: 'auto',
        // Manual shadow since shadows.large might be missing
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storeLogo: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    storeTextContainer: {
        justifyContent: 'center',
    },
    storeName: {
        fontSize: typography.fontSize.sectionTitle,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    totalPrice: {
        fontSize: typography.fontSize.productName,
        fontWeight: typography.fontWeight.semibold,
        color: colors.primary,
    },
    closeButton: {
        padding: spacing.xs,
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB', // Light yellow
        padding: spacing.md,
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        borderRadius: borderRadius.medium,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    warningText: {
        fontSize: typography.fontSize.label,
        color: '#B45309', // Dark orange/brown
        flex: 1,
    },
    itemList: {
        flex: 1,
    },
    itemListContent: {
        padding: spacing.lg,
        paddingTop: spacing.md,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    statusIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ECFDF5', // Light green
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    statusIconMissing: {
        backgroundColor: '#FEF2F2', // Light red
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: typography.fontSize.productName,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    textDisabled: {
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    unavailableText: {
        fontSize: typography.fontSize.label, // Fixed from tiny which doesn't exist
        color: colors.danger,
        marginTop: 2,
    },
    itemPriceContainer: {
        alignItems: 'flex-end',
        minWidth: 70,
    },
    itemPrice: {
        fontSize: typography.fontSize.productName, // Fixed from body
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    noPrice: {
        fontSize: typography.fontSize.productName, // Fixed from body
        color: colors.textSecondary,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: spacing.xxxl, // Extra padding for iPhone home indicator
        gap: spacing.sm,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.large,
        gap: spacing.xs,
    },
    downloadButtonText: {
        color: colors.primary,
        fontSize: typography.fontSize.buttonText,
        fontWeight: typography.fontWeight.semibold,
    },
    selectButton: {
        backgroundColor: colors.navy,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.large,
        alignItems: 'center',
    },
    selectButtonText: {
        color: colors.textInverse,
        fontSize: typography.fontSize.buttonText,
        fontWeight: typography.fontWeight.bold,
    },
});
