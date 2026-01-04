/**
 * SearchBar Component - Matching design spec
 */

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, sizing, spacing, typography } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'What do you need?',
  onFocus,
  onSubmit,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onFocus={onFocus}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.medium,
    height: sizing.searchBarHeight,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.productName,
    color: colors.textPrimary,
    padding: 0,
  },
});

export default SearchBar;
