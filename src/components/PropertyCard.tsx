import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { theme } from '../constants/theme';
import { AGENCY_CONFIG } from '../constants/agency';
import { LucideMapPin, LucideHeart } from './LucideIcons';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const formatCurrency = (val: number): string => {
  return 'R$ ' + val.toLocaleString('pt-BR');
};

export const formatBeachDistance = (meters?: number): string => {
  if (meters === undefined || meters <= 0) {
    return 'Frente mar (0m)';
  }
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km da praia`;
  }
  return `${meters}m da praia`;
};

export const buildWhatsAppMessage = (property: Property): string => {
  const codePart = property.code ? `[${property.code}] ` : '';
  return `Olá! Vi no app ${AGENCY_CONFIG.name} o imóvel ${codePart}${property.name} (${property.type} • ${formatCurrency(property.price)} • ${formatBeachDistance(property.beachDistance)} • Região: ${property.location}) e gostaria de mais informações!`;
};

export const openExternalWhatsApp = (property: Property) => {
  const text = encodeURIComponent(buildWhatsAppMessage(property));
  const url = `https://api.whatsapp.com/send?phone=${AGENCY_CONFIG.whatsappNumber}&text=${text}`;
  
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      }
      return Linking.openURL(`https://wa.me/${AGENCY_CONFIG.whatsappNumber}?text=${text}`);
    })
    .catch(() => {
      Linking.openURL(`https://wa.me/${AGENCY_CONFIG.whatsappNumber}?text=${text}`);
    });
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  onToggleFavorite,
}) => {
  const isAvailable = property.status === 'Disponível';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.imageSection}>
        <Image
          source={{ uri: property.imageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View
          style={[
            styles.statusBadge,
            isAvailable ? styles.statusAvailable : styles.statusReserved,
          ]}
        >
          <Text style={styles.statusText}>Imóvel {property.status}</Text>
        </View>
        {property.aiEnhancedLabel && (
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={10} color="#FFFFFF" />
            <Text style={styles.aiBadgeText}>Foto IA</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <Text style={styles.typeAndCode}>
            {property.code ? `${property.code} • ` : ''}
            {property.type}
          </Text>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onToggleFavorite}
          >
            <LucideHeart
              size={20}
              color={property.isFavorite ? theme.colors.favorite : theme.colors.textLight}
              filled={property.isFavorite}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.propertyName} numberOfLines={1}>
          {property.name}
        </Text>

        <Text style={styles.propertyPrice}>
          {formatCurrency(property.price)}
        </Text>

        <View style={styles.specsRow}>
          {property.bedrooms > 0 && (
            <View style={styles.specChip}>
              <Text style={styles.specText}>{property.bedrooms} quartos</Text>
            </View>
          )}
          <View style={styles.specChip}>
            <Text style={[styles.specText, { color: '#0369A1', fontWeight: '700' }]}>
              {formatBeachDistance(property.beachDistance)}
            </Text>
          </View>
          <View style={styles.specChip}>
            <Text style={styles.specText}>{property.area} m²</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <LucideMapPin size={12} color={theme.colors.textSecondary} />
          <Text style={styles.propertyLocation} numberOfLines={1}>
            Região: {property.location}
          </Text>
        </View>

        <View style={styles.agencyBox}>
          <Text style={styles.agencyText} numberOfLines={1}>
            Imobiliária: {property.agencyAddress || AGENCY_CONFIG.address}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={() => openExternalWhatsApp(property)}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-whatsapp" size={15} color="#FFFFFF" />
          <Text style={styles.whatsappBtnText}>Tenho Interesse (Chamar no WhatsApp)</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    elevation: 2,
  },
  imageSection: {
    width: '100%',
    height: 170,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: '#16A34A',
  },
  statusReserved: {
    backgroundColor: '#D97706',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  aiBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeAndCode: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textMain,
    marginTop: 2,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specText: {
    fontSize: 11,
    color: theme.colors.textMain,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  propertyLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  agencyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  agencyText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '700',
    flex: 1,
  },
  whatsappBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    paddingVertical: 9,
    borderRadius: 8,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
