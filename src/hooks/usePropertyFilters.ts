import { useState, useMemo } from 'react';
import { Property, SearchFilter } from '../types/property';

export function usePropertyFilters(properties: Property[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>({});

  const clearFilter = () => {
    setActiveFilter({});
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const match =
          item.name.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.notes.some((n) => n.toLowerCase().includes(q));
        if (!match) return false;
      }

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

  const hasActiveAdvancedFilter = Object.keys(activeFilter).length > 0;

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    hasActiveAdvancedFilter,
    clearFilter,
    filteredProperties,
  };
}
