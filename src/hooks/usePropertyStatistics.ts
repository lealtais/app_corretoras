import { useMemo } from 'react';
import { Property } from '../types/property';

export function usePropertyStatistics(properties: Property[]) {
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

  return statistics;
}
