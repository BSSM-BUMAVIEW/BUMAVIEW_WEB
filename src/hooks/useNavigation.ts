import { useState, useCallback } from 'react';
import type { AppSection } from '../types';
import { UI_CONFIG } from '../constants';

export const useNavigation = (initialSection: AppSection = 'dashboard') => {
  const [activeSection, setActiveSection] = useState<AppSection>(initialSection);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const navigate = useCallback((section: AppSection) => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    setShowContent(false);
    
    setTimeout(() => {
      setActiveSection(section);
      setShowContent(true);
      setIsTransitioning(false);
    }, UI_CONFIG.loadingDelay);
  }, [activeSection]);

  return {
    activeSection,
    isTransitioning,
    showContent,
    navigate,
  };
};
