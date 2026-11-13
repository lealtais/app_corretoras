import { Property, User, UserRole, AIImageMode } from '../types/property';
import { AGENCY_CONFIG } from '../constants/agency';

const DEFAULT_SUPABASE_URL = 'https://zxmyixllnfxqhiqnxemu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_j9Up_WaymPsu3IVmKohEuw_bBbFh3NJ';

const SUPABASE_URL = (
  process.env.EXPO_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
)
  .trim()
  .replace(/\/$/, '');

const SUPABASE_ANON_KEY = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY
).trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
};

function getSupabaseHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...extra,
  };
  if (SUPABASE_ANON_KEY.startsWith('eyJ')) {
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  }
  return headers;
}

interface SupabasePropertyRow {
  id: string;
  code: string;
  name: string;
  type: Property['type'];
  location: string;
  agency_address: string;
  beach_distance: number;
  area: number;
  price: number;
  condominium?: number;
  iptu?: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces?: number;
  notes?: string[];
  owner_contact?: string;
  is_favorite: boolean;
  status: Property['status'];
  image_url: string;
  original_image_url?: string;
  ai_enhanced_mode?: AIImageMode;
  ai_enhanced_label?: string;
}

function mapRowToProperty(row: SupabasePropertyRow, role: UserRole): Property {
  const isAdmin = role === 'admin';
  return {
    id: String(row.id),
    code: row.code || 'CSI-100',
    name: row.name,
    type: row.type,
    location: row.location,
    agencyAddress: row.agency_address || AGENCY_CONFIG.address,
    beachDistance: Number(row.beach_distance || 0),
    area: Number(row.area || 0),
    price: Number(row.price || 0),
    condominium: row.condominium ? Number(row.condominium) : undefined,
    iptu: row.iptu ? Number(row.iptu) : undefined,
    bedrooms: Number(row.bedrooms || 0),
    bathrooms: Number(row.bathrooms || 0),
    parkingSpaces: Number(row.parking_spaces || 0),
    notes: isAdmin && Array.isArray(row.notes) ? row.notes : [],
    ownerContact: isAdmin ? row.owner_contact : undefined,
    isFavorite: Boolean(row.is_favorite),
    status: row.status || 'Disponível',
    imageUrl: row.image_url,
    originalImageUrl: row.original_image_url || undefined,
    aiEnhancedMode: row.ai_enhanced_mode || undefined,
    aiEnhancedLabel: row.ai_enhanced_label || undefined,
  };
}

function mapPropertyToRow(prop: Property): SupabasePropertyRow {
  return {
    id: prop.id,
    code: prop.code || 'CSI-100',
    name: prop.name,
    type: prop.type,
    location: prop.location,
    agency_address: prop.agencyAddress || AGENCY_CONFIG.address,
    beach_distance: prop.beachDistance || 0,
    area: prop.area || 0,
    price: prop.price || 0,
    condominium: prop.condominium || 0,
    iptu: prop.iptu || 0,
    bedrooms: prop.bedrooms || 0,
    bathrooms: prop.bathrooms || 0,
    parking_spaces: prop.parkingSpaces || 0,
    notes: prop.notes || [],
    owner_contact: prop.ownerContact || '',
    is_favorite: Boolean(prop.isFavorite),
    status: prop.status || 'Disponível',
    image_url: prop.imageUrl,
    original_image_url: prop.originalImageUrl || undefined,
    ai_enhanced_mode: prop.aiEnhancedMode || undefined,
    ai_enhanced_label: prop.aiEnhancedLabel || undefined,
  };
}

export async function supabaseLogin(email: string, password: string): Promise<User> {
  const url = `${SUPABASE_URL}/rest/v1/app_users?email=eq.${encodeURIComponent(
    email.toLowerCase()
  )}&password=eq.${encodeURIComponent(password)}&select=id,name,email,role`;

  const res = await fetch(url, { headers: getSupabaseHeaders() });
  if (!res.ok) {
    throw new Error('Erro ao consultar banco de dados.');
  }
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('E-mail ou senha incorretos.');
  }
  const u = rows[0];
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role === 'admin' ? 'admin' : 'client',
  };
}

export async function supabaseRegister(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const url = `${SUPABASE_URL}/rest/v1/app_users`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getSupabaseHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: 'client',
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (errText.includes('duplicate') || res.status === 409) {
      throw new Error('Este e-mail já está cadastrado.');
    }
    throw new Error('Não foi possível criar a conta.');
  }

  const rows = await res.json();
  const u = Array.isArray(rows) ? rows[0] : rows;
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: 'client',
  };
}

export async function supabaseSocialLogin(
  provider: 'Google' | 'Facebook' | 'Apple',
  emailInput?: string
): Promise<User> {
  const normalizedEmail = (
    emailInput || `${provider.toLowerCase()}.usuario@corretoras.com`
  )
    .trim()
    .toLowerCase();

  const checkUrl = `${SUPABASE_URL}/rest/v1/app_users?email=eq.${encodeURIComponent(
    normalizedEmail
  )}&select=id,name,email,role`;

  const checkRes = await fetch(checkUrl, { headers: getSupabaseHeaders() });
  if (checkRes.ok) {
    const existing = await checkRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      const u = existing[0];
      return {
        id: String(u.id),
        name: u.name,
        email: u.email,
        role: u.role === 'admin' ? 'admin' : 'client',
      };
    }
  }

  const displayName = normalizedEmail.split('@')[0];
  return supabaseRegister(displayName, normalizedEmail, `oauth-${provider.toLowerCase()}`);
}

export async function supabaseFetchProperties(role: UserRole): Promise<Property[]> {
  const selectCols =
    role === 'admin'
      ? '*'
      : 'id,code,name,type,location,agency_address,beach_distance,area,price,condominium,iptu,bedrooms,bathrooms,parking_spaces,is_favorite,status,image_url,original_image_url,ai_enhanced_mode,ai_enhanced_label';

  const url = `${SUPABASE_URL}/rest/v1/properties?select=${selectCols}&order=created_at.desc`;
  const res = await fetch(url, { headers: getSupabaseHeaders() });
  if (!res.ok) {
    throw new Error('Erro ao buscar imóveis.');
  }
  const rows: SupabasePropertyRow[] = await res.json();
  return rows.map((r) => mapRowToProperty(r, role));
}

export async function supabaseUpsertProperty(property: Property): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/properties`;
  await fetch(url, {
    method: 'POST',
    headers: getSupabaseHeaders({ Prefer: 'resolution=merge-duplicates' }),
    body: JSON.stringify(mapPropertyToRow(property)),
  });
}

export async function supabaseDeleteProperty(id: string): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/properties?id=eq.${encodeURIComponent(id)}`;
  await fetch(url, {
    method: 'DELETE',
    headers: getSupabaseHeaders(),
  });
}

export async function supabaseUpdateFavorite(id: string, isFavorite: boolean): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/properties?id=eq.${encodeURIComponent(id)}`;
  await fetch(url, {
    method: 'PATCH',
    headers: getSupabaseHeaders(),
    body: JSON.stringify({ is_favorite: isFavorite }),
  });
}
