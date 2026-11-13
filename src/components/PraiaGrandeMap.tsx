import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Property } from '../types/property';
import { formatCurrency } from './PropertyCard';

interface PraiaGrandeMapProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  focusPropertyId?: string | null;
  userLocation?: { lat: number; lon: number } | null;
}

const NEIGHBORHOOD_BASE_COORDS: Array<{
  pattern: RegExp;
  lat: number;
  lon: number;
}> = [
  { pattern: /canto\s*do\s*forte/i, lat: -24.0148, lon: -46.4048 },
  { pattern: /boqueir[aã]o/i, lat: -24.0112, lon: -46.4148 },
  { pattern: /guilhermina/i, lat: -24.0142, lon: -46.4278 },
  { pattern: /avia[cç][aã]o/i, lat: -24.0192, lon: -46.4448 },
  { pattern: /tupi/i, lat: -24.0245, lon: -46.4622 },
  { pattern: /ocian/i, lat: -24.0298, lon: -46.4792 },
  { pattern: /mirim/i, lat: -24.0358, lon: -46.4972 },
  { pattern: /maracan[aã]/i, lat: -24.0425, lon: -46.5158 },
  { pattern: /cai[cç]ara/i, lat: -24.0512, lon: -46.5392 },
  { pattern: /real/i, lat: -24.0588, lon: -46.5602 },
  { pattern: /fl[oó]rida/i, lat: -24.0655, lon: -46.5788 },
  { pattern: /solemar/i, lat: -24.0738, lon: -46.6012 },
];

export function formatShortPricePill(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    const formatted =
      millions % 1 === 0
        ? millions.toFixed(0)
        : millions.toFixed(2).replace(/0$/, '').replace('.', ',');
    return `R$ ${formatted} mi`;
  }
  if (price >= 1000) {
    return `R$ ${Math.round(price / 1000)} mil`;
  }
  return formatCurrency(price);
}

export function getCoordinatesForProperty(
  property: Property,
  index: number
): [number, number] {
  let baseLat = -24.0132;
  let baseLon = -46.4165;

  const loc = `${property.location} ${property.name}`;
  for (const item of NEIGHBORHOOD_BASE_COORDS) {
    if (item.pattern.test(loc)) {
      baseLat = item.lat;
      baseLon = item.lon;
      break;
    }
  }

  const distMeters = Math.max(0, property.beachDistance || 0);
  const inlandLatOffset = (distMeters / 111000) * 0.85;

  const hashSeed =
    property.id
      .split('')
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) +
    index * 17;
  const jitterLon = (((hashSeed % 11) - 5) * 0.0011);
  const jitterLat = ((((hashSeed >> 2) % 7) - 3) * 0.00045);

  return [baseLat + inlandLatOffset + jitterLat, baseLon + jitterLon];
}

const MAP_PRICE_PILL_CSS = `
.csi-leaflet-container {
  width: 100%;
  height: 100%;
  background: #E5E7EB;
  z-index: 1;
}

.csi-price-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.csi-price-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  background: #FFFFFF;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  font-size: 12.5px;
  font-weight: 800;
  padding: 5px 11px;
  border-radius: 999px;
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition: transform 0.16s ease, background-color 0.16s ease, color 0.16s ease;
  transform: translate(-50%, -50%);
}

.csi-price-pill:hover {
  transform: translate(-50%, -50%) scale(1.08);
  background: #111827;
  color: #FFFFFF;
  z-index: 999 !important;
}

.csi-price-pill-active {
  background: #111827;
  color: #FFFFFF;
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.4);
}

.csi-user-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2563EB;
  border: 3px solid #FFFFFF;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.25);
  transform: translate(-50%, -50%);
}

.leaflet-control-attribution {
  font-size: 9px !important;
  opacity: 0.65;
}
`;

