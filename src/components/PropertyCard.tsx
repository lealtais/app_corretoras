import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { theme } from '../constants/theme';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const formatCurrency = (val: number): string => {
  return 'R$ ' + val.toLocaleString('pt-BR');
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: property.imageUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <Text style={styles.propertyName} numberOfLines={1}>
            {property.name}
          </Text>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onToggleFavorite}
          >
            <Ionicons
              name={property.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={property.isFavorite ? theme.colors.favorite : theme.colors.textLight}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.propertyType}>{property.type}</Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          {property.location}
        </Text>
        <Text style={styles.propertyArea}>{property.area} m²</Text>

        <Text style={styles.propertyPrice}>
          {formatCurrency(property.price)}
        </Text>
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
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  thumbnail: {
    width: 120,
    height: 120,
    backgroundColor: '#E5E7EB',
  },
  infoContainer: {
    flex: 1,
    padding: theme.spacing.sm + 2,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMain,
    flex: 1,
    marginRight: 6,
  },
  propertyType: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  propertyLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  propertyArea: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  propertyPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textMain,
    marginTop: 2,
  },
});
