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
  openExternalWhatsApp,
} from '../components/PropertyCard';
import { NotesList } from '../components/ui';
import { theme } from '../constants/theme';
import { AGENCY_CONFIG } from '../constants/agency';
import {
  BrandArchitecturalLogo,
  LucideWaves,
  LucideLayoutGrid,
  LucideReceipt,
  LucideAward,
  LucideArrowLeft,
  LucidePencil,
  LucideHeart,
} from '../components/LucideIcons';

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

  const isFrontBeach = (property.beachDistance ?? 0) <= 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.screen}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: property.imageUrl }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            <View style={styles.topActionsBar}>
              <TouchableOpacity
                style={styles.circleActionBtn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <LucideArrowLeft size={20} color="#111827" />
              </TouchableOpacity>

              <View style={styles.topRightGroup}>
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.circleActionBtn}
                    onPress={() => onEdit(property)}
                    activeOpacity={0.8}
                  >
                    <LucidePencil size={18} color="#111827" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.circleActionBtn}
                  onPress={() => onToggleFavorite(property.id)}
                  activeOpacity={0.8}
                >
                  <LucideHeart
                    size={20}
                    color={property.isFavorite ? '#E11D48' : '#111827'}
                    filled={property.isFavorite}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.photoCounterPill}>
              <Text style={styles.photoCounterText}>{property.code}</Text>
            </View>
          </View>

          <View style={styles.sheetCard}>
            <Text style={styles.titleCentered}>{property.name}</Text>

            <Text style={styles.subtitleLocation}>
              {property.type} em {property.location}
            </Text>

            <Text style={styles.specsInline}>
              {property.area} m² · {property.bedrooms} quarto(s) ·{' '}
              {property.bathrooms} banheiro(s) · {property.parkingSpaces || 0}{' '}
              vaga(s)
            </Text>

            <View style={styles.threeColStrip}>
              <View style={styles.stripCol}>
                <Text style={styles.stripBigValue}>
                  {isFrontBeach ? '0m' : `${property.beachDistance}m`}
                </Text>
                <Text style={styles.stripSmallLabel}>
                  {isFrontBeach ? 'Frente mar' : 'Da praia'}
                </Text>
              </View>

              <View style={styles.stripVerticalDivider} />

              <View style={styles.stripColCenter}>
                <View style={styles.laurelRow}>
                  <LucideAward size={16} color="#111827" />
                  <Text style={styles.laurelCenterText}>{property.status}</Text>
                </View>
                <Text style={styles.stripSmallLabel}>Status atual</Text>
              </View>

              <View style={styles.stripVerticalDivider} />

              <View style={styles.stripCol}>
                <Text style={styles.stripBigValue}>{property.area}m²</Text>
                <Text style={styles.stripSmallLabel}>Área útil</Text>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            <View style={styles.hostRow}>
              <View style={styles.hostAvatar}>
                <BrandArchitecturalLogo size={42} color="#09090B" />
              </View>
              <View style={styles.hostTextCol}>
                <Text style={styles.hostTitle}>
                  Anunciado por Corretoras de Sucesso
                </Text>
                <Text style={styles.hostSubtitle}>
                  {property.agencyAddress || AGENCY_CONFIG.address}
                </Text>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <LucideWaves size={22} color="#111827" />
                </View>
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>
                    {formatBeachDistance(property.beachDistance)}
                  </Text>
                  <Text style={styles.featureDesc}>
                    Localizado na região de {property.location}, calculado por
                    geolocalização até a orla de Praia Grande.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <LucideLayoutGrid size={21} color="#111827" />
                </View>
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>
                    Planta de {property.area} m² bem distribuídos
                  </Text>
                  <Text style={styles.featureDesc}>
                    Conta com {property.bedrooms} dormitório(s),{' '}
                    {property.bathrooms} banheiro(s) e{' '}
                    {property.parkingSpaces || 0} vaga(s) de garagem.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <LucideReceipt size={21} color="#111827" />
                </View>
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Taxas e Encargos</Text>
                  <Text style={styles.featureDesc}>
                    Condomínio:{' '}
                    {property.condominium
                      ? formatCurrency(property.condominium)
                      : 'Isento'}{' '}
                    · IPTU:{' '}
                    {property.iptu ? formatCurrency(property.iptu) : 'Isento'}
                  </Text>
                </View>
              </View>
            </View>

            {isAdmin && (
              <View style={styles.adminOnlySection}>
                <View style={styles.adminBadgeRow}>
                  <Ionicons name="lock-closed" size={15} color="#B45309" />
                  <Text style={styles.adminBadgeTitle}>Anotações Internas</Text>
                </View>
                <NotesList notes={property.notes} />

                <TouchableOpacity
                  style={styles.adminEditBtn}
                  onPress={() => onEdit(property)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.adminEditBtnText}>
                    Editar Informações do Imóvel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomBookingBar}>
          <View style={styles.priceColumn}>
            <Text style={styles.bottomPriceValue}>
              {formatCurrency(property.price)}
            </Text>
            <Text style={styles.bottomPriceSub}>
              {property.type} · {property.status}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.reserveWhatsappBtn}
            onPress={() => openExternalWhatsApp(property)}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
            <Text style={styles.reserveWhatsappBtnText}>
              Chamar no WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroContainer: {
    width: '100%',
    height: 310,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topActionsBar: {
    position: 'absolute',
    top: 20,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  photoCounterPill: {
    position: 'absolute',
    bottom: 42,
    right: 18,
    backgroundColor: 'rgba(17, 24, 39, 0.78)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  photoCounterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sheetCard: {
    marginTop: -28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 20,
  },
  titleCentered: {
    fontSize: 23,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 29,
    letterSpacing: -0.3,
  },
  subtitleLocation: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 8,
  },
  specsInline: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 3,
  },
  threeColStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 22,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  stripCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripColCenter: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripBigValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  laurelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  laurelCenterText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  stripSmallLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  stripVerticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 18,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostTextCol: {
    flex: 1,
  },
  hostTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  hostSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  featureList: {
    gap: 20,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  featureIconWrap: {
    width: 28,
    alignItems: 'center',
    paddingTop: 2,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  featureDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 18,
  },
  adminOnlySection: {
    marginTop: 22,
    padding: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
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
  adminEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  adminEditBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomBookingBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceColumn: {
    justifyContent: 'center',
  },
  bottomPriceValue: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    textDecorationLine: 'underline',
  },
  bottomPriceSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reserveWhatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A34A',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
  },
  reserveWhatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
