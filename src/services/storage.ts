import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property, SearchFilter, User } from '../types/property';

const SESSION_USER_KEY = '@csi:session_user';
const PROFILE_EXTRAS_PREFIX = '@csi:profile_extras:';
const FAVORITE_IDS_KEY = '@csi:favorite_ids';
const ACTIVE_FILTER_KEY = '@csi:active_filter';
const CACHED_PROPERTIES_KEY = '@csi:cached_properties';

export async function saveSessionUser(user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  } catch {
    return;
  }
}

export async function loadSessionUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function clearSessionUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_USER_KEY);
  } catch {
    return;
  }
}

export async function saveProfileExtrasAsync(
  email: string,
  extras: Partial<User>
): Promise<void> {
  try {
    const key = `${PROFILE_EXTRAS_PREFIX}${email.trim().toLowerCase()}`;
    await AsyncStorage.setItem(key, JSON.stringify(extras));
  } catch {
    return;
  }
}

export async function loadProfileExtrasAsync(
  email: string
): Promise<Partial<User>> {
  try {
    const key = `${PROFILE_EXTRAS_PREFIX}${email.trim().toLowerCase()}`;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<User>;
  } catch {
    return {};
  }
}

export async function saveFavoriteIdsAsync(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITE_IDS_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
}

export async function loadFavoriteIdsAsync(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITE_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveActiveFilterAsync(filter: SearchFilter): Promise<void> {
  try {
    await AsyncStorage.setItem(ACTIVE_FILTER_KEY, JSON.stringify(filter));
  } catch {
    return;
  }
}

export async function loadActiveFilterAsync(): Promise<SearchFilter> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_FILTER_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SearchFilter;
  } catch {
    return {};
  }
}

export async function saveCachedPropertiesAsync(
  properties: Property[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      CACHED_PROPERTIES_KEY,
      JSON.stringify(properties)
    );
  } catch {
    return;
  }
}

export async function loadCachedPropertiesAsync(): Promise<Property[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHED_PROPERTIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Property[]) : [];
  } catch {
    return [];
  }
}
