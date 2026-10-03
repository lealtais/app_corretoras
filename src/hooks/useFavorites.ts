import { useMemo, Dispatch, SetStateAction } from 'react';
import { Property } from '../types/property';

export function useFavorites(
  properties: Property[],
  setProperties: Dispatch<SetStateAction<Property[]>>
) {
  const toggleFavorite = (id: string) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const favoriteProperties = useMemo(() => {
    return properties.filter((p) => p.isFavorite);
  }, [properties]);

  return {
    favoriteProperties,
    toggleFavorite,
  };
}