export const PraiaGrandeMap: React.FC<PraiaGrandeMapProps> = ({
  properties,
  onSelectProperty,
  focusPropertyId,
  userLocation,
}) => {
  const mapHostRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const onSelectRef = useRef(onSelectProperty);
  onSelectRef.current = onSelectProperty;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    if (!document.getElementById('csi-map-pill-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'csi-map-pill-styles';
      styleEl.textContent = MAP_PRICE_PILL_CSS;
      document.head.appendChild(styleEl);
    }

    if (!document.getElementById('leaflet-css-cdn')) {
      const linkEl = document.createElement('link');
      linkEl.id = 'leaflet-css-cdn';
      linkEl.rel = 'stylesheet';
      linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkEl);
    }

    let isUnmounted = false;

    const initOrUpdateMap = () => {
      if (isUnmounted || !mapHostRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapHostRef.current, {
          center: [-24.0145, -46.422],
          zoom: 13,
          zoomControl: false,
        });

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 19,
            attribution: '© OpenStreetMap · CARTO',
          }
        ).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        markersLayerRef.current = layerGroup;

        setTimeout(() => {
          if (!isUnmounted && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 180);
      }

      const layerGroup = markersLayerRef.current;
      if (!layerGroup) return;
      layerGroup.clearLayers();

      const boundsPoints: Array<[number, number]> = [];
      let focusPoint: [number, number] | null = null;

      properties.forEach((prop, idx) => {
        const [lat, lon] = getCoordinatesForProperty(prop, idx);
        boundsPoints.push([lat, lon]);
        const isFocused = focusPropertyId === prop.id;
        if (isFocused) focusPoint = [lat, lon];

        const label = formatShortPricePill(prop.price);
        const icon = L.divIcon({
          className: 'csi-price-marker-wrap',
          html: `<div class="csi-price-pill${isFocused ? ' csi-price-pill-active' : ''}">${label}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([lat, lon], {
          icon,
          zIndexOffset: isFocused ? 1000 : 0,
        });
        marker.on('click', () => {
          onSelectRef.current(prop);
        });
        marker.addTo(layerGroup);
      });

      if (userLocation) {
        const userIcon = L.divIcon({
          className: 'csi-price-marker-wrap',
          html: '<div class="csi-user-dot"></div>',
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
        L.marker([userLocation.lat, userLocation.lon], {
          icon: userIcon,
          zIndexOffset: 2000,
        }).addTo(layerGroup);
      }

      if (focusPoint && mapInstanceRef.current) {
        mapInstanceRef.current.setView(focusPoint, 16);
      } else if (boundsPoints.length > 1 && mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(boundsPoints, {
          paddingTopLeft: [30, 120],
          paddingBottomRight: [30, 180],
          maxZoom: 15,
        });
      } else if (boundsPoints.length === 1 && mapInstanceRef.current) {
        mapInstanceRef.current.setView(boundsPoints[0], 15);
      }
    };

    if ((window as any).L) {
      initOrUpdateMap();
    } else {
      let scriptEl = document.getElementById(
        'leaflet-js-cdn'
      ) as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'leaflet-js-cdn';
        scriptEl.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        scriptEl.async = true;
        document.body.appendChild(scriptEl);
      }
      const onLoad = () => initOrUpdateMap();
      scriptEl.addEventListener('load', onLoad);
      return () => {
        isUnmounted = true;
        scriptEl?.removeEventListener('load', onLoad);
      };
    }

    return () => {
      isUnmounted = true;
    };
  }, [properties, focusPropertyId, userLocation]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webMapWrapper}>
        <div ref={mapHostRef} className="csi-leaflet-container" />
      </View>
    );
  }

  return (
    <View style={styles.nativeFallbackMap}>
      <Text style={styles.nativeMapTitle}>Mapa de Praia Grande</Text>
      <View style={styles.nativePillsWrap}>
        {properties.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.nativePricePill}
            onPress={() => onSelectProperty(p)}
          >
            <Text style={styles.nativePricePillText}>
              {formatShortPricePill(p.price)} · {p.location}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webMapWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  nativeFallbackMap: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  nativeMapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  nativePillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  nativePricePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    elevation: 3,
  },
  nativePricePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
});
