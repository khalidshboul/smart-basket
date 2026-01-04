/**
 * Language Context - Bilingual support (EN/AR)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@smart_basket_language';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  t: (en: string, ar?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'ar' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      
      // Update RTL direction
      const shouldBeRTL = lang === 'ar';
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.forceRTL(shouldBeRTL);
        // Note: Full RTL change requires app restart
      }
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  // Translation helper
  const t = (en: string, ar?: string): string => {
    if (language === 'ar' && ar) {
      return ar;
    }
    return en;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, isRTL, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
