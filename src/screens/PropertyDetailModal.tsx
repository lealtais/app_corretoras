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
import {
  formatCurrency,
  formatBeachDistance,
  buildWhatsAppMessage,
  openExternalWhatsApp,
} from '../components/PropertyCard';
import { IconButton, AmenitiesGrid, NotesList, Button } from '../components/ui';
import { theme } from '../constants/theme';
import { AGENCY_CONFIG } from '../constants/agency';

interface PropertyDetailModalProps {
  visible: boolean;
  property: Property | null;
  isAdmin: boolean;
  onClose: () => void;
  onEdit: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  visible,
  property,
  isAdmin,
  onClose,
  onEdit,
  onToggleFavorite,
}) => {
  if (!property) return null;

  const readyMessage = buildWhatsAppMessage(property);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.imageBannerContainer}>
          <Image
            source={{ uri: property.imageUrl }}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          <IconButton
            style={styles.closeButton}
            onPress={onClose}
            icon={<Ionicons name="close" size={24} color="#1F2937" />}
          />

          <IconButton
            style={isAdmin ? styles.favoriteButton : styles.favoriteButtonRight}
            onPress={() => onToggleFavorite(property.id)}
            icon={
              <Ionicons
                name={property.isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={property.isFavorite ? theme.colors.favorite : '#1F2937'}
              />
            }
          />

          {isAdmin && (
            <IconButton
              style={styles.editBannerButton}
              onPress={() => onEdit(property)}
              icon={<Ionicons name="pencil" size={20} color="#1F2937" />}
            />
          )}

          {property.aiEnhancedLabel && (
            <View style={styles.aiEnhancedBanner}>
              <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              <Text style={styles.aiEnhancedBannerText}>{property.aiEnhancedLabel}</Text>
            </View>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.metaRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Imóvel {property.status}</Text>
            </View>
            <Text style={styles.codeText}>
              {property.code} • {property.type}
            </Text>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.propertyName}>{property.name}</Text>
            {isAdmin && (
              <TouchableOpacity
                onPress={() => onEdit(property)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="pencil" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.propertyPrice}>{formatCurrency(property.price)}</Text>

          <View style={styles.feesRow}>
            {property.condominium !== undefined && property.condominium > 0 && (
              <Text style={styles.feeText}>Cond. {formatCurrency(property.condominium)}</Text>
            )}
            {property.iptu !== undefined && property.iptu > 0 && (
              <Text style={styles.feeText}>IPTU {formatCurrency(property.iptu)}</Text>
            )}
            <Text style={styles.feeText}>Área: {property.area} m²</Text>
          </View>

          <View style={styles.infoHighlightsBox}>
            <View style={styles.highlightItem}>
              <Ionicons name="sunny" size={18} color="#0284C7" />
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightLabel}>Distância da Praia</Text>
                <Text style={styles.highlightValue}>
                  {formatBeachDistance(property.beachDistance)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.highlightItem}>
              <Ionicons name="location-outline" size={18} color={theme.colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightLabel}>Região do Imóvel</Text>
                <Text style={styles.highlightValue}>{property.location}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.highlightItem}>
              <Ionicons name="business" size={18} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightLabel}>Endereço da Imobiliária</Text>
                <Text style={[styles.highlightValue, { color: theme.colors.primary }]}>
                  {property.agencyAddress || AGENCY_CONFIG.address}
                </Text>
              </View>
            </View>
          </View>

          <AmenitiesGrid
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            parkingSpaces={property.parkingSpaces}
          />

          <View style={styles.whatsappCard}>
            <View style={styles.whatsappHeader}>
              <Ionicons name="logo-whatsapp" size={20} color="#16A34A" />
              <Text style={styles.whatsappTitle}>
                Atendimento via WhatsApp ({AGENCY_CONFIG.whatsappDisplay})
              </Text>
            </View>
            <Text style={styles.whatsappSub}>
              Mensagem pronta indicando este imóvel:
            </Text>
            <View style={styles.messagePreviewBox}>
              <Text style={styles.messagePreviewText}>"{readyMessage}"</Text>
            </View>

            <TouchableOpacity
              style={styles.whatsappPrimaryBtn}
              onPress={() => openExternalWhatsApp(property)}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.whatsappPrimaryBtnText}>
                Chamar no WhatsApp
              </Text>
            </TouchableOpacity>
          </View>

          {isAdmin && (
            <View style={styles.adminOnlySection}>
              <View style={styles.adminBadgeRow}>
                <Ionicons name="lock-closed" size={15} color="#B45309" />
                <Text style={styles.adminBadgeTitle}>
                  Anotações Internas
                </Text>
              </View>
              <NotesList notes={property.notes} />

              <Button
                label="Editar Informações do Imóvel"
                onPress={() => onEdit(property)}
                leftIcon={<Ionicons name="create-outline" size={20} color="#FFFFFF" />}
              />
            </View>
          )}
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
    height: 250,
    backgroundColor: '#D1D5DB',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 44,
    left: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 44,
    right: 68,
  },
  favoriteButtonRight: {
    position: 'absolute',
    top: 44,
    right: 20,
  },
  editBannerButton: {
    position: 'absolute',
    top: 44,
    right: 20,
  },
  aiEnhancedBanner: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(109, 40, 217, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  aiEnhancedBannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  contentContainer: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
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
  propertyPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.textMain,
    marginTop: 6,
  },
  feesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  feeText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  infoHighlightsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 18,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  highlightValue: {
    fontSize: 13,
    color: theme.colors.textMain,
    fontWeight: '700',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  whatsappCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  whatsappHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whatsappTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#14532D',
  },
  whatsappSub: {
    fontSize: 12,
    color: '#166534',
    marginTop: 6,
    fontWeight: '600',
  },
  messagePreviewBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  messagePreviewText: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  whatsappPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  whatsappPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  adminOnlySection: {
    marginTop: 8,
    padding: 14,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  adminBadgeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
});
