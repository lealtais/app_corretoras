import { useState } from 'react';
import { Property } from '../types/property';
import { initialProperties } from '../data/initialProperties';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  const saveProperty = (property: Property) => {
    setProperties((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.map((p) => (p.id === property.id ? property : p));
      }
      return [property, ...prev];
    });
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    properties,
    setProperties,
    saveProperty,
    deleteProperty,
  };
}
