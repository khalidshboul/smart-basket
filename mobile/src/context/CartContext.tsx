/**
 * Cart Context - Global shopping cart state
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReferenceItem, CartItem } from '../types';

const CART_STORAGE_KEY = '@smart_basket_cart';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (item: ReferenceItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (itemId: string) => boolean;
  getQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCart();
  }, [items]);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addItem = useCallback((item: ReferenceItem) => {
    setItems((current) => {
      const existing = current.find((i) => i.referenceItem.id === item.id);
      if (existing) {
        return current.map((i) =>
          i.referenceItem.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...current, { referenceItem: item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((current) => current.filter((i) => i.referenceItem.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((current) =>
      current.map((i) =>
        i.referenceItem.id === itemId ? { ...i, quantity } : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (itemId: string) => items.some((i) => i.referenceItem.id === itemId),
    [items]
  );

  const getQuantity = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.referenceItem.id === itemId);
      return item?.quantity || 0;
    },
    [items]
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
