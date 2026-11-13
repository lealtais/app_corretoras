import { useState, useEffect, useCallback } from 'react';
import { Property, UserRole } from '../types/property';
import { AGENCY_CONFIG } from '../constants/agency';
import {
  supabaseFetchProperties,
  supabaseUpsertProperty,
  supabaseDeleteProperty,
} from '../services/supabase';
import {
  loadCachedPropertiesAsync,
  saveCachedPropertiesAsync,
} from '../services/storage';

export function useProperties(role: UserRole = 'client') {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    const cached = await loadCachedPropertiesAsync();
    if (cached.length > 0) {
      setProperties((prev) => (prev.length === 0 ? cached : prev));
    }
    try {
      const list = await supabaseFetchProperties(role);
      setProperties(list);
      saveCachedPropertiesAsync(list);
    } catch (err) {
      console.error('Erro ao buscar imóveis no Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const saveProperty = async (property: Property) => {
    const normalized: Property = {
      ...property,
      agencyAddress: AGENCY_CONFIG.address,
      code: property.code || `CSI-${100 + properties.length + 1}`,
    };

    setProperties((prev) => {
      const exists = prev.some((p) => p.id === normalized.id);
      if (exists) {
        return prev.map((p) => (p.id === normalized.id ? normalized : p));
      }
      return [normalized, ...prev];
    });

    try {
      await supabaseUpsertProperty(normalized);
    } catch (err) {
      console.error('Erro ao salvar imóvel no Supabase:', err);
    }
  };

  const deleteProperty = async (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabaseDeleteProperty(id);
    } catch (err) {
      console.error('Erro ao excluir imóvel no Supabase:', err);
    }
  };

  return {
    properties,
    setProperties,
    saveProperty,
    deleteProperty,
    isLoading,
    refreshProperties: fetchProperties,
  };
}
