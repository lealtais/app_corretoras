import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { formatCurrency } from '../components/PropertyCard';
import { IconButton, AmenitiesGrid, NotesList, Button } from '../components/ui';
import { theme } from '../constants/theme';

interface PropertyDetailModalProps {
  visible: boolean;
  property: Property | null;
  onClose: () => void;
  onEdit: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  visible,
  property,
  onClose,
  onEdit,
  onToggleFavorite,
}) => {
  if (!property) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Image Banner */}
        <View style={styles.imageBannerContainer}>
          <Image
            source={{ uri: property.imageUrl }}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          {/* Close Button */}
          <IconButton
            style={styles.closeButton}
            onPress={onClose}
            icon={<Ionicons name="close" size={24} color="#1F2937" />}
          />

          {/* Favorite Button */}
          <IconButton
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(property.id)}
            icon={
              <Ionicons
                name={property.isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={property.isFavorite ? theme.colors.favorite : '#1F2937'}
              />
            }
          />

          {/* Edit Button in Image Top-Right */}
          <IconButton
            style={styles.editBannerButton}
            onPress={() => onEdit(property)}
            icon={<Ionicons name="pencil" size={20} color="#1F2937" />}
          />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* Header Row with Name and Edit pencil */}
          <View style={styles.titleRow}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <TouchableOpacity onPress={() => onEdit(property)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="pencil" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.propertyType}>{property.type}</Text>
          <Text style={styles.propertyLocation}>{property.location}</Text>

          {/* Main Price */}
          <Text style={styles.propertyPrice}>{formatCurrency(property.price)}</Text>

          {/* Fees row (Condominium & IPTU) */}
          <View style={styles.feesRow}>
            {property.condominium !== undefined && property.condominium > 0 && (
              <Text style={styles.feeText}>Cond. {formatCurrency(property.condominium)}</Text>
            )}
            {property.iptu !== undefined && property.iptu > 0 && (
              <Text style={styles.feeText}>IPTU {formatCurrency(property.iptu)}</Text>
            )}
            <Text style={styles.feeText}>Área: {property.area} m²</Text>
          </View>

          {/* Amenities Grid Component */}
          <AmenitiesGrid
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            parkingSpaces={property.parkingSpaces}
          />

          {/* Notes List Component */}
          <NotesList notes={property.notes} />

          {/* Action Button Component */}
          <Button
            label="Editar Informações do Imóvel"
            onPress={() => onEdit(property)}
            leftIcon={<Ionicons name="create-outline" size={20} color="#FFFFFF" />}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageBannerContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#D1D5DB',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    left: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 48,
    right: 68,
  },
  editBannerButton: {
    position: 'absolute',
    top: 48,
    right: 20,
  },
  contentContainer: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textMain,
    flex: 1,
    marginRight: 8,
  },
  propertyType: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  propertyPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.textMain,
  },
  feesRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  feeText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
});
