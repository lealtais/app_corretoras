export interface Property {
  id: string;
  name: string;
  type: 'Apartamento' | 'Casa' | 'Cobertura' | 'Terreno' | 'Outros';
  location: string;
  area: number; // m²
  price: number; // R$
  condominium?: number; // R$
  iptu?: number; // R$
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
  notes: string[];
  ownerContact?: string;
  isFavorite: boolean;
  status: 'Disponível' | 'Vendido' | 'Reservado';
  imageUrl: string;
}

export interface SearchFilter {
  query?: string;
  name?: string;
  type?: string;
  location?: string;
  minArea?: number;
  maxArea?: number;
  minPrice?: number;
  maxPrice?: number;
  minCondominium?: number;
  maxCondominium?: number;
  minIptu?: number;
  maxIptu?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  notesQuery?: string;
}
