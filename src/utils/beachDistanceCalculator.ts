const EARTH_RADIUS_METERS = 6371000;

const ORLA_PRAIA_GRANDE_COORDS: Array<[number, number]> = [
  [-24.0163, -46.4018],
  [-24.0141, -46.4082],
  [-24.0124, -46.4148],
  [-24.0138, -46.4215],
  [-24.0155, -46.4285],
  [-24.0181, -46.4368],
  [-24.0205, -46.4452],
  [-24.0232, -46.4541],
  [-24.0258, -46.4628],
  [-24.0286, -46.4712],
  [-24.0314, -46.4795],
  [-24.0345, -46.4885],
  [-24.0375, -46.4975],
  [-24.0408, -46.5068],
  [-24.0442, -46.5162],
  [-24.0485, -46.5281],
  [-24.0528, -46.5398],
  [-24.0566, -46.5503],
  [-24.0604, -46.5608],
  [-24.0638, -46.5701],
  [-24.0672, -46.5795],
  [-24.0713, -46.5908],
  [-24.0755, -46.6020],
];

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

function pointToSegmentDistanceMeters(
  pLat: number,
  pLon: number,
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number
): number {
  const cosLat = Math.cos(toRadians(pLat));
  const px = pLon * cosLat;
  const py = pLat;
  const ax = aLon * cosLat;
  const ay = aLat;
  const bx = bLon * cosLat;
  const by = bLat;

  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  let t = 0;
  if (lenSq > 0) {
    t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
  }

  const projLon = aLon + t * (bLon - aLon);
  const projLat = aLat + t * (bLat - aLat);

  return haversineMeters(pLat, pLon, projLat, projLon);
}

export function calculateMetersToPraiaGrandeShoreline(
  lat: number,
  lon: number
): number {
  let minMeters = Infinity;
  for (let i = 0; i < ORLA_PRAIA_GRANDE_COORDS.length - 1; i++) {
    const [aLat, aLon] = ORLA_PRAIA_GRANDE_COORDS[i];
    const [bLat, bLon] = ORLA_PRAIA_GRANDE_COORDS[i + 1];
    const dist = pointToSegmentDistanceMeters(lat, lon, aLat, aLon, bLat, bLon);
    if (dist < minMeters) {
      minMeters = dist;
    }
  }
  if (minMeters <= 45) {
    return 0;
  }
  return Math.round(minMeters / 5) * 5;
}

const KNOWN_STREET_COORDS: Array<{
  pattern: RegExp;
  lat: number;
  lon: number;
}> = [
  { pattern: /castelo\s*branco/i, lat: -24.0142, lon: -46.4085 },
  { pattern: /marechal\s*mallet|mal\.?\s*mallet/i, lat: -24.0122, lon: -46.4038 },
  { pattern: /presidente\s*kennedy|pres\.?\s*kennedy/i, lat: -24.0091, lon: -46.4145 },
  { pattern: /costa\s*e\s*silva/i, lat: -24.0098, lon: -46.4126 },
  { pattern: /paris/i, lat: -24.0121, lon: -46.4076 },
  { pattern: /pernambuco/i, lat: -24.0108, lon: -46.4139 },
  { pattern: /rio\s*de\s*janeiro/i, lat: -24.0119, lon: -46.4109 },
  { pattern: /esp[ií]rito\s*santo/i, lat: -24.0129, lon: -46.4089 },
  { pattern: / brasil/i, lat: -24.0112, lon: -46.4162 },
  { pattern: /guilhermina/i, lat: -24.0141, lon: -46.4282 },
  { pattern: /avia[cç][aã]o/i, lat: -24.0185, lon: -46.4448 },
  { pattern: /tupi/i, lat: -24.0235, lon: -46.4622 },
  { pattern: /ocian/i, lat: -24.0289, lon: -46.4791 },
  { pattern: /mirim/i, lat: -24.0352, lon: -46.4971 },
  { pattern: /cai[cç]ara/i, lat: -24.0496, lon: -46.5392 },
  { pattern: /canto\s*do\s*forte/i, lat: -24.0148, lon: -46.4055 },
  { pattern: /boqueir[aã]o/i, lat: -24.0102, lon: -46.4148 },
];

export async function geocodeAndCalculateBeachDistance(
  addressOrLocation: string
): Promise<{
  distanceMeters: number;
  resolvedAddress: string;
  lat: number;
  lon: number;
}> {
  const cleaned = addressOrLocation.trim();
  if (/castelo\s*branco|orla|beira\s*mar|frente\s*mar/i.test(cleaned)) {
    return {
      distanceMeters: 0,
      resolvedAddress: cleaned,
      lat: -24.0141,
      lon: -46.4082,
    };
  }

  const fullQuery = cleaned.toLowerCase().includes('praia grande')
    ? cleaned
    : `${cleaned}, Praia Grande, SP, Brasil`;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      fullQuery
    )}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (res.ok) {
      const results = await res.json();
      if (Array.isArray(results) && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          const distanceMeters = calculateMetersToPraiaGrandeShoreline(lat, lon);
          return {
            distanceMeters,
            resolvedAddress: results[0].display_name || fullQuery,
            lat,
            lon,
          };
        }
      }
    }
  } catch (err) {
    void err;
  }

  for (const item of KNOWN_STREET_COORDS) {
    if (item.pattern.test(cleaned)) {
      const distanceMeters = calculateMetersToPraiaGrandeShoreline(
        item.lat,
        item.lon
      );
      return {
        distanceMeters,
        resolvedAddress: fullQuery,
        lat: item.lat,
        lon: item.lon,
      };
    }
  }

  const defaultLat = -24.0132;
  const defaultLon = -46.4125;
  return {
    distanceMeters: calculateMetersToPraiaGrandeShoreline(defaultLat, defaultLon),
    resolvedAddress: fullQuery,
    lat: defaultLat,
    lon: defaultLon,
  };
}
