import { useState, useMemo } from 'react';
import { Property, SearchFilter } from '../types/property';
import { initialProperties } from '../data/initialProperties';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>({});

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  // Add or update property
  const saveProperty = (property: Property) => {
    setProperties((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.map((p) => (p.id === property.id ? property : p));
      }
      return [property, ...prev];
    });
  };

  // Delete property
  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  // Clear advanced filter
  const clearFilter = () => {
    setActiveFilter({});
  };

  // Computed filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Free text search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.name.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.notes.some((n) => n.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Advanced criteria
      if (activeFilter.name && !item.name.toLowerCase().includes(activeFilter.name.toLowerCase())) {
        return false;
      }
      if (activeFilter.type && activeFilter.type !== 'Todos' && item.type !== activeFilter.type) {
        return false;
      }
      if (activeFilter.location && !item.location.toLowerCase().includes(activeFilter.location.toLowerCase())) {
        return false;
      }
      if (activeFilter.minArea && item.area < activeFilter.minArea) return false;
      if (activeFilter.maxArea && item.area > activeFilter.maxArea) return false;
      if (activeFilter.minPrice && item.price < activeFilter.minPrice) return false;
      if (activeFilter.maxPrice && item.price > activeFilter.maxPrice) return false;
      if (activeFilter.minCondominium && (item.condominium || 0) < activeFilter.minCondominium) return false;
      if (activeFilter.maxCondominium && (item.condominium || 0) > activeFilter.maxCondominium) return false;
      if (activeFilter.minIptu && (item.iptu || 0) < activeFilter.minIptu) return false;
      if (activeFilter.maxIptu && (item.iptu || 0) > activeFilter.maxIptu) return false;
      if (activeFilter.bedrooms && item.bedrooms < activeFilter.bedrooms) return false;
      if (activeFilter.bathrooms && item.bathrooms < activeFilter.bathrooms) return false;
      if (activeFilter.parkingSpaces && (item.parkingSpaces || 0) < activeFilter.parkingSpaces) return false;
      if (activeFilter.notesQuery) {
        const nq = activeFilter.notesQuery.toLowerCase();
        if (!item.notes.some((n) => n.toLowerCase().includes(nq))) return false;
      }

      return true;
    });
  }, [properties, searchQuery, activeFilter]);

  // Computed favorite properties
  const favoriteProperties = useMemo(() => {
    return properties.filter((p) => p.isFavorite);
  }, [properties]);

  // Computed metrics for Statistics
  const statistics = useMemo(() => {
    const totalCount = properties.length;
    const soldCount = properties.filter((p) => p.status === 'Vendido').length;
    const apartmentsCount = properties.filter((p) => p.type === 'Apartamento').length;
    const housesCount = properties.filter((p) => p.type === 'Casa').length;
    const penthousesCount = properties.filter((p) => p.type === 'Cobertura').length;
    const landsCount = properties.filter((p) => p.type === 'Terreno').length;
    const othersCount = properties.filter((p) => p.type === 'Outros').length;

    return {
      totalCount,
      soldCount,
      apartmentsCount,
      housesCount,
      penthousesCount,
      landsCount,
      othersCount,
    };
  }, [properties]);

  const hasActiveAdvancedFilter = Object.keys(activeFilter).length > 0;

  return {
    properties,
    filteredProperties,
    favoriteProperties,
    statistics,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    hasActiveAdvancedFilter,
    clearFilter,
    toggleFavorite,
    saveProperty,
    deleteProperty,
  };
}
