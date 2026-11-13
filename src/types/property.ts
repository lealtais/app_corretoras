export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  city?: string;
  phone?: string;
  rentalsCount?: number;
  preferredRegion?: string;
}

export type AIImageMode = 'enhance' | 'furnish' | 'declutter';

export interface Property {
  id: string;
  code: string;
  name: string;
  type: 'Apartamento' | 'Casa' | 'Cobertura' | 'Terreno' | 'Outros';
  location: string;
  agencyAddress: string;
  beachDistance: number;
  area: number;
  price: number;
  condominium?: number;
  iptu?: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
  notes: string[];
  ownerContact?: string;
  isFavorite: boolean;
  status: 'Disponível' | 'Vendido' | 'Reservado';
  imageUrl: string;
  originalImageUrl?: string;
  aiEnhancedMode?: AIImageMode;
  aiEnhancedLabel?: string;
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
  maxBeachDistance?: number;
  minCondominium?: number;
  maxCondominium?: number;
  minIptu?: number;
  maxIptu?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  notesQuery?: string;
}
