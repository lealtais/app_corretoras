import { useState, useMemo, useEffect, useRef } from 'react';
import { Property, SearchFilter, UserRole } from '../types/property';
import { loadActiveFilterAsync, saveActiveFilterAsync } from '../services/storage';

export function usePropertyFilters(properties: Property[], role: UserRole = 'client') {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>({});
  const hydratedRef = useRef(false);

  useEffect(() => {
    loadActiveFilterAsync().then((saved) => {
      hydratedRef.current = true;
      if (Object.keys(saved).length > 0) setActiveFilter(saved);
    });
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    saveActiveFilterAsync(activeFilter);
  }, [activeFilter]);

  const clearFilter = () => {
    setActiveFilter({});
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchBase =
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q);
        const matchNotes =
          role === 'admin' && item.notes.some((n) => n.toLowerCase().includes(q));
        if (!matchBase && !matchNotes) return false;
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
      if (activeFilter.minArea !== undefined && item.area < activeFilter.minArea) return false;
      if (activeFilter.maxArea !== undefined && item.area > activeFilter.maxArea) return false;
      if (activeFilter.minPrice !== undefined && item.price < activeFilter.minPrice) return false;
      if (activeFilter.maxPrice !== undefined && item.price > activeFilter.maxPrice) return false;
      if (activeFilter.maxBeachDistance !== undefined && item.beachDistance > activeFilter.maxBeachDistance) {
        return false;
      }
      if (activeFilter.minCondominium !== undefined && (item.condominium || 0) < activeFilter.minCondominium) return false;
      if (activeFilter.maxCondominium !== undefined && (item.condominium || 0) > activeFilter.maxCondominium) return false;
      if (activeFilter.minIptu !== undefined && (item.iptu || 0) < activeFilter.minIptu) return false;
      if (activeFilter.maxIptu !== undefined && (item.iptu || 0) > activeFilter.maxIptu) return false;
      if (activeFilter.bedrooms !== undefined && item.bedrooms < activeFilter.bedrooms) return false;
      if (activeFilter.bathrooms !== undefined && item.bathrooms < activeFilter.bathrooms) return false;
      if (activeFilter.parkingSpaces !== undefined && (item.parkingSpaces || 0) < activeFilter.parkingSpaces) return false;
      if (role === 'admin' && activeFilter.notesQuery) {
        const nq = activeFilter.notesQuery.toLowerCase();
        if (!item.notes.some((n) => n.toLowerCase().includes(nq))) return false;
      }

      return true;
    });
  }, [properties, searchQuery, activeFilter, role]);

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
