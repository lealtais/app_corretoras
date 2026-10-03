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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { Input, Button, Badge, IconButton } from '../components/ui';
import { theme } from '../constants/theme';

interface PropertyFormModalProps {
  visible: boolean;
  propertyToEdit?: Property | null;
  onClose: () => void;
  onSave: (property: Property) => void;
  onDelete?: (id: string) => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  visible,
  propertyToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!propertyToEdit;

  const [name, setName] = useState('');
  const [type, setType] = useState<'Apartamento' | 'Casa' | 'Cobertura' | 'Terreno' | 'Outros'>('Apartamento');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [condominium, setCondominium] = useState('');
  const [iptu, setIptu] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [parkingSpaces, setParkingSpaces] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (propertyToEdit) {
      setName(propertyToEdit.name);
      setType(propertyToEdit.type);
      setLocation(propertyToEdit.location);
      setArea(propertyToEdit.area.toString());
      setPrice(propertyToEdit.price.toString());
      setCondominium(propertyToEdit.condominium ? propertyToEdit.condominium.toString() : '');
      setIptu(propertyToEdit.iptu ? propertyToEdit.iptu.toString() : '');
      setBedrooms(propertyToEdit.bedrooms.toString());
      setBathrooms(propertyToEdit.bathrooms.toString());
      setParkingSpaces(propertyToEdit.parkingSpaces ? propertyToEdit.parkingSpaces.toString() : '');
      setNotes(propertyToEdit.notes.join('\n'));
      setImageUrl(propertyToEdit.imageUrl);
    } else {
      setName('');
      setType('Apartamento');
      setLocation('');
      setArea('');
      setPrice('');
      setCondominium('');
      setIptu('');
      setBedrooms('2');
      setBathrooms('2');
      setParkingSpaces('1');
      setNotes('');
      setImageUrl('');
    }
  }, [propertyToEdit, visible]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
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
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do imóvel.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Atenção', 'Informe a localização do imóvel.');
      return;
    }
    const parsedPrice = parseFloat(price.replace(/\D/g, '')) || 0;
    if (parsedPrice <= 0) {
      Alert.alert('Atenção', 'Informe um preço válido.');
      return;
    }

    const notesList = notes
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const savedProperty: Property = {
      id: propertyToEdit ? propertyToEdit.id : Date.now().toString(),
      name: name.trim(),
      type,
      location: location.trim(),
      area: parseFloat(area) || 0,
      price: parsedPrice,
      condominium: condominium ? parseFloat(condominium.replace(/\D/g, '')) : undefined,
      iptu: iptu ? parseFloat(iptu.replace(/\D/g, '')) : undefined,
      bedrooms: parseInt(bedrooms, 10) || 0,
      bathrooms: parseInt(bathrooms, 10) || 0,
      parkingSpaces: parkingSpaces ? parseInt(parkingSpaces, 10) : 0,
      notes: notesList,
      isFavorite: propertyToEdit ? propertyToEdit.isFavorite : false,
      status: propertyToEdit ? propertyToEdit.status : 'Disponível',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
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

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            variant="ghost"
            onPress={onClose}
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />}
          />
          <Text style={styles.headerTitle}>{isEditing ? 'Editar imóvel' : 'Novo imóvel'}</Text>
          <IconButton
            variant="ghost"
            onPress={pickImage}
            icon={<Ionicons name="image-outline" size={26} color={theme.colors.primary} />}
          />
        </View>

        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.imagePickerCard} onPress={pickImage} activeOpacity={0.8}>
            {imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUrl }} style={styles.imagePreview} resizeMode="cover" />
                <View style={styles.changeImageBadge}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                  <Text style={styles.changeImageText}>Trocar foto da galeria</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <View style={styles.imageIconCircle}>
                  <Ionicons name="images-outline" size={28} color={theme.colors.primary} />
                </View>
                <Text style={styles.imagePlaceholderText}>Toque para adicionar foto da galeria</Text>
                <Text style={styles.imagePlaceholderSub}>JPG ou PNG do seu celular</Text>
              </View>
            )}
          </TouchableOpacity>

          <Input
            label="Nome do imóvel"
            placeholder="Ex: Casa condomínio Canto do Forte"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tipo de Imóvel</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeSelectorRow}>
              {propertyTypes.map((t) => (
                <Badge
                  key={t}
                  label={t}
                  selected={type === t}
                  onPress={() => setType(t)}
                />
              ))}
            </ScrollView>
          </View>

          <Input
            label="Localização"
            placeholder="Ex: Canto do Forte, Praia Grande"
            value={location}
            onChangeText={setLocation}
          />

          <Input
            label="Metragem (m²)"
            placeholder="Ex: 800"
            keyboardType="numeric"
            value={area}
            onChangeText={setArea}
          />

          <Input
            label="Preço (R$)"
            placeholder="Ex: 2.800.000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <Input
            label="Condomínio (opcional)"
            placeholder="Ex: 1.000"
            keyboardType="numeric"
            value={condominium}
            onChangeText={setCondominium}
          />

          <Input
            label="IPTU (opcional)"
            placeholder="Ex: 200"
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
              minimumValue={1}
              maximumValue={8}
              step={1}
              value={parseInt(bedrooms, 10) || 1}
              onValueChange={(val) => setBedrooms(val.toString())}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={theme.colors.primary}
            />
            <View style={styles.sliderLimitsRow}>
              <Text style={styles.sliderLimitText}>1</Text>
              <Text style={styles.sliderLimitText}>8</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Quantidade de Banheiros</Text>
              <Text style={styles.selectedCountText}>{bathrooms || '1'} banheiro(s)</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={8}
              step={1}
              value={parseInt(bathrooms, 10) || 1}
              onValueChange={(val) => setBathrooms(val.toString())}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={theme.colors.primary}
            />
            <View style={styles.sliderLimitsRow}>
              <Text style={styles.sliderLimitText}>1</Text>
              <Text style={styles.sliderLimitText}>8</Text>
            </View>
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
            <View style={styles.sliderLimitsRow}>
              <Text style={styles.sliderLimitText}>0</Text>
              <Text style={styles.sliderLimitText}>6</Text>
            </View>
          </View>

          <Input
            label="Anotações"
            placeholder="Ex: Proprietário: (13) 99009-5719&#10;Com elevador&#10;Móveis planejados"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

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
                Alert.alert('Excluir Imóvel', 'Tem certeza que deseja remover este imóvel?', [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                      onDelete(propertyToEdit.id);
                      onClose();
                    },
                  },
                ]);
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
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
  formContent: {
    padding: theme.spacing.xl,
    paddingBottom: 60,
  },
  imagePickerCard: {
    marginBottom: 20,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: '#FAFAFA',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  changeImageBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  imagePlaceholderSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
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
    fontWeight: '600',
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
  slider: {
    width: '100%',
    height: 38,
    marginVertical: 4,
  },
  sliderLimitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: -4,
  },
  sliderLimitText: {
    fontSize: 11,
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  okButton: {
    marginTop: 14,
  },
  deleteButton: {
    marginTop: 14,
  },
});
