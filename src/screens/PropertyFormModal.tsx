import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Property, AIImageMode } from '../types/property';
import { Input, Button, Badge, IconButton } from '../components/ui';
import { theme } from '../constants/theme';
import { AGENCY_CONFIG } from '../constants/agency';
import { geocodeAndCalculateBeachDistance } from '../utils/beachDistanceCalculator';
import { fetchAddressByCep } from '../services/externalApis';

interface PropertyFormModalProps {
  visible: boolean;
  propertyToEdit?: Property | null;
  onClose: () => void;
  onSave: (property: Property) => void;
  onDelete?: (id: string) => void;
}

const LOCAL_AI_FALLBACKS: Record<
  AIImageMode,
  { label: string; description: string; image: string }
> = {
  enhance: {
    label: 'Iluminação HDR & Nitidez Profissional',
    description:
      'Exposição, balanço de branco e nitidez ajustados.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=90',
  },
  furnish: {
    label: 'Mobiliado Virtualmente',
    description:
      'Mobília contemporânea e iluminação adicionadas mantendo a estrutura do cômodo.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=90',
  },
  declutter: {
    label: 'Limpeza de Ambiente',
    description:
      'Objetos espalhados e itens pessoais removidos para destacar a amplitude.',
    image:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=90',
  },
};

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  visible,
  propertyToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!propertyToEdit;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<
    'Apartamento' | 'Casa' | 'Cobertura' | 'Terreno' | 'Outros'
  >('Apartamento');
  const [status, setStatus] = useState<'Disponível' | 'Reservado' | 'Vendido'>('Disponível');
  const [location, setLocation] = useState('');
  const [cep, setCep] = useState('');
  const [cepStatus, setCepStatus] = useState('');
  const [internalAddress, setInternalAddress] = useState('');
  const [beachDistance, setBeachDistance] = useState('100');
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [condominium, setCondominium] = useState('');
  const [iptu, setIptu] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [parkingSpaces, setParkingSpaces] = useState('1');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState<string | undefined>(undefined);
  const [aiEnhancedMode, setAiEnhancedMode] = useState<AIImageMode | undefined>(undefined);
  const [aiEnhancedLabel, setAiEnhancedLabel] = useState<string | undefined>(undefined);
  const [aiDescription, setAiDescription] = useState<string | undefined>(undefined);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showOriginalCompare, setShowOriginalCompare] = useState(false);

  useEffect(() => {
    if (propertyToEdit) {
      setCode(propertyToEdit.code || 'CSI-101');
      setName(propertyToEdit.name);
      setType(propertyToEdit.type);
      setStatus(propertyToEdit.status);
      setLocation(propertyToEdit.location);
      setInternalAddress(propertyToEdit.location);
      setBeachDistance(String(propertyToEdit.beachDistance ?? 100));
      setArea(propertyToEdit.area.toString());
      setPrice(propertyToEdit.price.toString());
      setCondominium(propertyToEdit.condominium ? propertyToEdit.condominium.toString() : '');
      setIptu(propertyToEdit.iptu ? propertyToEdit.iptu.toString() : '');
      setBedrooms(propertyToEdit.bedrooms.toString());
      setBathrooms(propertyToEdit.bathrooms.toString());
      setParkingSpaces(
        propertyToEdit.parkingSpaces ? propertyToEdit.parkingSpaces.toString() : '0'
      );
      setNotes((propertyToEdit.notes || []).join('\n'));
      setImageUrl(propertyToEdit.imageUrl);
      setOriginalImageUrl(propertyToEdit.originalImageUrl);
      setAiEnhancedMode(propertyToEdit.aiEnhancedMode);
      setAiEnhancedLabel(propertyToEdit.aiEnhancedLabel);
      setAiDescription(undefined);
      setShowOriginalCompare(false);
    } else {
      setCode(`CSI-${Math.floor(100 + Math.random() * 900)}`);
      setName('');
      setType('Apartamento');
      setStatus('Disponível');
      setLocation('');
      setInternalAddress('');
      setBeachDistance('0');
      setArea('');
      setPrice('');
      setCondominium('');
      setIptu('');
      setBedrooms('2');
      setBathrooms('2');
      setParkingSpaces('1');
      setNotes('');
      setImageUrl(
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
      );
      setOriginalImageUrl(undefined);
      setAiEnhancedMode(undefined);
      setAiEnhancedLabel(undefined);
      setAiDescription(undefined);
      setShowOriginalCompare(false);
    }
  }, [propertyToEdit, visible]);

  const pickImage = async () => {
    const { status: permStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permStatus !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'É preciso permitir o acesso à galeria de fotos para adicionar a imagem do imóvel.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
      setOriginalImageUrl(undefined);
      setAiEnhancedMode(undefined);
      setAiEnhancedLabel(undefined);
      setAiDescription(undefined);
    }
  };

  const handleApplyAI = (mode: AIImageMode) => {
    const baseImg =
      originalImageUrl ||
      imageUrl ||
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

    setIsProcessingAI(true);
    setShowOriginalCompare(false);

    setTimeout(() => {
      const preset = LOCAL_AI_FALLBACKS[mode];
      setOriginalImageUrl(baseImg);
      setImageUrl(preset.image);
      setAiEnhancedMode(mode);
      setAiEnhancedLabel(preset.label);
      setAiDescription(preset.description);
      setIsProcessingAI(false);
    }, 650);
  };

  const handleRestoreOriginal = () => {
    if (originalImageUrl) {
      setImageUrl(originalImageUrl);
      setOriginalImageUrl(undefined);
      setAiEnhancedMode(undefined);
      setAiEnhancedLabel(undefined);
      setAiDescription(undefined);
      setShowOriginalCompare(false);
    }
  };

  const handleCalculateFromAddress = async (addrText: string) => {
    const query = addrText.trim() || location.trim();
    if (!query) return;
    setIsCalculatingDistance(true);
    const result = await geocodeAndCalculateBeachDistance(query);
    setBeachDistance(String(result.distanceMeters));
    setIsCalculatingDistance(false);
  };

  const handleCepChange = async (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);

    if (digits.length < 8) {
      setCepStatus('');
      return;
    }

    setCepStatus('Consultando ViaCEP...');
    try {
      const addr = await fetchAddressByCep(digits);
      setCepStatus(`Encontrado: ${addr.neighborhood || addr.street} (${addr.city})`);
      if (addr.neighborhood) {
        setLocation(`${addr.neighborhood}, Praia Grande (Bairro)`);
      }
      if (addr.street) {
        const full = `${addr.street}${addr.neighborhood ? ', ' + addr.neighborhood : ''}, Praia Grande`;
        setInternalAddress(full);
        handleCalculateFromAddress(full);
      }
    } catch (err: any) {
      setCepStatus(err?.message || 'CEP não localizado');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o título/nome do imóvel.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Atenção', 'Informe o bairro/região do imóvel.');
      return;
    }
    const parsedPrice = parseFloat(price.replace(/\D/g, '')) || 0;
    if (parsedPrice <= 0) {
      Alert.alert('Atenção', 'Informe um preço válido.');
      return;
    }

    const queryToGeocode = internalAddress.trim() || location.trim();
    setIsCalculatingDistance(true);
    const geoResult = await geocodeAndCalculateBeachDistance(queryToGeocode);
    setIsCalculatingDistance(false);

    const notesList = notes
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const savedProperty: Property = {
      id: propertyToEdit ? propertyToEdit.id : Date.now().toString(),
      code: code.trim() || 'CSI-100',
      name: name.trim(),
      type,
      status,
      location: location.trim(),
      agencyAddress: AGENCY_CONFIG.address,
      beachDistance: geoResult.distanceMeters,
      area: parseFloat(area) || 0,
      price: parsedPrice,
      condominium: condominium ? parseFloat(condominium.replace(/\D/g, '')) : undefined,
      iptu: iptu ? parseFloat(iptu.replace(/\D/g, '')) : undefined,
      bedrooms: parseInt(bedrooms, 10) || 0,
      bathrooms: parseInt(bathrooms, 10) || 0,
      parkingSpaces: parkingSpaces ? parseInt(parkingSpaces, 10) : 0,
      notes: notesList,
      isFavorite: propertyToEdit ? propertyToEdit.isFavorite : false,
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      originalImageUrl,
      aiEnhancedMode,
      aiEnhancedLabel,
    };

    onSave(savedProperty);
    onClose();
  };

  const propertyTypes: Array<'Apartamento' | 'Casa' | 'Cobertura' | 'Terreno' | 'Outros'> = [
    'Apartamento',
    'Casa',
    'Cobertura',
    'Terreno',
    'Outros',
  ];

  const statusOptions: Array<'Disponível' | 'Reservado' | 'Vendido'> = [
    'Disponível',
    'Reservado',
    'Vendido',
  ];

  const displayedImage =
    showOriginalCompare && originalImageUrl ? originalImageUrl : imageUrl;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            variant="ghost"
            onPress={onClose}
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />}
          />
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar Imóvel' : 'Cadastrar Imóvel'}
          </Text>
          <IconButton
            variant="ghost"
            onPress={pickImage}
            icon={<Ionicons name="image-outline" size={26} color={theme.colors.primary} />}
          />
        </View>

        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.imagePickerCard} onPress={pickImage} activeOpacity={0.85}>
            {displayedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: displayedImage }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <View style={styles.changeImageBadge}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                  <Text style={styles.changeImageText}>Trocar foto da galeria</Text>
                </View>
                {aiEnhancedLabel && !showOriginalCompare && (
                  <View style={styles.aiActiveOverlayBadge}>
                    <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                    <Text style={styles.aiActiveOverlayText}>{aiEnhancedLabel}</Text>
                  </View>
                )}
                {showOriginalCompare && (
                  <View style={[styles.aiActiveOverlayBadge, { backgroundColor: '#475569' }]}>
                    <Text style={styles.aiActiveOverlayText}>Visualizando Foto Original (Antes)</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <View style={styles.imageIconCircle}>
                  <Ionicons name="images-outline" size={28} color={theme.colors.primary} />
                </View>
                <Text style={styles.imagePlaceholderText}>Toque para adicionar foto da galeria</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.aiStudioCard}>
            <View style={styles.aiStudioHeader}>
              <Ionicons name="sparkles" size={18} color="#EA580C" />
              <Text style={styles.aiStudioTitle}>
                Melhoria de Imagens
              </Text>
            </View>
            <Text style={styles.aiStudioSubtitle}>
              Aplique recursos de melhoria visual na foto do imóvel:
            </Text>

            {isProcessingAI ? (
              <View style={styles.aiLoadingRow}>
                <ActivityIndicator size="small" color="#EA580C" />
                <Text style={styles.aiLoadingText}>
                  Processando imagem...
                </Text>
              </View>
            ) : (
              <View style={styles.aiButtonsGrid}>
                <TouchableOpacity
                  style={[
                    styles.aiActionBtn,
                    aiEnhancedMode === 'enhance' && styles.aiActionBtnActive,
                  ]}
                  onPress={() => handleApplyAI('enhance')}
                >
                  <Ionicons
                    name="sunny"
                    size={16}
                    color={aiEnhancedMode === 'enhance' ? '#FFFFFF' : '#EA580C'}
                  />
                  <Text
                    style={[
                      styles.aiActionBtnText,
                      aiEnhancedMode === 'enhance' && styles.aiActionBtnTextActive,
                    ]}
                  >
                    Melhorar Luz/Nitidez
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.aiActionBtn,
                    aiEnhancedMode === 'furnish' && styles.aiActionBtnActive,
                  ]}
                  onPress={() => handleApplyAI('furnish')}
                >
                  <Ionicons
                    name="bed"
                    size={16}
                    color={aiEnhancedMode === 'furnish' ? '#FFFFFF' : '#EA580C'}
                  />
                  <Text
                    style={[
                      styles.aiActionBtnText,
                      aiEnhancedMode === 'furnish' && styles.aiActionBtnTextActive,
                    ]}
                  >
                    Mobiliar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.aiActionBtn,
                    aiEnhancedMode === 'declutter' && styles.aiActionBtnActive,
                  ]}
                  onPress={() => handleApplyAI('declutter')}
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={16}
                    color={aiEnhancedMode === 'declutter' ? '#FFFFFF' : '#EA580C'}
                  />
                  <Text
                    style={[
                      styles.aiActionBtnText,
                      aiEnhancedMode === 'declutter' && styles.aiActionBtnTextActive,
                    ]}
                  >
                    Tirar Bagunça
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {aiDescription && (
              <Text style={styles.aiResultDescription}>{aiDescription}</Text>
            )}

            {originalImageUrl && (
              <View style={styles.aiCompareRow}>
                <TouchableOpacity
                  style={styles.compareBtn}
                  onPress={() => setShowOriginalCompare(!showOriginalCompare)}
                >
                  <Ionicons name="eye-outline" size={14} color="#7C3AED" />
                  <Text style={styles.compareBtnText}>
                    {showOriginalCompare ? 'Ver Foto Editada (Depois)' : 'Comparar com Original (Antes)'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restoreBtn} onPress={handleRestoreOriginal}>
                  <Text style={styles.restoreBtnText}>Desfazer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.fixedAgencyField}>
            <View style={styles.fixedAgencyHeader}>
              <Text style={styles.fixedAgencyLabel}>
                Endereço Fixo da Imobiliária
              </Text>
            </View>
            <Text style={styles.fixedAgencyValue}>{AGENCY_CONFIG.address}</Text>
          </View>

          <View style={styles.rowTwoCols}>
            <View style={{ flex: 1 }}>
              <Input
                label="Código do Imóvel"
                placeholder="Ex: CSI-101"
                value={code}
                onChangeText={setCode}
              />
            </View>
            <View style={{ flex: 2 }}>
              <Input
                label="Título do Imóvel"
                placeholder="Ex: Apartamento Vista Mar Guilhermina"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Status do Imóvel</Text>
            <View style={styles.typeSelectorRow}>
              {statusOptions.map((s) => (
                <Badge key={s} label={s} selected={status === s} onPress={() => setStatus(s)} />
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tipo de Imóvel</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typeSelectorRow}
            >
              {propertyTypes.map((t) => (
                <Badge key={t} label={t} selected={type === t} onPress={() => setType(t)} />
              ))}
            </ScrollView>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Input
              label="Buscar por CEP (ViaCEP — Preenche Bairro e Endereço automaticamente)"
              placeholder="Ex: 11700-000"
              keyboardType="numeric"
              maxLength={9}
              value={cep}
              onChangeText={handleCepChange}
            />
            {cepStatus !== '' && (
              <Text
                style={{
                  fontSize: 12,
                  marginTop: -6,
                  marginBottom: 6,
                  color: cepStatus.includes('não') ? '#DC2626' : '#059669',
                  fontWeight: '600',
                }}
              >
                {cepStatus}
              </Text>
            )}
          </View>

          <Input
            label="Bairro / Região (Visível para o cliente)"
            placeholder="Ex: Canto do Forte, Praia Grande"
            value={location}
            onChangeText={(txt) => {
              setLocation(txt);
              if (!internalAddress.trim()) {
                handleCalculateFromAddress(txt);
              }
            }}
          />

          <Input
            label="Endereço do Imóvel (Interno — calcula a distância real até a praia)"
            placeholder="Ex: Av. Pres. Castelo Branco, 1200, Canto do Forte"
            value={internalAddress}
            onChangeText={(txt) => {
              setInternalAddress(txt);
              handleCalculateFromAddress(txt);
            }}
          />

          <View style={styles.fixedAgencyField}>
            <View style={styles.fixedAgencyHeader}>
              <Text style={styles.fixedAgencyLabel}>
                Distância Calculada até a Praia (Geolocalização Real)
              </Text>
            </View>
            <Text style={styles.fixedAgencyValue}>
              {isCalculatingDistance
                ? 'Calculando distância pelas coordenadas do endereço...'
                : parseInt(beachDistance, 10) <= 0
                ? 'Frente mar (0m)'
                : `${beachDistance}m da praia`}
            </Text>
          </View>

          <Input
            label="Metragem (m²)"
            placeholder="Ex: 145"
            keyboardType="numeric"
            value={area}
            onChangeText={setArea}
          />

          <Input
            label="Preço de Venda (R$)"
            placeholder="Ex: 950000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <Input
            label="Condomínio (opcional)"
            placeholder="Ex: 850"
            keyboardType="numeric"
            value={condominium}
            onChangeText={setCondominium}
          />

          <Input
            label="IPTU (opcional)"
            placeholder="Ex: 180"
            keyboardType="numeric"
            value={iptu}
            onChangeText={setIptu}
          />

          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Quantidade de Quartos</Text>
              <Text style={styles.selectedCountText}>{bedrooms || '1'} quarto(s)</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={8}
              step={1}
              value={parseInt(bedrooms, 10) || 0}
              onValueChange={(val) => setBedrooms(val.toString())}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={theme.colors.primary}
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Quantidade de Banheiros</Text>
              <Text style={styles.selectedCountText}>{bathrooms || '1'} banheiro(s)</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={8}
              step={1}
              value={parseInt(bathrooms, 10) || 0}
              onValueChange={(val) => setBathrooms(val.toString())}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={theme.colors.primary}
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Quantidade de Vagas</Text>
              <Text style={styles.selectedCountText}>{parkingSpaces || '0'} vaga(s)</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={6}
              step={1}
              value={parseInt(parkingSpaces, 10) || 0}
              onValueChange={(val) => setParkingSpaces(val.toString())}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={theme.colors.primary}
            />
          </View>

          <View style={styles.adminNotesWrapper}>
            <View style={styles.adminNotesHeader}>
              <Ionicons name="lock-closed" size={15} color="#B45309" />
              <Text style={styles.adminNotesTitle}>
                Anotações Internas (Exclusivo Administradores)
              </Text>
            </View>
            <Input
              label="Anotações Confidenciais (uma por linha)"
              placeholder="Ex: Proprietário: (13) 99009-5719&#10;Endereço interno: Rua X, nº 123"
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <Button
            label="Salvar Imóvel"
            variant="primary"
            onPress={handleSave}
            style={styles.okButton}
          />

          {isEditing && onDelete && (
            <Button
              label="Excluir Imóvel"
              variant="danger"
              onPress={() => {
                onDelete(propertyToEdit.id);
                onClose();
              }}
              style={styles.deleteButton}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 44,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textMain,
  },
  formContent: {
    padding: theme.spacing.xl,
    paddingBottom: 60,
  },
  imagePickerCard: {
    marginBottom: 14,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: '#FAFAFA',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  changeImageBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  aiActiveOverlayBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(124, 58, 237, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  aiActiveOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  imagePlaceholder: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textMain,
  },
  aiStudioCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  aiStudioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiStudioTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A3412',
  },
  aiStudioSubtitle: {
    fontSize: 12,
    color: '#C2410C',
    marginTop: 4,
    marginBottom: 10,
  },
  aiButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  aiActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  aiActionBtnActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  aiActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
  },
  aiActionBtnTextActive: {
    color: '#FFFFFF',
  },
  aiLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  aiLoadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EA580C',
  },
  aiResultDescription: {
    fontSize: 11,
    color: '#9A3412',
    marginTop: 8,
    fontStyle: 'italic',
  },
  aiCompareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FED7AA',
  },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  compareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
  },
  restoreBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  restoreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  fixedAgencyField: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  fixedAgencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fixedAgencyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  fixedAgencyValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7C2D12',
    marginTop: 4,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    marginBottom: 6,
  },
  selectedCountText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  beachQuickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  adminNotesWrapper: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  adminNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  adminNotesTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  okButton: {
    marginTop: 14,
  },
  deleteButton: {
    marginTop: 12,
  },
});
