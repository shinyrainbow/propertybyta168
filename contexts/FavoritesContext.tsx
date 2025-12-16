"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const FAVORITES_KEY = "property-favorites";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => void;
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  clearAll: () => void;
  isLoaded: boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
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

  const clearAll = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearAll,
        isLoaded,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  }
  return context;
}
