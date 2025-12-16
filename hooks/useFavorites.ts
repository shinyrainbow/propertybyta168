"use client";

import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "property-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites]
  );

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      return [...prev, propertyId];
    });
  }, []);

  const addFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => {
      if (prev.includes(propertyId)) return prev;
      return [...prev, propertyId];
    });
  }, []);

  const removeFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== propertyId));
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isLoaded,
    count: favorites.length,
  };
}
