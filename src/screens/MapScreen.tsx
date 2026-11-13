import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  PanResponder,
  LayoutChangeEvent,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import {
  PraiaGrandeMap,
  getCoordinatesForProperty,
} from '../components/PraiaGrandeMap';
import { haversineMeters } from '../utils/beachDistanceCalculator';
import { theme } from '../constants/theme';

interface MapScreenProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
  focusPropertyId: string | null;
  onClearFocus: () => void;
}

interface UserLocation {
  lat: number;
  lon: number;
}

function formatDistanceFromUser(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m de você`;
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km de você`;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  properties,
  onSelectProperty,
  onToggleFavorite,
  focusPropertyId,
  onClearFocus,
}) => {
  const [areaHeight, setAreaHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const translateY = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const dragStart = useRef(0);

  const collapsedOffset = Math.max(0, areaHeight * 0.55);

  const focusedProperty = properties.find((p) => p.id === focusPropertyId) || null;

  const listData = useMemo(() => {
    const withDistance = properties.map((p, idx) => {
      if (!userLocation) return { property: p, distance: null as number | null };
      const [lat, lon] = getCoordinatesForProperty(p, idx);
      return {
        property: p,
        distance: haversineMeters(userLocation.lat, userLocation.lon, lat, lon),
      };
    });
    if (userLocation) {
      withDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    if (focusPropertyId) {
      const idx = withDistance.findIndex((x) => x.property.id === focusPropertyId);
      if (idx > 0) {
        const [item] = withDistance.splice(idx, 1);
        withDistance.unshift(item);
      }
    }
    return withDistance;
  }, [properties, userLocation, focusPropertyId]);

  const snapTo = (expand: boolean) => {
    const target = expand ? 0 : collapsedOffset;
    currentOffset.current = target;
    setIsExpanded(expand);
    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: false,
      bounciness: 4,
      speed: 14,
    }).start();
  };

  useEffect(() => {
    if (areaHeight > 0) {
      const target = isExpanded ? 0 : collapsedOffset;
      currentOffset.current = target;
      translateY.setValue(target);
    }
  }, [areaHeight]);

  useEffect(() => {
    if (focusPropertyId && areaHeight > 0) snapTo(false);
  }, [focusPropertyId]);

  const snapRef = useRef(snapTo);
  snapRef.current = snapTo;
  const collapsedRef = useRef(collapsedOffset);
  collapsedRef.current = collapsedOffset;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        dragStart.current = currentOffset.current;
      },
      onPanResponderMove: (_, g) => {
        const next = Math.min(
          collapsedRef.current,
          Math.max(0, dragStart.current + g.dy)
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dy) < 6) {
          snapRef.current(dragStart.current !== 0);
          return;
        }
        const finalPos = dragStart.current + g.dy;
        const shouldExpand =
          g.vy < -0.4 || (g.vy <= 0.4 && finalPos < collapsedRef.current / 2);
        snapRef.current(shouldExpand);
      },
    })
  ).current;

  const handleAreaLayout = (e: LayoutChangeEvent) => {
    setAreaHeight(e.nativeEvent.layout.height);
  };

  const handleLocateMe = () => {
    const geo =
      Platform.OS === 'web' && typeof navigator !== 'undefined'
        ? navigator.geolocation
        : (globalThis as any).navigator?.geolocation;
    if (!geo) {
      setLocationError('Localização indisponível neste dispositivo');
      return;
    }
    setLocating(true);
    setLocationError('');
    geo.getCurrentPosition(
      (pos: { coords: { latitude: number; longitude: number } }) => {
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError('Permita o acesso à localização para ver os mais próximos');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Mapa de Praia Grande</Text>
            <Text style={styles.subtitle}>
              {userLocation
                ? 'Ordenado pelos mais perto de você'
                : 'Toque num preço para ver o imóvel'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.nearBtn, userLocation && styles.nearBtnActive]}
            onPress={handleLocateMe}
            activeOpacity={0.85}
            disabled={locating}
          >
            {locating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="navigate" size={15} color="#FFFFFF" />
            )}
            <Text style={styles.nearBtnText}>Perto de mim</Text>
          </TouchableOpacity>
        </View>

        {locationError !== '' && <Text style={styles.errorText}>{locationError}</Text>}

        {focusedProperty && (
          <View style={styles.focusChip}>
            <Ionicons name="location" size={14} color="#111827" />
            <Text style={styles.focusChipText} numberOfLines={1}>
              {focusedProperty.name}
            </Text>
            <TouchableOpacity onPress={onClearFocus} hitSlop={8}>
              <Ionicons name="close" size={16} color="#475569" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.mapArea} onLayout={handleAreaLayout}>
        <View style={StyleSheet.absoluteFill}>
          <PraiaGrandeMap
            properties={properties}
            onSelectProperty={onSelectProperty}
            focusPropertyId={focusPropertyId}
            userLocation={userLocation}
          />
        </View>

        {areaHeight > 0 && (
          <Animated.View
            style={[styles.sheet, { height: areaHeight, transform: [{ translateY }] }]}
          >
            <View {...panResponder.panHandlers} style={styles.sheetHeader}>
              <View style={styles.handleBar} />
              <Text style={styles.sheetTitle}>
                {properties.length === 1
                  ? '1 imóvel em Praia Grande'
                  : `${properties.length} imóveis em Praia Grande`}
              </Text>
            </View>

            <FlatList
              data={listData}
              keyExtractor={(item) => item.property.id}
              scrollEnabled={isExpanded}
              renderItem={({ item }) => (
                <View>
                  {item.distance !== null && (
                    <Text style={styles.distanceLabel}>
                      {formatDistanceFromUser(item.distance)}
                    </Text>
                  )}
                  <PropertyCard
                    property={item.property}
                    onPress={() => onSelectProperty(item.property)}
                    onToggleFavorite={() => onToggleFavorite(item.property.id)}
                  />
                </View>
              )}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: isExpanded ? 120 : collapsedOffset + 120 },
              ]}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  nearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  nearBtnActive: {
    backgroundColor: '#2563EB',
  },
  nearBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 8,
  },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
  },
  focusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 10,
  },
  sheetHeader: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 14,
    cursor: 'grab',
  } as any,
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  distanceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 6,
    marginLeft: 4,
  },
});
