import { useMemo, Dispatch, SetStateAction } from 'react';
import { Property } from '../types/property';
import { isSupabaseConfigured, supabaseUpdateFavorite } from '../services/supabase';

export function useFavorites(
  properties: Property[],
  setProperties: Dispatch<SetStateAction<Property[]>>
) {
  const toggleFavorite = (id: string) => {
    const current = properties.find((p) => p.id === id);
    const nextValue = current ? !current.isFavorite : true;

    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: nextValue } : item))
    );

    if (isSupabaseConfigured()) {
      supabaseUpdateFavorite(id, nextValue).catch(() => {});
    }
  };

  const favoriteProperties = useMemo(() => {
    return properties.filter((p) => p.isFavorite);
  }, [properties]);

  return {
    favoriteProperties,
    toggleFavorite,
  };
}
